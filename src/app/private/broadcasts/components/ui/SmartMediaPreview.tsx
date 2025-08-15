'use client';

import React from 'react';

import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';

import { Icon } from '@iconify/react';

import { ImageCarouselModal } from '../modals/ImageCarouselModal';

interface SmartMediaPreviewProps {
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
}

export const SmartMediaPreview: React.FC<SmartMediaPreviewProps> = ({ files, onFilesChange }) => {
  const [carouselOpen, setCarouselOpen] = React.useState(false);
  const [carouselIndex, setCarouselIndex] = React.useState(0);

  const handleRemoveFile = (fileToRemove: MediaFile) => {
    const updatedFiles = files.filter((file) => file.id !== fileToRemove.id);
    onFilesChange(updatedFiles);
  };

  const handleImageClick = (index: number) => {
    setCarouselIndex(index);
    setCarouselOpen(true);
  };

  if (files.length === 0) return null;

  return (
    <div className='w-full'>
      <ImageCarouselModal
        isOpen={carouselOpen}
        onClose={() => setCarouselOpen(false)}
        files={files}
        currentIndex={carouselIndex}
        onIndexChange={setCarouselIndex}
      />

      <div className='grid grid-cols-2 gap-2'>
        {files.map((file, index) => (
          <div
            key={file.id}
            className='group relative cursor-pointer'
            onClick={() => handleImageClick(index)}
          >
            <div className='bg-default-100 relative overflow-hidden rounded-lg'>
              {file.type === 'image' ? (
                <img
                  src={file.preview}
                  alt={file.altText || 'Preview'}
                  className='h-32 w-full object-cover'
                />
              ) : (
                <div className='relative h-32 w-full'>
                  <video src={file.preview} className='h-full w-full object-cover' muted />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                    <Icon icon='solar:play-bold' className='h-6 w-6 text-white' />
                  </div>
                </div>
              )}

              {/* Hover overlay */}
              <div className='absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20'>
                <div className='rounded-full bg-black/50 p-2 opacity-0 transition-opacity group-hover:opacity-100'>
                  <Icon icon='solar:eye-bold' className='h-4 w-4 text-white' />
                </div>
              </div>
            </div>

            {/* Remove button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveFile(file);
              }}
              className='bg-danger absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100'
            >
              <Icon icon='solar:close-circle-bold' className='h-3 w-3 text-white' />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};