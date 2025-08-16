import React, { useMemo } from 'react';

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { IDocument } from '../types';
import { getDocumentPreviewUrl, getDocumentDownloadUrl } from '../utils';

interface DocumentViewerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  document: IDocument | null;
  onEdit?: (document: IDocument) => void;
  onDelete?: (document: IDocument) => void;
}

export const DocumentViewerDrawer: React.FC<DocumentViewerDrawerProps> = ({
  isOpen,
  onClose,
  document,
  onEdit,
  onDelete
}) => {
  const t = useTranslations('documents');

  const previewUrl = useMemo(() => {
    return document ? getDocumentPreviewUrl(document) : null;
  }, [document]);

  const downloadUrl = useMemo(() => {
    return document ? getDocumentDownloadUrl(document) : null;
  }, [document]);

  const isPDF = useMemo(() => {
    if (!document) return false;
    return document.fileName.toLowerCase().endsWith('.pdf') || document.type?.name.toLowerCase() === 'pdf';
  }, [document]);

  const isImage = useMemo(() => {
    if (!document) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some((ext) => document.fileName.toLowerCase().endsWith(ext));
  }, [document]);

  const renderDocumentContent = () => {
    if (!previewUrl) {
      return (
        <div className='flex h-full items-center justify-center'>
          <div className='text-center'>
            <Icon icon='solar:file-corrupted-linear' className='mx-auto mb-4 h-16 w-16 text-default-400' />
            <h3 className='mb-2 text-lg font-semibold text-default-600'>No Preview Available</h3>
            <p className='text-default-500'>This document cannot be previewed.</p>
          </div>
        </div>
      );
    }

    if (isPDF) {
      return (
        <div className='h-full w-full bg-default-50'>
          <iframe
            src={previewUrl}
            className='h-full w-full border-0'
            title={`Preview of ${document?.documentName || 'Document'}`}
            onError={() => {
              console.error('Failed to load PDF preview');
            }}
          />
          {/* Fallback message if PDF fails to load */}
          <div className='hidden' id={`pdf-fallback-${document?.id}`}>
            <div className='flex h-full items-center justify-center'>
              <div className='text-center'>
                <Icon icon='solar:file-text-linear' className='mx-auto mb-4 h-16 w-16 text-default-400' />
                <h3 className='mb-2 text-lg font-semibold text-default-600'>PDF Preview Unavailable</h3>
                <p className='text-default-500 mb-4'>
                  Unable to preview this PDF file in browser.
                </p>
                <Button
                  color='primary'
                  variant='flat'
                  startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
                  as='a'
                  href={downloadUrl || '#'}
                  download={document?.documentName}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isImage) {
      return (
        <div className='flex h-full items-center justify-center p-4 bg-default-50'>
          <motion.img
            src={previewUrl}
            alt={document?.documentName || 'Document'}
            className='max-h-full max-w-full object-contain rounded-lg shadow-lg cursor-zoom-in'
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={() => {
              // Open in new tab for full-screen view
              window.open(previewUrl, '_blank');
            }}
            onError={(e) => {
              console.error('Failed to load image:', e);
              // Fallback to download option
            }}
          />
        </div>
      );
    }

    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <Icon icon='solar:file-text-linear' className='mx-auto mb-4 h-16 w-16 text-default-400' />
          <h3 className='mb-2 text-lg font-semibold text-default-600'>Preview Not Supported</h3>
          <p className='text-default-500'>
            This file type cannot be previewed. Please download to view.
          </p>
          <Button
            color='primary'
            variant='flat'
            startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
            className='mt-4'
            as='a'
            href={downloadUrl || '#'}
            download={document?.documentName}
          >
            Download File
          </Button>
        </div>
      </div>
    );
  };

  if (!document) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Drawer
          isOpen={isOpen}
          onClose={onClose}
          size='5xl'
          backdrop='blur'
          classNames={{
            backdrop: 'backdrop-blur-md bg-background/60',
            wrapper: 'w-full max-w-none',
            base: 'w-full max-w-none data-[placement=right]:sm:max-w-5xl'
          }}
        >
          <DrawerContent>
            <DrawerHeader className='border-b border-default-200/50 bg-content1/50 backdrop-blur-md'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-primary/10 p-2'>
                    <Icon
                      icon='solar:document-text-bold'
                      className='h-5 w-5 text-primary-600'
                    />
                  </div>
                  <div>
                    <h2 className='text-lg font-semibold text-foreground'>
                      {document.documentName}
                    </h2>
                    <p className='text-sm text-default-500'>
                      {document.type?.name} • {new Date(document.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  <Button
                    size='sm'
                    variant='flat'
                    color='primary'
                    startContent={<Icon icon='solar:download-outline' className='h-4 w-4' />}
                    as='a'
                    href={downloadUrl || '#'}
                    download={document?.documentName}
                  >
                    Download
                  </Button>
                  {onEdit && (
                    <Button
                      size='sm'
                      variant='flat'
                      color='secondary'
                      startContent={<Icon icon='solar:pen-outline' className='h-4 w-4' />}
                      onPress={() => {
                        onEdit(document);
                        onClose();
                      }}
                    >
                      Edit
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      size='sm'
                      variant='flat'
                      color='danger'
                      startContent={<Icon icon='solar:trash-bin-minimalistic-outline' className='h-4 w-4' />}
                      onPress={() => {
                        onDelete(document);
                        onClose();
                      }}
                    >
                      Delete
                    </Button>
                  )}
                  <Button
                    isIconOnly
                    size='sm'
                    variant='light'
                    onPress={onClose}
                    className='hover:bg-default-100 dark:hover:bg-default-800'
                  >
                    <Icon icon='solar:close-circle-outline' className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </DrawerHeader>

            <DrawerBody className='p-0'>
              <motion.div
                className='h-full w-full'
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                {renderDocumentContent()}
              </motion.div>
            </DrawerBody>

            <DrawerFooter className='border-t border-default-200/50 bg-content1/50 backdrop-blur-md'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-2 text-sm text-default-500'>
                  <Icon icon='solar:info-circle-linear' className='h-4 w-4' />
                  <span>
                    {document.tags.length > 0
                      ? `Tags: ${document.tags.map((tag) => tag.name).join(', ')}`
                      : 'No tags assigned'}
                  </span>
                </div>
                <Button
                  color='primary'
                  variant='light'
                  onPress={onClose}
                  startContent={<Icon icon='solar:close-circle-linear' className='h-4 w-4' />}
                >
                  Close
                </Button>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </AnimatePresence>
  );
};
