'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import {
  Button,
  Card,
  CardBody,
  useDisclosure,
  Spacer,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

import { useBroadcastStore } from '../store/useBroadcastStore';
import { type BroadcastPost } from '../types';
import EnhancedContentCreator from './modals/EnhancedContentCreator';
import BroadcastErrorHandler, { 
  type BroadcastError, 
  useBroadcastErrorHandler 
} from './ui/BroadcastErrorHandler';

// Import existing components (assuming they exist)
import BroadcastFeed from './lists/BroadcastFeed';
import SubcastSidebar from './navigation/SubcastSidebar';
import BroadcastFilters from './filters/BroadcastFilters';

interface EnhancedBroadcastPageProps {
  className?: string;
}

const EnhancedBroadcastPage: React.FC<EnhancedBroadcastPageProps> = ({
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const tCommon = useTranslations('common');
  
  const { 
    ui, 
    openContentCreator, 
    closeContentCreator,
    drafts,
    analytics 
  } = useBroadcastStore();

  const { handleError } = useBroadcastErrorHandler();
  
  const [currentError, setCurrentError] = useState<BroadcastError | null>(null);
  const [selectedDraft, setSelectedDraft] = useState<Partial<BroadcastPost> | null>(null);

  // Handle post creation success
  const handlePostPublished = useCallback((post: Partial<BroadcastPost>) => {
    console.log('Post published successfully:', post);
    // You could add a toast notification here
    // toast.success(t('success.published'));
  }, []);

  // Handle draft save success
  const handleDraftSaved = useCallback((draft: Partial<BroadcastPost>) => {
    console.log('Draft saved successfully:', draft);
    // You could add a toast notification here
    // toast.success(t('success.draftSaved'));
  }, []);

  // Handle errors
  const handleOperationError = useCallback((error: any, operation: string) => {
    const broadcastError = handleError(error, operation as any);
    setCurrentError(broadcastError);
  }, [handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setCurrentError(null);
  }, []);

  // Retry operation
  const retryOperation = useCallback(() => {
    // Implement retry logic based on the error type
    setCurrentError(null);
    // You could retry the last operation here
  }, []);

  // Open content creator with draft
  const openWithDraft = useCallback((draft: Partial<BroadcastPost>) => {
    setSelectedDraft(draft);
    openContentCreator();
  }, [openContentCreator]);

  // Close content creator and clear draft
  const closeCreator = useCallback(() => {
    setSelectedDraft(null);
    closeContentCreator();
  }, [closeContentCreator]);

  // Quick action buttons configuration
  const quickActions = [
    {
      key: 'article',
      label: 'Write Article',
      icon: 'solar:document-text-linear',
      color: 'primary' as const,
      description: 'Share detailed thoughts and insights'
    },
    {
      key: 'video',
      label: 'Upload Video',
      icon: 'solar:videocamera-linear',
      color: 'secondary' as const,
      description: 'Share video content'
    },
    {
      key: 'poll',
      label: 'Create Poll',
      icon: 'solar:chart-2-linear',
      color: 'warning' as const,
      description: 'Get community feedback'
    },
    {
      key: 'gallery',
      label: 'Photo Gallery',
      icon: 'solar:gallery-linear',
      color: 'success' as const,
      description: 'Share multiple images'
    }
  ];

  return (
    <div className={`min-h-screen bg-background ${className}`}>
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {t('title')}
              </h1>
              <p className="text-foreground-600 mt-1">
                {t('description')}
              </p>
            </div>

            {/* Primary Create Button */}
            <div className="flex items-center gap-3">
              {/* Analytics Quick View */}
              {analytics.userMetrics.totalPosts > 0 && (
                <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                  <CardBody className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {analytics.userMetrics.totalPosts}
                        </p>
                        <p className="text-xs text-foreground-500">Posts</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {analytics.userMetrics.totalLikes}
                        </p>
                        <p className="text-xs text-foreground-500">Likes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-foreground">
                          {Math.round(analytics.userMetrics.engagement)}%
                        </p>
                        <p className="text-xs text-foreground-500">Engagement</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Create Button with Dropdown */}
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    color="primary"
                    size="lg"
                    className="font-semibold"
                    endContent={<Icon icon="solar:alt-arrow-down-linear" className="h-4 w-4" />}
                  >
                    <Icon icon="solar:pen-new-square-linear" className="h-5 w-5" />
                    Create Post
                  </Button>
                </DropdownTrigger>
                <DropdownMenu>
                  {quickActions.map((action) => (
                    <DropdownItem
                      key={action.key}
                      startContent={
                        <Icon icon={action.icon} className="h-4 w-4" />
                      }
                      description={action.description}
                      onPress={() => {
                        setSelectedDraft({ type: action.key as any });
                        openContentCreator();
                      }}
                    >
                      {action.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {quickActions.map((action) => (
              <motion.div
                key={action.key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  isPressable
                  className="hover:shadow-lg transition-all duration-200"
                  onPress={() => {
                    setSelectedDraft({ type: action.key as any });
                    openContentCreator();
                  }}
                >
                  <CardBody className="p-4 text-center">
                    <div className={`mx-auto w-12 h-12 rounded-full bg-${action.color}/10 flex items-center justify-center mb-2`}>
                      <Icon 
                        icon={action.icon} 
                        className={`h-6 w-6 text-${action.color}`} 
                      />
                    </div>
                    <h3 className="font-semibold text-sm">{action.label}</h3>
                    <p className="text-xs text-foreground-500 mt-1">
                      {action.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Drafts Section */}
          {drafts.savedDrafts.length > 0 && (
            <Card className="mb-6">
              <CardBody className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Icon icon="solar:diskette-linear" className="h-4 w-4" />
                    Saved Drafts
                    <Badge color="primary" size="sm">
                      {drafts.savedDrafts.length}
                    </Badge>
                  </h3>
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      // Clear all drafts logic
                    }}
                  >
                    Clear All
                  </Button>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {drafts.savedDrafts.slice(0, 5).map((draft, index) => (
                    <Card
                      key={index}
                      isPressable
                      className="min-w-[200px] bg-default-50"
                      onPress={() => openWithDraft(draft)}
                    >
                      <CardBody className="p-3">
                        <h4 className="font-medium text-sm line-clamp-1">
                          {draft.title || 'Untitled Draft'}
                        </h4>
                        <p className="text-xs text-foreground-500 line-clamp-2 mt-1">
                          {draft.content || 'No content'}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <Chip size="sm" variant="flat">
                            {draft.type || 'article'}
                          </Chip>
                          <span className="text-xs text-foreground-400">
                            {draft.timestamp ? new Date(draft.timestamp).toLocaleDateString() : 'Today'}
                          </span>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Error Display */}
        <AnimatePresence>
          {currentError && (
            <div className="mb-6">
              <BroadcastErrorHandler
                error={currentError}
                onRetry={retryOperation}
                onDismiss={clearError}
                showDetails={true}
              />
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Filters */}
              <BroadcastFilters />
              
              {/* Subcasts Sidebar */}
              <SubcastSidebar />
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            <BroadcastFeed 
              onError={(error) => handleOperationError(error, 'fetch')}
            />
          </div>
        </div>

        <Spacer y={8} />
      </div>

      {/* Enhanced Content Creator Modal */}
      <EnhancedContentCreator
        isOpen={ui.contentCreatorOpen}
        onClose={closeCreator}
        onPublish={handlePostPublished}
        onSaveDraft={handleDraftSaved}
        initialData={selectedDraft || undefined}
        className="z-50"
      />

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden z-40">
        <Tooltip content="Create new post" placement="left">
          <Button
            isIconOnly
            color="primary"
            size="lg"
            className="w-14 h-14 shadow-lg"
            onPress={openContentCreator}
          >
            <Icon icon="solar:pen-new-square-linear" className="h-6 w-6" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};

export default EnhancedBroadcastPage;
