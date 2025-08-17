'use client';

import React from 'react';

import { Button, Card, CardBody, Image } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

export interface LinkMetadata {
  url: string;
  title: string;
  description: string;
  image?: string;
  siteName?: string;
  favicon?: string;
}

interface LinkPreviewProps {
  metadata: LinkMetadata;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  compact?: boolean;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({
  metadata,
  onRemove,
  showRemoveButton = true,
  compact = false
}) => {
  const handleClick = () => {
    window.open(metadata.url, '_blank', 'noopener,noreferrer');
  };

  const domain = new URL(metadata.url).hostname.replace('www.', '');

  const cardId = `link-preview-${metadata.url.replace(/[^a-zA-Z0-9]/g, '')}`;

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className='group relative w-full max-w-full'
      >
        <Card
          isPressable
          onPress={handleClick}
          className='border-default-200 hover:border-primary/20 from-background to-default-50 focus-visible:ring-primary w-full cursor-pointer border bg-gradient-to-r transition-all duration-200 hover:shadow-md focus-visible:ring-2 focus-visible:ring-offset-2'
          role='button'
          tabIndex={0}
          aria-label={`Open link: ${metadata.title}`}
          id={cardId}
        >
          <CardBody className='p-4'>
            <div className='flex w-full items-center gap-3'>
              {metadata.favicon && (
                <div className='flex-shrink-0 rounded-sm bg-white p-1 shadow-sm'>
                  <Image src={metadata.favicon} alt='Site favicon' className='h-4 w-4' />
                </div>
              )}
              <div className='min-w-0 flex-1'>
                <p className='text-foreground truncate text-sm leading-tight font-semibold'>
                  {metadata.title}
                </p>
                <div className='mt-1 flex items-center gap-2'>
                  <p className='text-foreground-500 truncate text-xs'>
                    {metadata.siteName || domain}
                  </p>
                  <div className='bg-foreground-300 h-1 w-1 flex-shrink-0 rounded-full' />
                  <Icon
                    icon='solar:external-link-outline'
                    className='text-foreground-400 h-3 w-3 flex-shrink-0'
                  />
                </div>
              </div>
              <Icon
                icon='solar:link-broken-minimalistic-linear'
                className='text-foreground-400 group-hover:text-primary h-5 w-5 flex-shrink-0 transition-colors'
              />
            </div>
          </CardBody>
        </Card>

        {showRemoveButton && onRemove && (
          <Button
            isIconOnly
            size='sm'
            variant='flat'
            color='danger'
            className='absolute -top-2 -right-2 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100'
            onPress={() => onRemove()}
          >
            <Icon icon='solar:close-circle-bold' className='h-4 w-4' />
          </Button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className='group relative w-full max-w-full'
    >
      <Card
        isPressable
        onPress={handleClick}
        className='border-default-200 hover:border-primary/20 from-background to-default-50 focus-visible:ring-primary w-full cursor-pointer border bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2'
        role='button'
        tabIndex={0}
        aria-label={`Open link: ${metadata.title}`}
        id={cardId}
      >
        <CardBody className='p-0'>
          <div className='flex w-full'>
            {/* Image Section */}
            {metadata.image && (
              <div className='bg-default-100 relative flex h-28 w-40 flex-shrink-0 items-center justify-center overflow-hidden'>
                <Image
                  src={metadata.image}
                  alt={metadata.title}
                  className='max-h-full max-w-full object-contain'
                  fallbackSrc='/api/placeholder/160/112'
                />
                <div className='to-background/10 absolute inset-0 bg-gradient-to-r from-transparent' />
              </div>
            )}

            {/* Content Section */}
            <div className='w-full min-w-0 flex-1 p-5'>
              <div className='w-full space-y-3'>
                {/* Site info */}
                <div className='flex items-center gap-2'>
                  {metadata.favicon && (
                    <div className='flex-shrink-0 rounded-sm bg-white p-1 shadow-sm'>
                      <Image src={metadata.favicon} alt='Site favicon' className='h-4 w-4' />
                    </div>
                  )}
                  <span className='text-foreground-600 truncate text-xs font-medium'>
                    {metadata.siteName || domain}
                  </span>
                  <div className='bg-foreground-300 h-1 w-1 flex-shrink-0 rounded-full' />
                  <Icon
                    icon='solar:link-broken-minimalistic-linear'
                    className='text-foreground-400 h-3 w-3 flex-shrink-0'
                  />
                </div>

                {/* Title */}
                <h4 className='text-foreground line-clamp-2 text-base leading-tight font-bold tracking-tight'>
                  {metadata.title}
                </h4>

                {/* Description */}
                {metadata.description && (
                  <p className='text-foreground-700 line-clamp-2 text-sm leading-relaxed'>
                    {metadata.description}
                  </p>
                )}

                {/* URL */}
                <div className='flex items-center gap-2 pt-1'>
                  <p className='text-foreground-400 bg-default-100 truncate rounded-md px-2 py-1 font-mono text-xs'>
                    {new URL(metadata.url).hostname}
                  </p>
                  <Icon
                    icon='solar:external-link-outline'
                    className='text-foreground-400 h-3 w-3 flex-shrink-0'
                  />
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Remove button */}
      {showRemoveButton && onRemove && (
        <Button
          isIconOnly
          size='sm'
          variant='flat'
          color='danger'
          className='absolute -top-2 -right-2 opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100'
          onPress={() => onRemove()}
        >
          <Icon icon='solar:close-circle-bold' className='h-4 w-4' />
        </Button>
      )}
    </motion.div>
  );
};
