'use client';

import React, { useState } from 'react';
import { 
  Button, 
  Drawer, 
  DrawerBody, 
  DrawerContent, 
  DrawerFooter, 
  DrawerHeader,
  Chip,
  Spinner,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface Document {
  id: string;
  name: string;
  type: 'CV' | 'PORTFOLIO' | 'CERTIFICATE' | 'OTHER';
  url: string;
  uploadDate: string;
  size?: string;
}

interface DocumentViewerDrawerProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  document: Document | null;
  onDownload?: (document: Document) => void;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  isOwnProfile?: boolean;
}

export const DocumentViewerDrawer: React.FC<DocumentViewerDrawerProps> = ({
  isOpen,
  onOpenChange,
  document,
  onDownload,
  onEdit,
  onDelete,
  isOwnProfile = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!document) return null;

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'CV':
        return 'solar:document-text-linear';
      case 'PORTFOLIO':
        return 'solar:folder-open-linear';
      case 'CERTIFICATE':
        return 'solar:diploma-linear';
      default:
        return 'solar:file-linear';
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'CV':
        return 'primary';
      case 'PORTFOLIO':
        return 'secondary';
      case 'CERTIFICATE':
        return 'success';
      default:
        return 'default';
    }
  };

  const isPDF = document.url.toLowerCase().includes('.pdf') || document.type === 'CV';
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(document.url);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleDownload = () => {
    if (onDownload && document) {
      onDownload(document);
    } else {
      // Fallback download
      const link = window.document.createElement('a');
      link.href = document.url;
      link.download = document.name;
      link.click();
    }
  };

  const handleEdit = () => {
    if (onEdit && document) {
      onEdit(document);
    }
  };

  const handleDelete = () => {
    if (onDelete && document) {
      const confirmed = confirm(`Are you sure you want to delete "${document.name}"?`);
      if (confirmed) {
        onDelete(document);
        onOpenChange(false);
      }
    }
  };

  const renderDocumentContent = () => {
    if (isPDF) {
      return (
        <div className='relative h-full min-h-[60vh] bg-default-50 rounded-lg overflow-hidden'>
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <Spinner size='lg' color='primary' />
                <p className='text-sm text-default-500 mt-3'>Loading document...</p>
              </div>
            </div>
          )}
          {error && (
            <div className='absolute inset-0 flex items-center justify-center'>
              <div className='text-center'>
                <Icon icon='solar:file-broken-linear' className='h-16 w-16 text-danger/60 mx-auto mb-3' />
                <p className='text-sm text-danger mb-3'>Failed to load document</p>
                <Button
                  size='sm'
                  variant='flat'
                  color='primary'
                  onPress={handleDownload}
                  startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
                >
                  Download Instead
                </Button>
              </div>
            </div>
          )}
          <iframe
            src={document.url}
            className='w-full h-full border-0'
            title={document.name}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Failed to load document');
            }}
          />
        </div>
      );
    }

    if (isImage) {
      return (
        <div className='relative bg-default-50 rounded-lg overflow-hidden'>
          {isLoading && (
            <div className='absolute inset-0 flex items-center justify-center min-h-[60vh]'>
              <div className='text-center'>
                <Spinner size='lg' color='primary' />
                <p className='text-sm text-default-500 mt-3'>Loading image...</p>
              </div>
            </div>
          )}
          <img
            src={document.url}
            alt={document.name}
            className='w-full h-auto max-h-[70vh] object-contain'
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setError('Failed to load image');
            }}
          />
        </div>
      );
    }

    // For other file types, show a preview card
    return (
      <div className='flex items-center justify-center min-h-[60vh] bg-default-50 rounded-lg'>
        <div className='text-center max-w-md'>
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl bg-${getDocumentColor(document.type)}/10 mx-auto mb-4`}>
            <Icon 
              icon={getDocumentIcon(document.type)} 
              className={`h-10 w-10 text-${getDocumentColor(document.type)}`} 
            />
          </div>
          <h3 className='text-lg font-semibold text-foreground mb-2'>{document.name}</h3>
          <p className='text-sm text-default-500 mb-4'>
            This file type cannot be previewed directly. You can download it to view the content.
          </p>
          <Button
            color='primary'
            variant='flat'
            onPress={handleDownload}
            startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
          >
            Download File
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Drawer
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size='5xl'
      placement='right'
      className='max-w-[95vw]'
    >
      <DrawerContent>
        <DrawerHeader className='pb-4'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-3'>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${getDocumentColor(document.type)}/10`}>
                <Icon 
                  icon={getDocumentIcon(document.type)} 
                  className={`h-5 w-5 text-${getDocumentColor(document.type)}`} 
                />
              </div>
              <div className='min-w-0 flex-1'>
                <h2 className='text-lg font-semibold text-foreground truncate'>
                  {document.name}
                </h2>
                <div className='flex items-center gap-3 text-sm text-default-500'>
                  <div className='flex items-center gap-1'>
                    <Icon icon='solar:calendar-linear' className='h-3 w-3' />
                    <span>{formatDate(document.uploadDate)}</span>
                  </div>
                  {document.size && (
                    <div className='flex items-center gap-1'>
                      <Icon icon='solar:archive-linear' className='h-3 w-3' />
                      <span>{document.size}</span>
                    </div>
                  )}
                  <Chip 
                    size='sm' 
                    variant='flat' 
                    color={getDocumentColor(document.type) as any}
                    className='text-xs'
                  >
                    {document.type}
                  </Chip>
                </div>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <Button
                isIconOnly
                variant='light'
                onPress={handleDownload}
                className='text-default-500 hover:text-primary'
              >
                <Icon icon='solar:download-linear' className='h-4 w-4' />
              </Button>
              
              {isOwnProfile && (
                <>
                  <Button
                    isIconOnly
                    variant='light'
                    onPress={handleEdit}
                    className='text-default-500 hover:text-primary'
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                  <Button
                    isIconOnly
                    variant='light'
                    onPress={handleDelete}
                    className='text-default-500 hover:text-danger'
                  >
                    <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                  </Button>
                  <Divider orientation='vertical' className='h-6 mx-1' />
                </>
              )}
              
              <Button
                isIconOnly
                variant='light'
                onPress={() => onOpenChange(false)}
                className='text-default-500 hover:text-danger'
              >
                <Icon icon='solar:close-linear' className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </DrawerHeader>

        <DrawerBody className='px-6 py-0'>
          {renderDocumentContent()}
        </DrawerBody>

        <DrawerFooter className='pt-4'>
          <div className='flex items-center justify-between w-full'>
            <div className='flex items-center gap-4 text-sm text-default-500'>
              <div className='flex items-center gap-1'>
                <Icon icon='solar:eye-linear' className='h-4 w-4' />
                <span>Preview Mode</span>
              </div>
              {isPDF && (
                <div className='flex items-center gap-1'>
                  <Icon icon='solar:info-circle-linear' className='h-4 w-4' />
                  <span>Use browser controls to zoom and navigate</span>
                </div>
              )}
            </div>
            
            <div className='flex items-center gap-2'>
              <Button
                variant='light'
                onPress={() => onOpenChange(false)}
              >
                Close
              </Button>
              <Button
                color='primary'
                onPress={handleDownload}
                startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
              >
                Download
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
