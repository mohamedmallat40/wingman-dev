import React, { useState } from 'react';

import {
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Skeleton,
  Avatar,
  Badge
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import DocumentShareModal from './DocumentShareModal';

import { formatDate } from '@/lib/utils/utilities';

import { IDocument } from '../types';

interface DocumentCardProperties {
  document: IDocument;
  viewMode?: 'list' | 'grid';
}

const getDocumentIcon = (typeName: string) => {
  const iconMap: Record<string, { icon: string; color: string; bgColor: string; gradient: string }> = {
    Proposal: { 
      icon: 'solar:document-text-bold', 
      color: 'text-primary-600 dark:text-primary-400', 
      bgColor: 'bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/30 dark:to-primary-800/20',
      gradient: 'from-primary/20 to-primary-600/30'
    },
    Contract: { 
      icon: 'solar:shield-check-bold', 
      color: 'text-secondary-600 dark:text-secondary-400', 
      bgColor: 'bg-gradient-to-br from-secondary-100 to-secondary-200 dark:from-secondary-900/30 dark:to-secondary-800/20',
      gradient: 'from-secondary/20 to-secondary-600/30'
    },
    Invoice: { 
      icon: 'solar:bill-list-bold', 
      color: 'text-success-600 dark:text-success-400', 
      bgColor: 'bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/20',
      gradient: 'from-success/20 to-success-600/30'
    },
    Spreadsheet: {
      icon: 'solar:chart-square-bold',
      color: 'text-warning-600 dark:text-warning-400',
      bgColor: 'bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/20',
      gradient: 'from-warning/20 to-warning-600/30'
    },
    Template: { 
      icon: 'solar:file-text-bold', 
      color: 'text-default-600 dark:text-default-400', 
      bgColor: 'bg-gradient-to-br from-default-100 to-default-200 dark:from-default-800/50 dark:to-default-700/30',
      gradient: 'from-default/20 to-default-600/30'
    }
  };

  const config = iconMap[typeName] || iconMap['Template'];

  return (
    <motion.div 
      className={`relative rounded-xl p-3 ${config!.bgColor} ring-1 ring-white/20 shadow-sm`}
      whileHover={{ scale: 1.05, rotate: 2 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${config!.gradient} opacity-50`} />
      <Icon icon={config!.icon} className={`relative h-7 w-7 ${config!.color}`} />
    </motion.div>
  );
};

const getStatusColor = (status: string) => {
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
      return 'default';
  }
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

export default function DocumentCard({ document, viewMode = 'list' }: Readonly<DocumentCardProperties>) {
  const t = useTranslations('documents');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleShare = async (data: {
    userIds: string[];
    message?: string;
    notifyUsers: boolean;
  }) => {
    try {
      console.log('Sharing document:', data);
      // Here you would integrate with your actual sharing API
      // await shareDocument(data);
      
      alert(t('share.success', { count: data.userIds.length }));
    } catch (error) {
      console.error('Share failed:', error);
      alert(t('share.failed'));
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Awaiting Signature': { icon: 'solar:pen-new-square-linear', pulse: true },
      'Under Review': { icon: 'solar:eye-linear', pulse: true },
      'Sent to Client': { icon: 'solar:mailbox-linear', pulse: false },
      'In Progress': { icon: 'solar:play-circle-linear', pulse: true },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    
    return (
      <motion.div 
        className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
          config?.pulse ? 'bg-gradient-to-r from-primary-100 to-primary-50 dark:from-primary-900/30 dark:to-primary-800/20' : 
          'bg-default-100 dark:bg-default-800/50'
        }`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${config?.pulse ? 'bg-primary-500 animate-pulse' : 'bg-default-400'}`} />
        <span className={`text-xs font-medium ${
          config?.pulse ? 'text-primary-600 dark:text-primary-400' : 'text-default-600 dark:text-default-400'
        }`}>
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
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className='group relative overflow-hidden border-default-200 dark:border-default-700 bg-content1 dark:bg-content1 hover:shadow-xl transition-all duration-300 hover:border-primary/30 dark:hover:border-primary/50'>
        {/* Gradient overlay */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300' />
        
        <CardBody className='relative p-5'>
          <div className='flex items-start justify-between mb-4'>
            <div className='flex items-start gap-4 flex-1'>
              {getDocumentIcon(document.type.name)}
              
              <div className='min-w-0 flex-1'>
                <div className='flex items-center gap-2 mb-2'>
                  <h3 className='text-foreground font-semibold text-base truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
                    {document.documentName}
                  </h3>
                  {document.sharedWith.length > 0 && (
                    <Badge 
                      content={document.sharedWith.length} 
                      color='primary' 
                      size='sm'
                      className='min-w-5 h-5'
                    >
                      <Icon icon='solar:users-group-rounded-bold' className='h-4 w-4 text-primary-500' />
                    </Badge>
                  )}
                </div>
                
                <div className='flex items-center gap-3 text-sm text-default-500 mb-3'>
                  <div className='flex items-center gap-1'>
                    <Icon icon='solar:calendar-linear' className='h-3.5 w-3.5' />
                    <span>{formatDate(document.createdAt)}</span>
                  </div>
                  <div className='w-1 h-1 rounded-full bg-default-300' />
                  <span>{getTranslatedType(document.type.name, t)}</span>
                </div>
                
                {/* Tags */}
                {document.tags.length > 0 && (
                  <div className='flex gap-1.5 mb-3'>
                    {document.tags.slice(0, 3).map((tag) => (
                      <motion.div
                        key={tag.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Chip 
                          size='sm' 
                          variant='flat' 
                          className='text-xs bg-default-100 dark:bg-default-800 text-default-600 dark:text-default-300'
                          startContent={<Icon icon='solar:hashtag-linear' className='h-2.5 w-2.5' />}
                        >
                          {tag.name}
                        </Chip>
                      </motion.div>
                    ))}
                    {document.tags.length > 3 && (
                      <Chip size='sm' variant='flat' className='text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'>
                        +{document.tags.length - 3}
                      </Chip>
                    )}
                  </div>
                )}
                
                {/* Status */}
                {getStatusBadge(document.status.name)}
              </div>
            </div>
            
            {/* Actions */}
            <motion.div 
              className='flex items-center gap-2 ml-4'
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: isHovered ? 1 : 0.7, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                size='sm' 
                variant='flat'
                color='primary'
                onPress={() => setShowShareModal(true)}
                startContent={<Icon icon="solar:share-linear" className="h-3.5 w-3.5" />}
                className='min-w-0 px-3 hover:scale-105 transition-transform'
              >
                <span className='hidden sm:inline'>{t('card.share')}</span>
              </Button>

              <Dropdown>
                <DropdownTrigger>
                  <Button 
                    isIconOnly 
                    size='sm' 
                    variant='light'
                    className='hover:scale-110 transition-transform hover:bg-default-100 dark:hover:bg-default-800'
                  >
                    <Icon icon='solar:menu-dots-bold' className='text-default-500 h-4 w-4' />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu className='min-w-[160px]'>
                  <DropdownItem key='view' startContent={<Icon icon='solar:eye-linear' className='h-4 w-4' />}>
                    {t('actions.view')}
                  </DropdownItem>
                  <DropdownItem key='edit' startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}>
                    {t('actions.edit')}
                  </DropdownItem>
                  <DropdownItem key='download' startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}>
                    {t('actions.download')}
                  </DropdownItem>
                  <DropdownItem key='duplicate' startContent={<Icon icon='solar:copy-linear' className='h-4 w-4' />}>
                    {t('actions.duplicate')}
                  </DropdownItem>
                  <DropdownItem 
                    key='delete' 
                    className='text-danger' 
                    color='danger'
                    startContent={<Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />}
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
    </motion.div>
  );
}

export function DocumentCardSkeleton() {
  return (
    <Card className='transition-shadow hover:shadow-md border-default-200 dark:border-default-700 bg-content1 dark:bg-content1'>
      <CardBody className='p-4'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center gap-4'>
            {/* Document Icon Skeleton */}
            <Skeleton className='rounded-lg'>
              <div className='h-10 w-10 bg-default-200'></div>
            </Skeleton>

            <div className='min-w-0 flex-1 space-y-2'>
              {/* Document Title Skeleton */}
              <Skeleton className='rounded-lg'>
                <div className='h-5 w-3/4 rounded-lg bg-default-200'></div>
              </Skeleton>

              {/* Metadata Row Skeleton */}
              <div className='flex flex-wrap items-center gap-4'>
                {/* Modified Date */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-20 rounded-lg bg-default-200'></div>
                </Skeleton>

                {/* Document Type */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-16 rounded-lg bg-default-200'></div>
                </Skeleton>

                {/* Tags Skeleton */}
                <div className='flex gap-1'>
                  <Skeleton className='rounded-full'>
                    <div className='h-5 w-12 rounded-full bg-default-200'></div>
                  </Skeleton>
                  <Skeleton className='rounded-full'>
                    <div className='h-5 w-10 rounded-full bg-default-200'></div>
                  </Skeleton>
                </div>

                {/* Status Skeleton */}
                <Skeleton className='rounded-full'>
                  <div className='h-5 w-20 rounded-full bg-default-200'></div>
                </Skeleton>

                {/* Shared With Skeleton */}
                <Skeleton className='rounded-lg'>
                  <div className='h-3 w-16 rounded-lg bg-default-200'></div>
                </Skeleton>
              </div>
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className='flex items-center gap-2'>
            <Skeleton className='rounded-lg'>
              <div className='h-8 w-16 rounded-lg bg-default-200'></div>
            </Skeleton>
            <Skeleton className='rounded-lg'>
              <div className='h-8 w-8 rounded-lg bg-default-200'></div>
            </Skeleton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
