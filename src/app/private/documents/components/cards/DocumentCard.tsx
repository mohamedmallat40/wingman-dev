import React, { useState } from 'react';

import type { Document, DocumentCardProps, ViewMode } from '../../types';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  useDisclosure
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useDeleteDocument } from '@root/modules/documents/hooks/use-documents';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import ConfirmDeleteModal from '@/app/private/components/confirm-delete';
import { formatDate, getBaseUrl } from '@/lib/utils/utilities';

import { DocumentShareModal } from '../modals';

interface DocumentCardProperties {
  document: Document;
  onEdit?: (document: Document) => void;
  onView?: (document: Document) => void;
  viewMode?: ViewMode;
}

const getDocumentIcon = (fileName: string, typeName?: string) => {
  // Extract file extension from fileName
  const extension = fileName ? fileName.split('.').pop()?.toLowerCase() : '';
  const iconMap: Record<
    string,
    { icon: string; color: string; bgColor: string; gradient: string }
  > = {
    // PDF Files
    pdf: {
      icon: 'solar:document-outline',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30',
      gradient: 'from-red/10 to-red-500/20'
    },
    // Word Documents
    doc: {
      icon: 'solar:document-text-outline',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor:
        'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30',
      gradient: 'from-blue/10 to-blue-500/20'
    },
    docx: {
      icon: 'solar:document-text-outline',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor:
        'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30',
      gradient: 'from-blue/10 to-blue-500/20'
    },

    // Excel Files
    xls: {
      icon: 'solar:chart-square-outline',
      color: 'text-green-600 dark:text-green-400',
      bgColor:
        'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30',
      gradient: 'from-green/10 to-green-500/20'
    },
    xlsx: {
      icon: 'solar:chart-square-outline',
      color: 'text-green-600 dark:text-green-400',
      bgColor:
        'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30',
      gradient: 'from-green/10 to-green-500/20'
    },
    csv: {
      icon: 'solar:chart-outline',
      color: 'text-green-600 dark:text-green-400',
      bgColor:
        'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30',
      gradient: 'from-green/10 to-green-500/20'
    },

    // PowerPoint Files
    ppt: {
      icon: 'solar:presentation-graph-outline',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor:
        'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
      gradient: 'from-orange/10 to-orange-500/20'
    },
    pptx: {
      icon: 'solar:presentation-graph-outline',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor:
        'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/30',
      gradient: 'from-orange/10 to-orange-500/20'
    },

    // Image Files
    jpg: {
      icon: 'solar:gallery-outline',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor:
        'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
      gradient: 'from-purple/10 to-purple-500/20'
    },
    jpeg: {
      icon: 'solar:gallery-outline',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor:
        'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
      gradient: 'from-purple/10 to-purple-500/20'
    },
    png: {
      icon: 'solar:gallery-outline',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor:
        'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
      gradient: 'from-purple/10 to-purple-500/20'
    },
    gif: {
      icon: 'solar:gallery-outline',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor:
        'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
      gradient: 'from-purple/10 to-purple-500/20'
    },
    svg: {
      icon: 'solar:gallery-outline',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor:
        'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/30',
      gradient: 'from-purple/10 to-purple-500/20'
    },

    // Text Files
    txt: {
      icon: 'solar:file-text-outline',
      color: 'text-gray-600 dark:text-gray-400',
      bgColor:
        'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/30',
      gradient: 'from-gray/10 to-gray-500/20'
    },

    // Archive Files
    zip: {
      icon: 'solar:archive-outline',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor:
        'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30',
      gradient: 'from-yellow/10 to-yellow-500/20'
    },
    rar: {
      icon: 'solar:archive-outline',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor:
        'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30',
      gradient: 'from-yellow/10 to-yellow-500/20'
    },

    // Video Files
    mp4: {
      icon: 'solar:videocamera-outline',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor:
        'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30',
      gradient: 'from-pink/10 to-pink-500/20'
    },
    mov: {
      icon: 'solar:videocamera-outline',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor:
        'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30',
      gradient: 'from-pink/10 to-pink-500/20'
    },
    avi: {
      icon: 'solar:videocamera-outline',
      color: 'text-pink-600 dark:text-pink-400',
      bgColor:
        'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/30',
      gradient: 'from-pink/10 to-pink-500/20'
    },

    // Audio Files
    mp3: {
      icon: 'solar:music-note-outline',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor:
        'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30',
      gradient: 'from-indigo/10 to-indigo-500/20'
    },
    wav: {
      icon: 'solar:music-note-outline',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor:
        'bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/30',
      gradient: 'from-indigo/10 to-indigo-500/20'
    },

    // Fallback based on document type
    Proposal: {
      icon: 'solar:document-text-outline',
      color: 'text-primary-600 dark:text-primary-400',
      bgColor:
        'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/30',
      gradient: 'from-primary/10 to-primary-500/20'
    },
    Contract: {
      icon: 'solar:shield-check-outline',
      color: 'text-success-600 dark:text-success-400',
      bgColor:
        'bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/30',
      gradient: 'from-success/10 to-success-500/20'
    },
    Invoice: {
      icon: 'solar:bill-list-outline',
      color: 'text-warning-600 dark:text-warning-400',
      bgColor:
        'bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/30',
      gradient: 'from-warning/10 to-warning-500/20'
    },
    Template: {
      icon: 'solar:file-text-outline',
      color: 'text-default-600 dark:text-default-400',
      bgColor:
        'bg-gradient-to-br from-default-50 to-default-100 dark:from-default-800/30 dark:to-default-700/40',
      gradient: 'from-default/10 to-default-500/20'
    }
  };

  // First try to get icon by file extension, then fallback to document type, then default
  const config = iconMap[extension || ''] || iconMap[typeName || ''] || iconMap['Template'];

  return (
    <motion.div
      className={`relative rounded-xl p-3 ${config!.bgColor} ring-default-200 dark:ring-default-700 shadow-sm ring-1`}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{
        transformOrigin: 'center center',
        willChange: 'transform'
      }}
    >
      <div
        className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config!.gradient} opacity-60`}
      />
      <Icon icon={config!.icon} className={`relative h-8 w-8 ${config!.color} drop-shadow-sm`} />
    </motion.div>
  );
};

const getStatusColor = (
  status: string
): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  switch (status) {
    case 'Awaiting Signature':
      return 'warning';
    case 'Under Review':
      return 'secondary';
    case 'Sent to Client':
      return 'primary';
    case 'In Progress':
      return 'success';
    default:
      return 'secondary';
  }
};

const getTagColor = (
  tagName: string
): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' => {
  const colorMap: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'> = {
    Contract: 'primary',
    Proposal: 'secondary',
    Invoice: 'success',
    Template: 'warning',
    Financial: 'success',
    Legal: 'primary',
    Marketing: 'secondary',
    HR: 'warning',
    Technical: 'primary',
    Design: 'secondary',
    Project: 'warning',
    Client: 'primary',
    Internal: 'secondary',
    Urgent: 'danger',
    Draft: 'warning',
    Final: 'success'
  };

  return colorMap[tagName] || 'secondary';
};

const getTranslatedStatus = (status: string, t: (key: string) => string) => {
  switch (status) {
    case 'Awaiting Signature':
      return t('status.awaitingSignature');
    case 'Under Review':
      return t('status.underReview');
    case 'Sent to Client':
      return t('status.sentToClient');
    case 'In Progress':
      return t('status.inProgress');
    default:
      return status;
  }
};

const getTranslatedType = (type: string, t: (key: string) => string) => {
  switch (type) {
    case 'Proposal':
      return t('types.proposal');
    case 'Contract':
      return t('types.contract');
    case 'Invoice':
      return t('types.invoice');
    case 'Spreadsheet':
      return t('types.spreadsheet');
    case 'Template':
      return t('types.template');
    default:
      return type;
  }
};

export default function DocumentCard({
  document,
  onEdit,
  onView,
  viewMode = 'list'
}: Readonly<DocumentCardProperties>) {
  const t = useTranslations('documents');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    index: number;
    id?: string;
    name?: string;
  } | null>(null);

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange
  } = useDisclosure();

  const deleteMutation = useDeleteDocument();

  const handleDelete = async () => {
    setItemToDelete({
      type: 'document',
      index: 0,
      id: document.id,
      name: document.documentName
    });
    onDeleteModalOpen();
  };

  const confirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(document.id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleShare = async (data: { users: string[]; message?: string; notifyUsers: boolean }) => {
    try {
      // TODO: Integrate with sharing API when available
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Awaiting Signature': { icon: 'solar:pen-new-square-linear', pulse: true },
      'Under Review': { icon: 'solar:eye-linear', pulse: true },
      'Sent to Client': { icon: 'solar:mailbox-linear', pulse: false },
      'In Progress': { icon: 'solar:play-circle-linear', pulse: true }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <motion.div
        className={`flex items-center gap-1.5 rounded-full px-2 py-1 ${
          config?.pulse
            ? 'from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20 bg-gradient-to-r'
            : 'bg-default-100 dark:bg-default-800/50'
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div
          className={`h-1.5 w-1.5 rounded-full ${config?.pulse ? 'bg-primary-500 animate-pulse' : 'bg-default-400'}`}
        />
        <span
          className={`text-xs font-medium ${
            config?.pulse
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-default-600 dark:text-default-400'
          }`}
        >
          {getTranslatedStatus(status, t)}
        </span>
      </motion.div>
    );
  };

  return (
    <div className='p-3'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className='w-full'
      >
        <Card className='group border-default-200 dark:border-default-700 bg-content1 hover:border-primary/30 dark:hover:border-primary/50 overflow-visible transition-all duration-300 hover:shadow-xl'>
          {/* Gradient overlay */}
          <div className='from-primary/5 to-secondary/5 rounded-large absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

          <CardBody className='relative p-4 sm:p-5 md:p-6'>
            {/* Header Section - Icon + Title + Actions */}
            <div className='mb-4 flex items-start gap-3 sm:gap-4'>
              {/* Document Icon */}
              <div className='mt-1 flex-shrink-0'>
                {getDocumentIcon(
                  document.fileName || document.documentName,
                  document.category?.name
                )}
              </div>

              {/* Title Section */}
              <div className='min-w-0 flex-1 pr-2 sm:pr-3'>
                <div className='mb-2 flex items-start gap-2'>
                  <h3
                    className='text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 min-w-0 flex-1 text-base leading-tight font-semibold transition-colors sm:text-lg'
                    title={document.documentName}
                    style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      wordBreak: 'break-word'
                    }}
                  >
                    {document.documentName}
                  </h3>

                  {/* Shared Users Badge - Positioned Absolutely */}
                  {document.sharedWith.length > 0 && (
                    <div className='relative flex-shrink-0'>
                      <div className='bg-primary/10 relative rounded-full p-1.5'>
                        <Icon
                          icon='solar:users-group-rounded-bold'
                          className='text-primary-500 h-3.5 w-3.5'
                        />
                        <div className='bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-4 w-4 min-w-4 items-center justify-center rounded-full text-xs font-medium'>
                          {document.sharedWith.length}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Date and Type - Right under filename */}
                <div className='text-default-500 flex flex-wrap items-center gap-2 text-sm'>
                  <div className='flex items-center gap-1'>
                    <Icon icon='solar:calendar-outline' className='h-3.5 w-3.5' />
                    <span>{formatDate(document.createdAt)}</span>
                  </div>
                  <div className='bg-default-300 h-1 w-1 rounded-full' />
                  <span>{getTranslatedType(document.category?.name || '', t)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='flex flex-shrink-0 items-start gap-1.5 sm:gap-2'>
                <Button
                  isIconOnly
                  size='sm'
                  variant='flat'
                  color='default'
                  onPress={() => onView?.(document)}
                  className='h-8 w-8 min-w-8 transition-transform hover:scale-105'
                >
                  <Icon icon='solar:eye-outline' className='h-4 w-4' />
                </Button>

                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      className='hover:bg-default-100 dark:hover:bg-default-800 h-8 w-8 min-w-8 transition-transform hover:scale-105'
                    >
                      <Icon icon='solar:menu-dots-outline' className='text-default-500 h-4 w-4' />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu className='min-w-[160px]'>
                    <DropdownItem
                      key='share'
                      startContent={<Icon icon='solar:share-outline' className='h-4 w-4' />}
                      onPress={() => setShowShareModal(true)}
                    >
                      {t('actions.share')}
                    </DropdownItem>
                    <DropdownItem
                      key='edit'
                      startContent={<Icon icon='solar:pen-outline' className='h-4 w-4' />}
                      onPress={() => onEdit?.(document)}
                    >
                      {t('actions.edit')}
                    </DropdownItem>
                    <DropdownItem
                      key='open-new-window'
                      startContent={<Icon icon='solar:window-frame-outline' className='h-4 w-4' />}
                      onPress={() => {
                        window.open(
                          `${getBaseUrl()}/upload/private/${document.fileName}`,
                          '_blank',
                          'noopener,noreferrer'
                        );
                      }}
                    >
                      Open in New Window
                    </DropdownItem>
                    <DropdownItem
                      key='delete'
                      className='text-danger'
                      color='danger'
                      startContent={
                        <Icon icon='solar:trash-bin-minimalistic-outline' className='h-4 w-4' />
                      }
                      onPress={handleDelete}
                    >
                      {t('actions.delete')}
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </div>

            {/* Metadata Section - Full Width */}
            <div className='w-full space-y-3'>
              {/* Tags Section - Full Width */}
              <div className='w-full'>
                <div className='mb-2 flex items-start gap-2'>
                  <span className='text-default-500 mt-1 flex-shrink-0 text-xs font-medium'>
                    Tags:
                  </span>
                  <div className='min-w-0 flex-1'>
                    {document.tags.length > 0 ? (
                      <div className='flex flex-wrap gap-1'>
                        {document.tags.slice(0, 3).map((tag: { id: string; name: string }) => (
                          <Chip
                            key={tag.id}
                            size='sm'
                            variant='flat'
                            color={getTagColor(tag.name)}
                            className='h-5 text-xs'
                          >
                            {tag.name}
                          </Chip>
                        ))}
                        {document.tags.length > 3 && (
                          <Chip size='sm' variant='flat' color='default' className='h-5 text-xs'>
                            +{document.tags.length - 3}
                          </Chip>
                        )}
                      </div>
                    ) : (
                      <span className='text-default-400 text-xs'>No tags</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Section - Full Width */}
              <div className='w-full'>
                <div className='flex items-center gap-2'>
                  <span className='text-default-500 flex-shrink-0 text-xs font-medium'>
                    Status:
                  </span>
                  <Chip
                    size='sm'
                    variant='flat'
                    color={getStatusColor(document.status?.name || '')}
                    className='h-5 text-xs'
                  >
                    {getTranslatedStatus(document.status?.name || '', t)}
                  </Chip>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Modals */}
        <DocumentShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          document={document}
          onShare={handleShare}
        />
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onOpenChange={onDeleteModalOpenChange}
          onConfirm={async () => {
            await confirmDelete();
          }}
          title={'Delete document'}
          itemName={itemToDelete?.name}
          isLoading={deleteMutation.isPending}
        />
      </motion.div>
    </div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <Card className='border-default-200 dark:border-default-700 bg-content1 dark:bg-content1 transition-shadow hover:shadow-md'>
      <CardBody className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            {/* Document Icon Skeleton */}
            <Skeleton className='rounded-lg'>
              <div className='bg-default-200 h-10 w-10'></div>
            </Skeleton>

            <div className='min-w-0 flex-1 space-y-2'>
              {/* Document Title Skeleton */}
              <Skeleton className='rounded-lg'>
                <div className='bg-default-200 h-5 w-3/4 rounded-lg'></div>
              </Skeleton>

              {/* Metadata Row Skeleton */}
              <div className='flex flex-wrap items-center gap-4'>
                {/* Modified Date */}
                <Skeleton className='rounded-lg'>
                  <div className='bg-default-200 h-3 w-20 rounded-lg'></div>
                </Skeleton>

                {/* Document Type */}
                <Skeleton className='rounded-lg'>
                  <div className='bg-default-200 h-3 w-16 rounded-lg'></div>
                </Skeleton>

                {/* Tags Skeleton */}
                <div className='flex gap-1'>
                  <Skeleton className='rounded-full'>
                    <div className='bg-default-200 h-5 w-12 rounded-full'></div>
                  </Skeleton>
                  <Skeleton className='rounded-full'>
                    <div className='bg-default-200 h-5 w-10 rounded-full'></div>
                  </Skeleton>
                </div>

                {/* Status Skeleton */}
                <Skeleton className='rounded-full'>
                  <div className='bg-default-200 h-5 w-20 rounded-full'></div>
                </Skeleton>

                {/* Shared With Skeleton */}
                <Skeleton className='rounded-lg'>
                  <div className='bg-default-200 h-3 w-16 rounded-lg'></div>
                </Skeleton>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className='flex items-center gap-2'>
            <Skeleton className='rounded-lg'>
              <div className='bg-default-200 h-8 w-16 rounded-lg'></div>
            </Skeleton>
            <Skeleton className='rounded-lg'>
              <div className='bg-default-200 h-8 w-8 rounded-lg'></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
