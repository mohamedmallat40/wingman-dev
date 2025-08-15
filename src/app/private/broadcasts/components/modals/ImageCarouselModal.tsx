'use client';

import React from 'react';

import type { MediaFile } from '@/components/ui/file-upload/MediaUpload';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface ImageCarouselModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: MediaFile[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const ImageCarouselModal: React.FC<ImageCarouselModalProps> = ({
  isOpen,
  onClose,
  files,
  currentIndex,
  onIndexChange
}) => {

  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : files.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < files.length - 1 ? currentIndex + 1 : 0);
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    },
    [currentIndex, files.length]
  );

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen, handleKeyDown]);

  if (!files[currentIndex]) return null;

  const currentFile = files[currentIndex];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='5xl'
      hideCloseButton
      classNames={{
        base: 'bg-black/95 backdrop-blur-md',
        backdrop: 'bg-black/80',
        body: 'p-0',
        header: 'border-b border-white/10'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: 'easeIn'
            }
          }
        }
      }}
    >
      <ModalContent>
        <ModalHeader className='flex items-center justify-between p-4'>
          <div className='flex items-center gap-2 text-white'>
            <Icon icon='solar:gallery-linear' className='h-5 w-5' />
            <span className='text-sm font-medium'>
              {currentIndex + 1} of {files.length}
            </span>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              isIconOnly
              variant='light'
              color='default'
              onPress={handlePrevious}
              isDisabled={files.length <= 1}
              className='text-white hover:bg-white/10'
              aria-label="Previous"
            >
              <Icon icon='solar:chevron-left-linear' className='h-5 w-5' />
            </Button>

            <Button
              isIconOnly
              variant='light'
              color='default'
              onPress={handleNext}
              isDisabled={files.length <= 1}
              className='text-white hover:bg-white/10'
              aria-label="Next"
            >
              <Icon icon='solar:chevron-right-linear' className='h-5 w-5' />
            </Button>

            <Button
              isIconOnly
              variant='light'
              color='default'
              onPress={onClose}
              className='text-white hover:bg-white/10'
              aria-label="Close"
            >
              <Icon icon='solar:close-linear' className='h-5 w-5' />
            </Button>
          </div>
        </ModalHeader>

        <ModalBody className='p-0'>
          <div className='relative flex h-[70vh] items-center justify-center'>
            {currentFile.type === 'image' ? (
              <img
                src={currentFile.preview || currentFile.url}
                alt={currentFile.alt || `Image ${currentIndex + 1}`}
                className='max-h-full max-w-full object-contain'
                style={{ userSelect: 'none' }}
              />
            ) : (
              <video
                src={currentFile.preview || currentFile.url}
                controls
                className='max-h-full max-w-full'
                style={{ userSelect: 'none' }}
              />
            )}

            {/* Navigation overlays */}
            {files.length > 1 && (
              <>
                <Button
                  isIconOnly
                  variant='flat'
                  color='default'
                  onPress={handlePrevious}
                  className='absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
                  aria-label="Previous"
                >
                  <Icon icon='solar:chevron-left-linear' className='h-6 w-6' />
                </Button>

                <Button
                  isIconOnly
                  variant='flat'
                  color='default'
                  onPress={handleNext}
                  className='absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70'
                  aria-label="Next"
                >
                  <Icon icon='solar:chevron-right-linear' className='h-6 w-6' />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {files.length > 1 && (
            <div className='border-t border-white/10 p-4'>
              <div className='scrollbar-hide flex gap-2 overflow-x-auto'>
                {files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => onIndexChange(index)}
                    className={`flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                      index === currentIndex
                        ? 'ring-2 ring-primary ring-offset-2 ring-offset-black/95'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    {file.type === 'image' ? (
                      <img
                        src={file.preview || file.url}
                        alt={`Thumbnail ${index + 1}`}
                        className='h-16 w-16 object-cover'
                      />
                    ) : (
                      <div className='flex h-16 w-16 items-center justify-center bg-gray-800'>
                        <Icon icon='solar:play-circle-linear' className='h-6 w-6 text-white' />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};