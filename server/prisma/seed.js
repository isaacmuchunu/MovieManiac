import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// All genres as specified
const genres = [
  { name: 'Action', slug: 'action', icon: '💥' },
  { name: 'Adult', slug: 'adult', icon: '🔞' },
  { name: 'Adventure', slug: 'adventure', icon: '🗺️' },
  { name: 'Animation', slug: 'animation', icon: '🎬' },
  { name: 'Biography', slug: 'biography', icon: '📖' },
  { name: 'Comedy', slug: 'comedy', icon: '😂' },
  { name: 'Costume', slug: 'costume', icon: '👗' },
  { name: 'Crime', slug: 'crime', icon: '🔍' },
  { name: 'Documentary', slug: 'documentary', icon: '🎥' },
  { name: 'Drama', slug: 'drama', icon: '🎭' },
  { name: 'Family', slug: 'family', icon: '👨‍👩‍👧‍👦' },
  { name: 'Fantasy', slug: 'fantasy', icon: '🧙' },
  { name: 'Film-Noir', slug: 'film-noir', icon: '🎩' },
  { name: 'Game-Show', slug: 'game-show', icon: '🎮' },
  { name: 'History', slug: 'history', icon: '📜' },
  { name: 'Horror', slug: 'horror', icon: '👻' },
  { name: 'Kungfu', slug: 'kungfu', icon: '🥋' },
  { name: 'Music', slug: 'music', icon: '🎵' },
  { name: 'Musical', slug: 'musical', icon: '🎤' },
  { name: 'Mystery', slug: 'mystery', icon: '🕵️' },
  { name: 'News', slug: 'news', icon: '📰' },
  { name: 'Reality', slug: 'reality', icon: '📺' },
  { name: 'Reality-TV', slug: 'reality-tv', icon: '📹' },
  { name: 'Romance', slug: 'romance', icon: '💕' },
  { name: 'Sci-Fi', slug: 'sci-fi', icon: '🚀' },
  { name: 'Science Fiction', slug: 'science-fiction', icon: '🛸' },
  { name: 'Short', slug: 'short', icon: '⏱️' },
  { name: 'Sport', slug: 'sport', icon: '⚽' },
  { name: 'Talk', slug: 'talk', icon: '💬' },
  { name: 'Talk-Show', slug: 'talk-show', icon: '🎙️' },
  { name: 'Thriller', slug: 'thriller', icon: '😱' },
  { name: 'TV Movie', slug: 'tv-movie', icon: '📺' },
  { name: 'TV Show', slug: 'tv-show', icon: '🖥️' },
  { name: 'War', slug: 'war', icon: '⚔️' },
  { name: 'War & Politics', slug: 'war-politics', icon: '🏛️' },
  { name: 'Western', slug: 'western', icon: '🤠' },
];

// All countries as specified with ISO codes
const countries = [
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Seed genres
  console.log('📚 Seeding genres...');
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { slug: genre.slug, icon: genre.icon },
      create: genre,
    });
  }
  console.log(`✅ Seeded ${genres.length} genres`);

  // Seed countries
  console.log('🌍 Seeding countries...');
  for (const country of countries) {
    await prisma.country.upsert({
      where: { code: country.code },
      update: { name: country.name, flag: country.flag },
      create: country,
    });
  }
  console.log(`✅ Seeded ${countries.length} countries`);

  // Create default admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);

  await prisma.user.upsert({
    where: { email: 'admin@moviemania.com' },
    update: {},
    create: {
      email: 'admin@moviemania.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
      emailVerified: true,
      subscription: {
        create: {
          plan: 'PREMIUM',
          status: 'ACTIVE',
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
      },
    },
  });
  console.log('✅ Admin user created (admin@moviemania.com / admin123)');

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
