import { useState, useRef, useEffect } from 'react';

/**
 * Optimized image component with lazy loading, placeholder, and error handling.
 * Uses Intersection Observer for lazy loading and shows a skeleton placeholder
 * while the image is loading.
 */
const OptimizedImage = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  fallback = null,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before visible
        threshold: 0.01
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e) => {
    setIsError(true);
    onError?.(e);
  };

  // Generate responsive TMDB image URLs
  const getSrcSet = () => {
    if (!src || !src.includes('image.tmdb.org')) return null;

    const baseUrl = src.replace(/\/w\d+\//, '/');
    return `
      ${baseUrl.replace('/t/p/', '/t/p/w185/')} 185w,
      ${baseUrl.replace('/t/p/', '/t/p/w300/')} 300w,
      ${baseUrl.replace('/t/p/', '/t/p/w500/')} 500w,
      ${baseUrl.replace('/t/p/', '/t/p/w780/')} 780w,
      ${baseUrl.replace('/t/p/', '/t/p/original/')} 1280w
    `;
  };

  const srcSet = getSrcSet();

  if (isError && fallback) {
    return fallback;
  }

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {/* Skeleton placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-netflix-dark-gray animate-pulse" />
      )}

      {/* Error placeholder */}
      {isError && !fallback && (
        <div className="absolute inset-0 bg-netflix-dark-gray flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Actual image */}
      {isInView && src && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={props.sizes || '(max-width: 768px) 100vw, 50vw'}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          className={`
            w-full h-full object-cover transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
          `}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImage;
