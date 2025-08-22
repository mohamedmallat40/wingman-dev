'use client';

import React, { useCallback } from 'react';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { addToast } from '@heroui/toast';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import PostCard from '../components/cards/PostCard';
import BroadcastFeedSkeleton from '../components/states/BroadcastFeedSkeleton';
import { useSavedPosts, useSavePost, useUnsavePost, useUpvote } from '../hooks';
import { BroadcastPost } from '../types';

const SavedBroadcastsPage: React.FC = () => {
  const t = useTranslations('broadcasts');
  const router = useRouter();

  // Hooks for API operations
  const { toggleUpvote } = useUpvote();
  const savePost = useSavePost();
  const unsavePost = useUnsavePost();

  // Fetch saved posts
  const {
    data: savedData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useSavedPosts({ limit: 10 });

  // Flatten the paginated data
  const savedPosts = savedData?.pages?.flatMap((page) => page.data || []) || [];

  // Event handlers
  const handlePostClick = useCallback(
    (postId: string) => {
      router.push(`/private/broadcasts/${postId}`);
    },
    [router]
  );

  const handlePostUpvote = useCallback(
    (postId: string, isCurrentlyUpvoted: boolean) => {
      toggleUpvote(postId, isCurrentlyUpvoted);
    },
    [toggleUpvote]
  );


  const handleSave = useCallback(
    (postId: string, isCurrentlySaved: boolean) => {
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
    },
    [savePost, unsavePost, t]
  );

  const handleShare = useCallback(() => {
    // Share functionality implementation  
  }, []);

  const handleEditPost = useCallback((post: BroadcastPost) => {
    // TODO: Implement edit functionality - navigate to edit page or open modal
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout title={t('saved.title')} description={t('saved.description')}>
        <BroadcastFeedSkeleton />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title={t('saved.title')} description={t('saved.description')}>
        <div className="flex flex-col items-center justify-center py-12">
          <Icon icon="solar:wifi-router-broken" className="h-16 w-16 text-danger mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Failed to load saved posts
          </h3>
          <p className="text-foreground-500 text-center">
            There was an error loading your saved broadcasts. Please try again.
          </p>
          <Button 
            color="primary" 
            variant="flat" 
            className="mt-4"
            onPress={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t('saved.title')} description={t('saved.description')}>
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader className="flex items-center gap-3">
            <div className="bg-primary/10 rounded-full p-3">
              <Icon icon="solar:archive-bold" className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Saved Broadcasts</h1>
              <p className="text-foreground-500">
                {savedPosts.length} saved {savedPosts.length === 1 ? 'broadcast' : 'broadcasts'}
              </p>
            </div>
          </CardHeader>
        </Card>

        {/* Empty State */}
        {savedPosts.length === 0 ? (
          <Card>
            <CardBody className="text-center py-12">
              <Icon icon="solar:archive-linear" className="h-16 w-16 text-default-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No saved broadcasts yet
              </h3>
              <p className="text-foreground-500 mb-6">
                Save broadcasts to read them later. Look for the archive button on any post.
              </p>
              <Button 
                color="primary" 
                variant="flat"
                onPress={() => router.push('/private/broadcasts')}
                startContent={<Icon icon="solar:home-linear" className="h-4 w-4" />}
              >
                Browse Broadcasts
              </Button>
            </CardBody>
          </Card>
        ) : (
          <>
            {/* Saved Posts List */}
            <div className="space-y-6">
              {savedPosts.map((post, index) => (
                <div 
                  key={post.id}
                  className="animate-in fade-in-0 slide-in-from-bottom-2"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <PostCard
                    post={post}
                    onComment={() => handlePostClick(post.id)}
                    onShare={handleShare}
                    onUpvote={handlePostUpvote}
                    onSave={handleSave}
                    onClick={() => handlePostClick(post.id)}
                    onEdit={handleEditPost}
                    isLoading={false}
                  />
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="flat"
                  color="primary"
                  isLoading={isFetchingNextPage}
                  onPress={() => fetchNextPage()}
                  className="min-w-[200px]"
                >
                  {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SavedBroadcastsPage;