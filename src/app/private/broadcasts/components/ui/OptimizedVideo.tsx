'use client';

import React, { memo, useRef, useState } from 'react';

import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

interface OptimizedVideoProps {
  src: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
  style?: React.CSSProperties;
  onLoadStart?: () => void;
  onError?: () => void;
}

const OptimizedVideo = memo<OptimizedVideoProps>(({
  src,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = true,
  preload = 'metadata',
  style,
  onLoadStart,
  onError,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadStart?.();
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-default-100 rounded-lg ${className}`}
        style={style}
      >
        <div className="text-center p-8">
          <Icon icon="solar:video-linear" className="h-12 w-12 text-default-400 mx-auto mb-2" />
          <p className="text-sm text-default-500">Failed to load video</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-default-100 flex items-center justify-center z-10">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-cover"
        style={style}
        controls={controls}
        autoPlay={autoPlay}
        muted={muted}
        preload={preload}
        playsInline
        onLoadStart={handleLoadStart}
        onLoadedData={handleLoadedData}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
      />

      {/* Custom Play Button Overlay (when controls are hidden) */}
      {!controls && (
        <button
          onClick={togglePlayPause}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors duration-200 group"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-200">
            <Icon 
              icon={isPlaying ? "solar:pause-bold" : "solar:play-bold"} 
              className="h-8 w-8 text-white" 
            />
          </div>
        </button>
      )}

      {/* Loading Indicator for Buffering */}
      <div 
        className={`absolute top-4 right-4 ${isLoading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
      >
        <div className="bg-black/50 backdrop-blur-sm rounded-full p-2">
          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  );
});

OptimizedVideo.displayName = 'OptimizedVideo';

export default OptimizedVideo;