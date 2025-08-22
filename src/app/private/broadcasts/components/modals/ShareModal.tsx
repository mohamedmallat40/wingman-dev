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
  const tSocial = useTranslations('broadcasts.post.share.socialPlatforms');
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate the share URL for this post
  const shareUrl = useMemo(() => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/broadcasts/${post.id}`;
  }, [post.id]);

  // Generate optimized share text
  const shareText = useMemo(() => {
    const title = post.title || t('fallbackTitle');
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
        name: tSocial('linkedin.name'),
        icon: 'skill-icons:linkedin',
        color: '#0077b5',
        shareUrl: (url, text) =>
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        description: tSocial('linkedin.description')
      },
      {
        id: 'twitter',
        name: tSocial('twitter.name'),
        icon: 'skill-icons:twitter',
        color: '#000000',
        shareUrl: (url, text) =>
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        description: tSocial('twitter.description')
      },
      {
        id: 'facebook',
        name: tSocial('facebook.name'),
        icon: 'skill-icons:facebook',
        color: '#1877f2',
        shareUrl: (url, text) =>
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`,
        description: tSocial('facebook.description')
      },
      {
        id: 'whatsapp',
        name: tSocial('whatsapp.name'),
        icon: 'mdi:whatsapp',
        color: '#25d366',
        shareUrl: (url, text) => `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
        description: tSocial('whatsapp.description')
      },
      {
        id: 'telegram',
        name: tSocial('telegram.name'),
        icon: 'mdi:telegram',
        color: '#0088cc',
        shareUrl: (url, text) =>
          `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
        description: tSocial('telegram.description')
      },
      {
        id: 'reddit',
        name: tSocial('reddit.name'),
        icon: 'mdi:reddit',
        color: '#ff4500',
        shareUrl: (url, text) =>
          `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        description: tSocial('reddit.description')
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
        title: t('notifications.linkCopied'),
        description: t('copySuccess'),
        color: 'success'
      });

      // Reset copy success state after 2 seconds
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      addToast({
        title: t('notifications.copyFailed'),
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
          title: post.title || t('wingmanBroadcast'),
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Native share failed:', error);
          addToast({
            title: t('notifications.shareFailed'),
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      scrollBehavior='inside'
      backdrop='opaque'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50'
      }}
    >
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

        <ModalBody className='gap-4 px-6 py-4'>
          {/* Post Preview */}
          <Card className='border-default-200/50 bg-default-50/50 dark:bg-default-100/20'>
            <CardBody className='p-4'>
              <div className='flex items-start gap-3'>
                <div className='from-primary to-secondary flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg'>
                  <Icon icon='solar:broadcast-bold' className='h-6 w-6 text-white' />
                </div>
                <div className='min-w-0 flex-1'>
                  <h3 className='text-foreground line-clamp-2 font-bold text-lg'>
                    {post.title || t('fallbacks.untitledPost')}
                  </h3>
                  {post.description && (
                    <p className='text-foreground-600 mt-2 line-clamp-2 text-sm leading-relaxed'>
                      {post.description}
                    </p>
                  )}
                  <div className='mt-3 flex items-center gap-2 flex-wrap'>
                    <div className='flex items-center gap-1'>
                      <Icon icon='solar:user-linear' className='h-3 w-3 text-foreground-400' />
                      <span className='text-foreground-500 text-xs font-medium'>
                        {post.owner?.firstName} {post.owner?.lastName}
                      </span>
                    </div>
                    {post.topics && post.topics.length > 0 && (
                      <>
                        <span className='text-foreground-300'>•</span>
                        <Chip size='sm' variant='flat' color='primary' className='h-5 text-xs'>
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
            <div className='flex items-center gap-2'>
              <Icon icon='solar:link-bold' className='text-primary h-4 w-4' />
              <h3 className='text-foreground text-sm font-bold'>{t('copyLink.title')}</h3>
            </div>
            <div className='flex gap-2'>
              <Input
                value={shareUrl}
                isReadOnly
                variant='bordered'
                className='flex-1'
                classNames={{
                  inputWrapper: 'border-default-200 hover:border-primary focus:border-primary bg-default-50'
                }}
                startContent={
                  <Icon icon='solar:link-linear' className='text-foreground-400 h-4 w-4' />
                }
              />
              <Button
                color={copySuccess ? 'success' : 'primary'}
                variant={copySuccess ? 'flat' : 'solid'}
                onPress={handleCopyLink}
                size='lg'
                className={copySuccess ? 'bg-success/10 text-success' : ''}
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
            <div className='flex items-center gap-2'>
              <Icon icon='solar:share-circle-bold' className='text-primary h-4 w-4' />
              <h3 className='text-foreground text-sm font-bold'>{t('socialMedia.title')}</h3>
            </div>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  variant='bordered'
                  className='h-auto justify-start p-4 hover:bg-default-50 hover:border-primary/50 transition-all duration-200'
                  onPress={() => handleSocialShare(platform)}
                >
                  <div className='flex w-full items-center gap-3'>
                    <div
                      className='flex h-10 w-10 items-center justify-center rounded-xl text-white shadow-md'
                      style={{ backgroundColor: platform.color }}
                    >
                      <Icon icon={platform.icon} className='h-5 w-5' />
                    </div>
                    <div className='flex-1 text-left'>
                      <p className='text-sm font-semibold'>{platform.name}</p>
                      <p className='text-foreground-500 text-xs leading-relaxed'>{platform.description}</p>
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
          <div className='bg-primary/5 border border-primary/20 rounded-xl p-4'>
            <div className='mb-2 flex items-center gap-2'>
              <Icon icon='solar:chart-2-bold' className='text-primary h-4 w-4' />
              <h4 className='text-foreground text-sm font-semibold'>{t('analytics.title')}</h4>
            </div>
            <p className='text-foreground-600 text-xs leading-relaxed'>{t('analytics.description')}</p>
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
