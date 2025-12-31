import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { prisma } from '../config/database.js';
import { cache } from '../config/redis.js';
import { logger } from '../utils/logger.js';
import { QUALITY_PROFILES } from './streamingService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, '../../uploads/videos');
const TRANSCODED_DIR = path.join(__dirname, '../../transcoded');

// Set FFmpeg paths if provided
if (process.env.FFMPEG_PATH) {
  ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);
}
if (process.env.FFPROBE_PATH) {
  ffmpeg.setFfprobePath(process.env.FFPROBE_PATH);
}

// Get video metadata using ffprobe
export const getVideoMetadata = (inputPath) => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputPath, (err, metadata) => {
      if (err) {
        reject(err);
        return;
      }

      const videoStream = metadata.streams.find((s) => s.codec_type === 'video');
      const audioStream = metadata.streams.find((s) => s.codec_type === 'audio');

      resolve({
        duration: Math.floor(metadata.format.duration),
        width: videoStream?.width,
        height: videoStream?.height,
        bitrate: Math.floor(metadata.format.bit_rate / 1000),
        codec: videoStream?.codec_name,
        fps: eval(videoStream?.r_frame_rate) || 24,
        audioCodec: audioStream?.codec_name,
        audioBitrate: audioStream?.bit_rate ? Math.floor(audioStream.bit_rate / 1000) : 128,
      });
    });
  });
};

// Determine which qualities to generate based on source
const getTargetQualities = (sourceWidth, sourceHeight) => {
  const qualities = [];

  Object.entries(QUALITY_PROFILES).forEach(([name, profile]) => {
    if (sourceWidth >= profile.width || sourceHeight >= profile.height) {
      qualities.push({ name, ...profile });
    }
  });

  // Always include at least SD_480
  if (qualities.length === 0 || !qualities.find(q => q.name === 'SD_480')) {
    qualities.push({ name: 'SD_480', ...QUALITY_PROFILES.SD_480 });
  }

  return qualities.sort((a, b) => a.bitrate - b.bitrate);
};

// Transcode video to HLS with multiple qualities
export const transcodeToHLS = async (videoId, inputPath, onProgress) => {
  const outputDir = path.join(TRANSCODED_DIR, videoId);

  // Create output directory
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true });
  }

  // Update status to processing
  await prisma.video.update({
    where: { id: videoId },
    data: { status: 'PROCESSING' },
  });

  try {
    // Get source video metadata
    const metadata = await getVideoMetadata(inputPath);
    logger.info(`Transcoding video ${videoId}: ${metadata.width}x${metadata.height}, ${metadata.duration}s`);

    // Update video duration
    await prisma.video.update({
      where: { id: videoId },
      data: { duration: metadata.duration },
    });

    // Get target qualities
    const qualities = getTargetQualities(metadata.width, metadata.height);
    logger.info(`Target qualities: ${qualities.map(q => q.name).join(', ')}`);

    // Transcode each quality
    const qualityPromises = qualities.map((quality) =>
      transcodeQuality(videoId, inputPath, outputDir, quality, onProgress)
    );

    const results = await Promise.all(qualityPromises);

    // Save quality info to database
    for (const result of results) {
      await prisma.videoQuality.create({
        data: {
          videoId,
          quality: result.quality,
          width: result.width,
          height: result.height,
          bitrate: result.bitrate,
          filePath: result.filePath,
          fileSize: result.fileSize,
        },
      });
    }

    // Generate master playlist
    await generateMasterPlaylist(videoId, outputDir, results);

    // Update video status
    await prisma.video.update({
      where: { id: videoId },
      data: {
        status: 'READY',
        hlsPath: `${videoId}/master.m3u8`,
      },
    });

    // Clear cache
    await cache.del(`stream:${videoId}`);

    logger.info(`Video ${videoId} transcoding completed`);

    return results;
  } catch (error) {
    logger.error(`Transcoding failed for video ${videoId}:`, error);

    await prisma.video.update({
      where: { id: videoId },
      data: { status: 'FAILED' },
    });

    throw error;
  }
};

