import React, { useState } from 'react';

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

import { type IDocument } from '../../types';
import { DocumentShareModal } from '../modals';

interface DocumentCardProperties {
  document: IDocument;
  onEdit?: (document: IDocument) => void;
  onView?: (document: IDocument) => void;
  viewMode?: 'list' | 'grid';
}

const getDocumentIcon = (typeName: string) => {
  const iconMap: Record<
    string,
    { icon: string; color: string; bgColor: string; gradient: string }
  > = {
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
    Spreadsheet: {
      icon: 'solar:chart-square-outline',
      color: 'text-secondary-600 dark:text-secondary-400',
      bgColor:
        'bg-gradient-to-br from-secondary-50 to-secondary-100 dark:from-secondary-900/20 dark:to-secondary-800/30',
      gradient: 'from-secondary/10 to-secondary-500/20'
    },
    Template: {
      icon: 'solar:file-text-outline',
      color: 'text-default-600 dark:text-default-400',
      bgColor:
        'bg-gradient-to-br from-default-50 to-default-100 dark:from-default-800/30 dark:to-default-700/40',
      gradient: 'from-default/10 to-default-500/20'
    }
  };

  const config = iconMap[typeName] || iconMap['Template'];

  return (
    <motion.div
      className={`relative rounded-xl p-3 ${config!.bgColor} shadow-sm ring-1 ring-default-200 dark:ring-default-700`}
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
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

const getTranslatedStatus = (status: string, t: any) => {
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

const getTranslatedType = (type: string, t: any) => {
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
      // Here you would integrate with your actual sharing API
      // await shareDocument(data);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className={`group border-default-200 dark:border-default-700 bg-content1 dark:bg-content1 hover:border-primary/30 dark:hover:border-primary/50 relative transition-all duration-300 hover:shadow-xl ${viewMode === 'grid' ? 'h-[180px]' : 'h-auto'}`}
      >
        {/* Gradient overlay */}
        <div className='from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-br via-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

        <CardBody className='relative p-5 overflow-hidden'>
          <div className='mb-4 flex items-start justify-between'>
            <div className='flex flex-1 items-start gap-4'>
              {getDocumentIcon(document.type?.name || '')}

              <div className='min-w-0 flex-1 overflow-hidden'>
                <div className='mb-2 flex items-center gap-2 min-w-0'>
                  <h3 className='text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 min-w-0 truncate text-base font-semibold transition-colors leading-tight break-all'>
                    {document.documentName}
                  </h3>
                  {document.sharedWith.length > 0 && (
                    <Badge
                      content={document.sharedWith.length}
                      color='primary'
                      size='sm'
                      className='h-5 min-w-5'
                    >
                      <Icon
                        icon='solar:users-group-rounded-bold'
                        className='text-primary-500 h-4 w-4'
                      />
                    </Badge>
                  )}
                </div>

                <div className='text-default-500 mb-3 flex items-center gap-3 text-sm overflow-hidden'>
                  <div className='flex items-center gap-1 flex-shrink-0'>
                    <Icon icon='solar:calendar-outline' className='h-3.5 w-3.5' />
                    <span className='whitespace-nowrap'>{formatDate(document.createdAt)}</span>
                  </div>
                  <div className='bg-default-300 h-1 w-1 rounded-full flex-shrink-0' />
                  <span className='truncate'>{getTranslatedType(document.type?.name || '', t)}</span>
                </div>

                {/* Tags */}
                <div className='mb-1 flex items-start gap-1.5 overflow-hidden'>
                  <span className='text-default-500 flex-shrink-0 text-xs mt-1'>Tags:</span>
                  {document.tags.length > 0 ? (
                    <div className='flex gap-1 min-w-0 overflow-hidden'>
                      {document.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag.id}
                          size='sm'
                          variant='flat'
                          color={getTagColor(tag.name)}
                          className='h-5 text-xs max-w-[80px] truncate flex-shrink-0'
                        >
                          {tag.name}
                        </Chip>
                      ))}
                      {document.tags.length > 2 && (
                        <Chip size='sm' variant='flat' color='default' className='h-5 text-xs flex-shrink-0'>
                          +{document.tags.length - 2}
                        </Chip>
                      )}
                    </div>
                  ) : (
                    <span className='text-default-400 text-xs'>—</span>
                  )}
                </div>

                {/* Status */}
                <div className='flex items-center gap-1.5 overflow-hidden'>
                  <span className='text-default-500 flex-shrink-0 text-xs'>Status:</span>
                  <Chip
                    size='sm'
                    variant='flat'
                    color={getStatusColor(document.status?.name || '')}
                    className='h-5 text-xs max-w-[120px] truncate'
                  >
                    {getTranslatedStatus(document.status?.name || '', t)}
                  </Chip>
                </div>
              </div>
            </div>

            {/* Actions */}
            <motion.div
              className='ml-4 flex items-center gap-2'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                isIconOnly
                size='sm'
                variant='flat'
                color='primary'
                onPress={() => setShowShareModal(true)}
                className='min-w-0 transition-transform hover:scale-105'
              >
                <Icon icon='solar:share-linear' className='h-4 w-4' />
              </Button>

              <Dropdown>
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    className='hover:bg-default-100 dark:hover:bg-default-800 transition-transform hover:scale-110'
                  >
                    <Icon icon='solar:menu-dots-bold' className='text-default-500 h-4 w-4' />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className='min-w-[160px]'>
                  <DropdownItem
                    key='view'
                    startContent={<Icon icon='solar:eye-linear' className='h-4 w-4' />}
                    onPress={() => onView?.(document)}
                  >
                    {t('actions.view')}
                  </DropdownItem>
                  <DropdownItem
                    key='open-new-window'
                    startContent={<Icon icon='solar:window-frame-linear' className='h-4 w-4' />}
                    onPress={() => {
                      window.open(`${getBaseUrl()}/upload/${document.fileName}`, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    Open in New Window
                  </DropdownItem>
                  <DropdownItem
                    key='edit'
                    startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
                    onPress={() => onEdit?.(document)}
                  >
                    {t('actions.edit')}
                  </DropdownItem>
                  <DropdownItem
                    key='delete'
                    className='text-danger'
                    color='danger'
                    startContent={
                      <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                    }
                    onPress={handleDelete}
                  >
                    {t('actions.delete')}
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </motion.div>
          </div>
        </CardBody>

        {/* Share Modal */}
        <DocumentShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          document={document}
          onShare={handleShare}
        />
      </Card>
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
