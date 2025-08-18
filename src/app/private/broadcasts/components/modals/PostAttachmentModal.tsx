'use client';

import React from 'react';

import { Button, Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/react';
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
        <ModalHeader className='flex items-center justify-between px-6 py-4'>
          <div className='text-white'>
            {postTitle && <h2 className='max-w-md truncate text-lg font-medium'>{postTitle}</h2>}
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

        <ModalBody className='relative overflow-hidden p-0'>
          {/* Image counter overlay */}
          {attachments.length > 1 && (
            <div className='absolute top-6 left-6 z-30'>
              <div className='rounded-full bg-black/40 px-3 py-2 backdrop-blur-md'>
                <div className='flex items-center gap-2 text-sm font-medium text-white'>
                  <Icon icon='solar:gallery-bold-duotone' className='text-primary h-4 w-4' />
                  <span>
                    {currentIndex + 1} / {attachments.length}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Keyboard shortcuts hint */}
          {attachments.length > 1 && (
            <div className='absolute bottom-6 left-6 z-20'>
              <div className='rounded-full bg-black/40 px-3 py-1 backdrop-blur-md'>
                <div className='flex items-center gap-2 text-xs text-white/70'>
                  <Icon icon='solar:keyboard-linear' className='h-3 w-3' />
                  <span>{t('accessibility.navigationKeys')}</span>
                </div>
              </div>
            </div>
          )}

          <div className='relative flex h-[80vh] items-center justify-center overflow-hidden bg-gradient-to-br from-black/10 via-black/20 to-black/30 p-8'>
            {currentType === 'image' ? (
              <img
                src={attachmentUrl}
                alt={
                  postTitle
                    ? `${postTitle} - Image ${currentIndex + 1}`
                    : `Image ${currentIndex + 1}`
                }
                className='rounded-lg object-contain shadow-2xl'
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
              <div className='flex flex-col items-center justify-center p-8 text-white'>
                <Icon icon='solar:file-linear' className='mb-4 h-16 w-16 text-white/50' />
                <p className='mb-2 text-lg'>{currentAttachment.split('/').pop()}</p>
                <p className='mb-4 text-sm text-white/70'>
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
                  className='absolute top-1/2 left-6 z-10 -translate-y-1/2 border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30'
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
                  className='absolute top-1/2 right-6 z-10 -translate-y-1/2 border-white/30 bg-white/20 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-white/30'
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
            <div className='border-t border-white/10 bg-black/30 p-6 backdrop-blur-sm'>
              <div className='flex items-center justify-center overflow-hidden'>
                <div
                  className='flex max-w-full gap-3 overflow-x-auto pb-2'
                  style={
                    {
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none'
                    } as React.CSSProperties
                  }
                >
                  {attachments.map((attachment, index) => {
                    const type = getFileType(attachment);
                    const url = `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${attachment}`;

                    return (
                      <button
                        key={index}
                        onClick={() => onIndexChange(index)}
                        className={`flex-shrink-0 transform overflow-hidden rounded-xl transition-all duration-300 ${
                          index === currentIndex
                            ? 'ring-primary scale-110 shadow-xl ring-3 ring-offset-2 ring-offset-black/95'
                            : 'opacity-60 shadow-md hover:scale-105 hover:opacity-100'
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
                              <Icon
                                icon='solar:play-circle-bold'
                                className='h-6 w-6 text-white drop-shadow-lg'
                              />
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