// Transcode single quality variant
const transcodeQuality = (videoId, inputPath, outputDir, quality, onProgress) => {
  return new Promise((resolve, reject) => {
    const qualityDir = path.join(outputDir, quality.name);

    if (!existsSync(qualityDir)) {
      mkdirSync(qualityDir, { recursive: true });
    }

    const outputPath = path.join(qualityDir, 'playlist.m3u8');

    logger.info(`Starting transcode for ${quality.name} (${quality.width}x${quality.height})`);

    ffmpeg(inputPath)
      // Video settings
      .videoCodec('libx264')
      .videoBitrate(quality.bitrate)
      .size(`${quality.width}x${quality.height}`)
      .autopad()
      .outputOptions([
        '-preset fast',
        '-profile:v main',
        '-level 4.0',
        '-g 48',           // GOP size (2 seconds at 24fps)
        '-keyint_min 48',
        '-sc_threshold 0', // Disable scene detection for consistent segments
      ])
      // Audio settings
      .audioCodec('aac')
      .audioBitrate(quality.audioBitrate)
      .audioChannels(2)
      .audioFrequency(48000)
      // HLS settings
      .outputOptions([
        '-f hls',
        '-hls_time 4',           // 4 second segments
        '-hls_list_size 0',      // Keep all segments in playlist
        '-hls_segment_type mpegts',
        `-hls_segment_filename ${qualityDir}/segment_%03d.ts`,
        '-hls_playlist_type vod',
      ])
      .output(outputPath)
      .on('start', (commandLine) => {
        logger.debug(`FFmpeg command: ${commandLine}`);
      })
      .on('progress', (progress) => {
        if (onProgress) {
          onProgress({
            quality: quality.name,
            percent: progress.percent || 0,
            currentKbps: progress.currentKbps,
            targetSize: progress.targetSize,
          });
        }
      })
      .on('end', async () => {
        // Calculate file size
        const files = await fs.readdir(qualityDir);
        let totalSize = 0;
        for (const file of files) {
          const stats = await fs.stat(path.join(qualityDir, file));
          totalSize += stats.size;
        }

        logger.info(`Completed ${quality.name} transcode: ${Math.round(totalSize / 1024 / 1024)}MB`);

        resolve({
          quality: quality.name,
          width: quality.width,
          height: quality.height,
          bitrate: quality.bitrate,
          filePath: `${videoId}/${quality.name}`,
          fileSize: BigInt(totalSize),
        });
      })
      .on('error', (err) => {
        logger.error(`FFmpeg error for ${quality.name}:`, err);
        reject(err);
      })
      .run();
  });
};

// Generate master HLS playlist
const generateMasterPlaylist = async (videoId, outputDir, qualities) => {
  let playlist = '#EXTM3U\n';
  playlist += '#EXT-X-VERSION:3\n\n';

  // Sort by bitrate (lowest first)
  const sortedQualities = qualities.sort((a, b) => a.bitrate - b.bitrate);

  for (const quality of sortedQualities) {
    playlist += `#EXT-X-STREAM-INF:BANDWIDTH=${quality.bitrate * 1000},`;
    playlist += `RESOLUTION=${quality.width}x${quality.height},`;
    playlist += `NAME="${quality.quality}"\n`;
    playlist += `${quality.quality}/playlist.m3u8\n\n`;
  }

  await fs.writeFile(path.join(outputDir, 'master.m3u8'), playlist);
  logger.info(`Master playlist created for video ${videoId}`);
};

// Generate thumbnail from video
export const generateThumbnail = async (inputPath, outputPath, timestamp = '00:00:05') => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps: [timestamp],
        filename: path.basename(outputPath),
        folder: path.dirname(outputPath),
        size: '1280x720',
      })
      .on('end', () => {
        logger.info(`Thumbnail generated: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        logger.error('Thumbnail generation error:', err);
        reject(err);
      });
  });
};

// Extract multiple thumbnails for preview
export const generatePreviewThumbnails = async (inputPath, outputDir, count = 10) => {
  const metadata = await getVideoMetadata(inputPath);
  const interval = Math.floor(metadata.duration / (count + 1));

  const timestamps = [];
  for (let i = 1; i <= count; i++) {
    const seconds = interval * i;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    timestamps.push(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
  }

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .screenshots({
        timestamps,
        filename: 'preview_%i.jpg',
        folder: outputDir,
        size: '320x180',
      })
      .on('end', () => {
        logger.info(`Preview thumbnails generated in: ${outputDir}`);
        resolve(outputDir);
      })
      .on('error', (err) => {
        logger.error('Preview thumbnails error:', err);
        reject(err);
      });
  });
};

export default {
  getVideoMetadata,
  transcodeToHLS,
  generateThumbnail,
  generatePreviewThumbnails,
};
