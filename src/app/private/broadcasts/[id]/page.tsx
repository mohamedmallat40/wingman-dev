'use client';

import React, { useEffect, useState } from 'react';

import { Button, Card, CardBody, Spinner } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import PostCard from '../components/cards/PostCard';
import { ShareModal } from '../components/modals/ShareModal';
import { usePostById } from '../hooks/usePostById';
import { useSavePost, useUnsavePost, useUpvote } from '../hooks';

const PostDetailPage: React.FC = () => {
  const t = useTranslations('broadcasts');
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const { toggleUpvote } = useUpvote();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const { data: post, isLoading, error, refetch } = usePostById(postId);

  // Handle post interactions

  const handleComment = (postId: string) => {
    // Comments are handled within the PostCard component
  };

  const handleShare = (postId: string) => {
    setShareModalOpen(true);
  };

  const handleUpvote = (postId: string, isCurrentlyUpvoted: boolean) => {
    toggleUpvote(postId, isCurrentlyUpvoted);
  };

  const handleSave = (postId: string, isCurrentlySaved: boolean) => {
    if (isCurrentlySaved) {
      unsavePost.mutate(postId, {
        onSuccess: () => {
          addToast({
            title: t('post.actions.unsave'),
            description: 'Post removed from saved',
            color: 'default'
          });
        },
        onError: () => {
          addToast({
            title: 'Error',
            description: 'Failed to unsave post',
            color: 'danger'
          });
        }
      });
    } else {
      savePost.mutate(postId, {
        onSuccess: () => {
          addToast({
            title: t('post.actions.save'),
            description: 'Post saved for later',
            color: 'success'
          });
        },
        onError: () => {
          addToast({
            title: 'Error',
            description: 'Failed to save post',
            color: 'danger'
          });
        }
      });
    }
  };

  const handleBackToFeed = () => {
    router.push('/private/broadcasts');
  };

  // Generate breadcrumbs with topic title
  const getBreadcrumbs = () => {
    const breadcrumbs = [
      {
        label: t('navigation.home'),
        href: '/private',
        icon: 'solar:home-linear'
      },
      {
        label: t('navigation.broadcasts'),
        href: '/private/broadcasts',
        icon: 'solar:broadcast-linear'
      }
    ];

    // Add topic title if post has topics
    if (post?.topics && post.topics.length > 0) {
      const primaryTopic = post.topics[0];
      breadcrumbs.push({
        label: primaryTopic.title || primaryTopic.name || t('breadcrumbs.topic'),
        href: `/private/broadcasts?topic=${primaryTopic.id}`,
        icon: primaryTopic.icon || 'solar:hashtag-linear'
      });
    }

    // Add post title
    breadcrumbs.push({
      label: post?.title || t('breadcrumbs.postDetail'),
      href: '',
      icon: 'solar:document-text-linear'
    });

    return breadcrumbs;
  };

  // Update page title with topic context
  useEffect(() => {
    if (post?.title) {
      const topicPrefix = post.topics && post.topics.length > 0 ? `${post.topics[0].title} - ` : '';
      document.title = `${topicPrefix}${post.title} - Broadcasts | Wingman`;
    }
  }, [post?.title, post?.topics]);

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout
        pageTitle={t('page.loadingPostTitle')}
        pageDescription={t('page.loadingPostDescription')}
        pageIcon='solar:broadcast-linear'
        breadcrumbs={getBreadcrumbs()}
      >
        <div className='flex min-h-96 items-center justify-center'>
          <div className='flex items-center space-x-3'>
            <Spinner size='lg' color='primary' />
            <span className='text-lg'>{t('page.loadingPost')}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !post) {
    return (
      <DashboardLayout
        pageTitle={t('page.postNotFound')}
        pageDescription={t('page.postNotFoundDescription')}
        pageIcon='solar:broadcast-linear'
        breadcrumbs={getBreadcrumbs()}
      >
        <div className='flex min-h-96 flex-col items-center justify-center space-y-6'>
          <div className='text-center'>
            <Icon icon='solar:close-circle-linear' className='text-danger mx-auto mb-4 h-20 w-20' />
            <h2 className='text-foreground mb-2 text-2xl font-bold'>{t('page.postNotFound')}</h2>
            <p className='text-foreground-500 max-w-md'>
              The post you're looking for doesn't exist or may have been removed.
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <Button
              color='primary'
              variant='flat'
              startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
              onPress={handleBackToFeed}
            >
              {t('post.actions.backToFeed')}
            </Button>
            <Button
              color='default'
              variant='flat'
              startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
              onPress={() => refetch()}
            >
              {t('post.actions.retry')}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Success state
  return (
    <DashboardLayout
      pageTitle={post.title}
      pageDescription={`Broadcast post by ${post.owner?.firstName} ${post.owner?.lastName}`}
      pageIcon='solar:broadcast-linear'
      breadcrumbs={getBreadcrumbs()}
      headerActions={
        <Button
          variant='flat'
          color='primary'
          size='sm'
          startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
          onPress={handleBackToFeed}
        >
          {t('post.actions.backToFeed')}
        </Button>
      }
    >
      <div className='mx-auto w-full px-4 py-6 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
        {/* Post Detail Card */}
        <Card className='shadow-lg'>
          <CardBody className='p-0'>
            <PostCard
              post={post}
              onComment={handleComment}
              onShare={handleShare}
              onUpvote={handleUpvote}
              onSave={handleSave}
              className='border-0 shadow-none'
            />
          </CardBody>
        </Card>

        {/* Related Actions */}
        <div className='mt-6 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button
              variant='flat'
              color='primary'
              size='sm'
              startContent={<Icon icon='solar:share-linear' className='h-4 w-4' />}
              onPress={() => handleShare(post.id)}
            >
              {t('post.actions.sharePost')}
            </Button>
            <Button
              variant='flat'
              color='default'
              size='sm'
              startContent={<Icon icon='solar:archive-linear' className='h-4 w-4' />}
              onPress={() => handleSave(post.id, post.isSaved || false)}
            >
              {post.isSaved ? t('post.actions.unsave') : t('post.actions.save')}
            </Button>
          </div>

          <div className='text-foreground-500 text-sm'>
            Posted{' '}
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {post && (
        <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} post={post} />
      )}
    </DashboardLayout>
  );
};

export default PostDetailPage;
