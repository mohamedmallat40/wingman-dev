'use client';

import React, { useCallback, useMemo, useState } from 'react';

import type { BroadcastPost } from '../../types';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip
} from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: BroadcastPost;
}

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  shareUrl: (url: string, text: string) => string;
  description: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post }) => {
  const t = useTranslations('broadcasts.post.share');
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate the share URL for this post
  const shareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/broadcasts/${post.id}`;
  }, [post.id]);

  // Generate optimized share text
  const shareText = useMemo(() => {
    const title = post.title || 'Check out this broadcast';
    const description = post.description
      ? post.description.length > 100
        ? `${post.description.substring(0, 100)}...`
        : post.description
      : '';
    const author = `${post.owner?.firstName || ''} ${post.owner?.lastName || ''}`.trim();

    return `${title}${description ? ` - ${description}` : ''}${author ? ` by ${author}` : ''} via Wingman`;
  }, [post]);

  // Social media platforms configuration
  const platforms: SocialPlatform[] = useMemo(
    () => [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        icon: 'skill-icons:linkedin',
        color: '#0077b5',
        shareUrl: (url, text) =>
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        description: 'Share with your professional network'
      },
      {
        id: 'twitter',
        name: 'X (Twitter)',
        icon: 'skill-icons:twitter',
        color: '#000000',
        shareUrl: (url, text) =>
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        description: 'Share with your followers'
      },
      {
        id: 'facebook',
        name: 'Facebook',
        icon: 'skill-icons:facebook',
        color: '#1877f2',
        shareUrl: (url, text) =>
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
        description: 'Share on your timeline'
      },
      {
        id: 'whatsapp',
        name: 'WhatsApp',
        icon: 'mdi:whatsapp',
        color: '#25d366',
        shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        description: 'Share in chat or status'
      },
      {
        id: 'telegram',
        name: 'Telegram',
        icon: 'mdi:telegram',
        color: '#0088cc',
        shareUrl: (url, text) =>
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        description: 'Share in Telegram'
      },
      {
        id: 'reddit',
        name: 'Reddit',
        icon: 'mdi:reddit',
        color: '#ff4500',
        shareUrl: (url, text) =>
          `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        description: 'Submit to Reddit'
      }
    ],
    []
  );

  // Copy link to clipboard
  const handleCopyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      addToast({
        title: 'Link Copied',
        description: t('copySuccess'),
        color: 'success'
      });

      // Reset copy success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      addToast({
        title: 'Copy Failed',
        description: t('copyError'),
        color: 'danger'
      });
    }
  }, [shareUrl, t]);

  // Handle social media share
  const handleSocialShare = useCallback(
    (platform: SocialPlatform) => {
      const shareUrlForPlatform = platform.shareUrl(shareUrl, shareText);
      window.open(shareUrlForPlatform, '_blank', 'width=600,height=400');
    },
    [shareUrl, shareText]
  );

  // Handle native share (if supported)
  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || 'Wingman Broadcast',
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Native share failed:', error);
          addToast({
            title: 'Share Failed',
            description: t('shareError'),
            color: 'danger'
          });
        }
      }
    }
  }, [post.title, shareText, shareUrl, t]);

  // Check if native share is supported
  const isNativeShareSupported = useMemo(() => {
    return typeof navigator !== 'undefined' && 'share' in navigator;
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size='2xl' scrollBehavior='inside'>
      <ModalContent>
        <ModalHeader className='flex flex-col gap-1 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
              <Icon icon='solar:share-bold' className='text-primary h-5 w-5' />
            </div>
            <div>
              <h2 className='text-xl font-bold tracking-tight'>{t('title')}</h2>
              <p className='text-foreground-500 text-sm'>{t('subtitle')}</p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className='gap-6'>
          {/* Post Preview */}
          <Card className='border-divider/50'>
            <CardBody className='p-4'>
              <div className='flex items-start gap-3'>
                <div className='from-primary to-secondary flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br'>
                  <Icon icon='solar:broadcast-bold' className='h-5 w-5 text-white' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-foreground line-clamp-2 font-semibold'>
                    {post.title || t('fallbacks.untitledPost')}
                  </h3>
                  {post.description && (
                    <p className='text-foreground-600 mt-1 line-clamp-2 text-sm'>
                      {post.description}
                    </p>
                  )}
                  <div className='mt-2 flex items-center gap-2'>
                    <span className='text-foreground-500 text-xs'>
                      by {post.owner?.firstName} {post.owner?.lastName}
                    </span>
                    {post.topics && post.topics.length > 0 && (
                      <>
                        <span className='text-foreground-300'>•</span>
                        <Chip size='sm' variant='flat' className='h-5'>
                          {post.topics[0]?.title}
                        </Chip>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Copy Link Section */}
          <div className='space-y-3'>
            <h3 className='text-foreground text-sm font-semibold'>{t('copyLink.title')}</h3>
            <div className='flex gap-2'>
              <Input
                value={shareUrl}
                isReadOnly
                variant='bordered'
                className='flex-1'
                startContent={
                  <Icon icon='solar:link-linear' className='text-foreground-400 h-4 w-4' />
                }
              />
              <Button
                color={copySuccess ? 'success' : 'primary'}
                variant={copySuccess ? 'flat' : 'solid'}
                onPress={handleCopyLink}
                startContent={
                  <Icon
                    icon={copySuccess ? 'solar:check-circle-bold' : 'solar:copy-linear'}
                    className='h-4 w-4'
                  />
                }
              >
                {copySuccess ? t('copyLink.copied') : t('copyLink.copy')}
              </Button>
            </div>
          </div>

          <Divider />

          {/* Native Share (if supported) */}
          {isNativeShareSupported && (
            <>
              <div className='space-y-3'>
                <h3 className='text-foreground text-sm font-semibold'>{t('nativeShare.title')}</h3>
                <Button
                  color='primary'
                  variant='flat'
                  onPress={handleNativeShare}
                  startContent={<Icon icon='solar:share-linear' className='h-4 w-4' />}
                  className='w-full'
                >
                  {t('nativeShare.button')}
                </Button>
              </div>
              <Divider />
            </>
          )}

          {/* Social Media Platforms */}
          <div className='space-y-4'>
            <h3 className='text-foreground text-sm font-semibold'>{t('socialMedia.title')}</h3>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant='bordered'
                  className='h-auto justify-start p-4'
                  onPress={() => handleSocialShare(platform)}
                >
                  <div className='flex w-full items-center gap-3'>
                    <div
                      className='flex h-8 w-8 items-center justify-center rounded-full text-white'
                      style={{ backgroundColor: platform.color }}
                    >
                      <Icon icon={platform.icon} className='h-4 w-4' />
                    </div>
                    <div className='flex-1 text-left'>
                      <p className='text-sm font-medium'>{platform.name}</p>
                      <p className='text-foreground-500 text-xs'>{platform.description}</p>
                    </div>
                    <Icon
                      icon='solar:external-link-linear'
                      className='text-foreground-400 h-4 w-4'
                    />
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Share Statistics */}
          <div className='bg-default-50 rounded-lg p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <Icon icon='solar:chart-linear' className='text-foreground-500 h-4 w-4' />
              <h4 className='text-foreground-700 text-sm font-medium'>{t('analytics.title')}</h4>
            </div>
            <p className='text-foreground-500 text-xs'>{t('analytics.description')}</p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button variant='light' onPress={onClose}>
            {t('close')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
