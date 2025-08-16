'use client';

import React from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface PostAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachments: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
  postTitle?: string;
}

const getFileType = (filename: string): 'image' | 'video' | 'file' => {
  const extension = filename.toLowerCase().split('.').pop() || '';
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv'];
  
  if (imageExtensions.includes(extension)) return 'image';
  if (videoExtensions.includes(extension)) return 'video';
  return 'file';
};

export const PostAttachmentModal: React.FC<PostAttachmentModalProps> = ({
  isOpen,
  onClose,
  attachments,
  currentIndex,
  onIndexChange,
  postTitle
}) => {
  const t = useTranslations('broadcasts');

  const handlePrevious = () => {
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : attachments.length - 1);
  };

  const handleNext = () => {
    onIndexChange(currentIndex < attachments.length - 1 ? currentIndex + 1 : 0);
  };

  const handleKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevious();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'Escape') onClose();
    },
    [currentIndex, attachments.length]
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

  if (!attachments[currentIndex]) return null;

  const currentAttachment = attachments[currentIndex];
  const currentType = getFileType(currentAttachment);
  const attachmentUrl = `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${currentAttachment}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='full'
      hideCloseButton
      classNames={{
        base: 'bg-black/95 backdrop-blur-xl overflow-hidden',
        backdrop: 'bg-black/90',
        body: 'p-0 overflow-hidden',
        header: 'border-b border-white/10 bg-black/50 backdrop-blur-md'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.4,
              ease: 'easeOut'
            }
          },
          exit: {
            y: -30,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.25,
              ease: 'easeIn'
            }
          }
        }
      }}
    >
      <ModalContent>
        <ModalHeader className='flex items-center justify-between py-4 px-6'>
          <div className='text-white'>
            {postTitle && (
              <h2 className='text-lg font-medium truncate max-w-md'>
                {postTitle}
              </h2>
            )}
          </div>
          
          <Button
            isIconOnly
            variant='light'
            color='default'
            onPress={onClose}
            className='text-white hover:bg-white/10'
            size='lg'
            aria-label={t('accessibility.close')}
          >
            <Icon icon='solar:close-circle-bold' className='h-5 w-5' />
          </Button>
        </ModalHeader>

        <ModalBody className='p-0 relative overflow-hidden'>
          {/* Image counter overlay */}
          {attachments.length > 1 && (
            <div className='absolute top-6 left-6 z-30'>
              <div className='bg-black/40 backdrop-blur-md rounded-full px-3 py-2'>
                <div className='flex items-center gap-2 text-white text-sm font-medium'>
                  <Icon icon='solar:gallery-bold-duotone' className='h-4 w-4 text-primary' />
                  <span>{currentIndex + 1} / {attachments.length}</span>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          {attachments.length > 1 && (
            <div className='absolute bottom-6 left-6 z-20'>
              <div className='bg-black/40 backdrop-blur-md rounded-full px-3 py-1'>
                <div className='flex items-center gap-2 text-white/70 text-xs'>
                  <Icon icon='solar:keyboard-linear' className='h-3 w-3' />
                  <span>{t('accessibility.navigationKeys')}</span>
                </div>
              </div>
            </div>
          )}
          
          <div className='relative flex h-[80vh] items-center justify-center bg-gradient-to-br from-black/10 via-black/20 to-black/30 overflow-hidden p-8'>
            {currentType === 'image' ? (
              <img
                src={attachmentUrl}
                alt={postTitle ? `${postTitle} - Image ${currentIndex + 1}` : `Image ${currentIndex + 1}`}
                className='object-contain rounded-lg shadow-2xl'
                style={{ 
                  userSelect: 'none',
                  maxHeight: 'calc(80vh - 4rem)',
                  maxWidth: 'calc(100vw - 4rem)',
                  width: 'auto',
                  height: 'auto'
                }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  img.style.display = 'none';
                }}
              />
            ) : currentType === 'video' ? (
              <video
                src={attachmentUrl}
                controls
                className='rounded-lg shadow-2xl'
                style={{ 
                  userSelect: 'none',
                  maxHeight: 'calc(80vh - 4rem)',
                  maxWidth: 'calc(100vw - 4rem)',
                  width: 'auto',
                  height: 'auto'
                }}
                onError={(e) => {
                  const video = e.target as HTMLVideoElement;
                  video.style.display = 'none';
                }}
              />
            ) : (
              <div className='flex flex-col items-center justify-center text-white p-8'>
                <Icon icon='solar:file-linear' className='h-16 w-16 mb-4 text-white/50' />
                <p className='text-lg mb-2'>{currentAttachment.split('/').pop()}</p>
                <p className='text-sm text-white/70 mb-4'>
                  {currentAttachment.toLowerCase().split('.').pop()?.toUpperCase()} file
                </p>
                <Button
                  as='a'
                  href={attachmentUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  download
                  color='primary'
                  startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
                >
                  Download File
                </Button>
              </div>
            )}

            {/* Navigation overlays */}
            {attachments.length > 1 && (
              <>
                <Button
                  isIconOnly
                  variant='solid'
                  color='default'
                  onPress={handlePrevious}
                  className='absolute left-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all duration-200 shadow-lg z-10'
                  size='lg'
                  aria-label={t('accessibility.previousAttachment')}
                >
                  <Icon icon='solar:alt-arrow-left-bold' className='h-5 w-5' />
                </Button>

                <Button
                  isIconOnly
                  variant='solid'
                  color='default'
                  onPress={handleNext}
                  className='absolute right-6 top-1/2 -translate-y-1/2 bg-white/20 border-white/30 text-white backdrop-blur-md hover:bg-white/30 hover:scale-110 transition-all duration-200 shadow-lg z-10'
                  size='lg'
                  aria-label={t('accessibility.nextAttachment')}
                >
                  <Icon icon='solar:alt-arrow-right-bold' className='h-5 w-5' />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail strip */}
          {attachments.length > 1 && (
            <div className='border-t border-white/10 bg-black/30 backdrop-blur-sm p-6'>
              <div className='flex items-center justify-center overflow-hidden'>
                <div 
                  className='flex gap-3 overflow-x-auto pb-2 max-w-full' 
                  style={{ 
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none'
                  } as React.CSSProperties}
                >
                  {attachments.map((attachment, index) => {
                    const type = getFileType(attachment);
                    const url = `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${attachment}`;
                    
                    return (
                      <button
                        key={index}
                        onClick={() => onIndexChange(index)}
                        className={`flex-shrink-0 overflow-hidden rounded-xl transition-all duration-300 transform ${
                          index === currentIndex
                            ? 'ring-3 ring-primary ring-offset-2 ring-offset-black/95 scale-110 shadow-xl'
                            : 'opacity-60 hover:opacity-100 hover:scale-105 shadow-md'
                        }`}
                      >
                        {type === 'image' ? (
                          <img
                            src={url}
                            alt={`Thumbnail ${index + 1}`}
                            className='h-20 w-20 object-cover'
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              img.style.display = 'none';
                            }}
                          />
                        ) : type === 'video' ? (
                          <div className='relative h-20 w-20'>
                            <video
                              src={url}
                              className='h-20 w-20 object-cover'
                              muted
                              onError={(e) => {
                                const video = e.target as HTMLVideoElement;
                                video.style.display = 'none';
                              }}
                            />
                            <div className='absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm'>
                              <Icon icon='solar:play-circle-bold' className='h-6 w-6 text-white drop-shadow-lg' />
                            </div>
                          </div>
                        ) : (
                          <div className='flex h-20 w-20 items-center justify-center bg-gray-800/80 backdrop-blur-sm'>
                            <Icon icon='solar:file-linear' className='h-8 w-8 text-white/70' />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};