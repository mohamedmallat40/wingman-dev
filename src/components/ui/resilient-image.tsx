'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ImageProps } from 'next/image';

interface ResilientImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  timeout?: number;
  retryCount?: number;
  onImageError?: (error: Error) => void;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  fallbackSrc = '/images/placeholder.png',
  timeout = 10000, // 10 seconds
  retryCount = 2,
  onImageError,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [retries, setRetries] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setRetries(0);
    setIsLoading(true);
  }, [src]);

  // Timeout handling
  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      if (isLoading && retries < retryCount) {
        setRetries(prev => prev + 1);
        setCurrentSrc(`${src}?retry=${retries + 1}`);
      } else if (isLoading) {
        handleError(new Error('Image load timeout'));
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [isLoading, retries, retryCount, timeout, src]);

  const handleError = (error?: Error) => {
    console.warn(`Image failed to load: ${currentSrc}`, error);
    
    if (retries < retryCount) {
      setRetries(prev => prev + 1);
      setCurrentSrc(`${src}?retry=${retries + 1}`);
      return;
    }

    setHasError(true);
    setIsLoading(false);
    
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setRetries(0);
    }

    onImageError?.(error || new Error('Image load failed'));
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If we've exhausted all options, show a placeholder
  if (hasError && currentSrc === fallbackSrc) {
    return (
      <div 
        className="bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400"
        style={{ 
          width: typeof props.width === 'number' ? props.width : '100%',
          height: typeof props.height === 'number' ? props.height : '100%',
          minHeight: '40px'
        }}
      >
        <svg 
          width="24" 
          height="24" 
          fill="currentColor" 
          viewBox="0 0 24 24"
          className="opacity-50"
        >
          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onLoad={handleLoad}
      onError={handleError}
      loading={props.priority ? 'eager' : 'lazy'}
      placeholder={props.placeholder || 'blur'}
      blurDataURL={props.blurDataURL || 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAhEQACAQIHAQAAAAAAAAAAAAABAgADBAUREiExQVFhkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='}
    />
  );
};

export default ResilientImage;