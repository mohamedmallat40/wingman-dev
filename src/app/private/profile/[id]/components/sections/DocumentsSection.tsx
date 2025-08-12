'use client';

import React, { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { ActionButtons } from '../ActionButtons';
import { DocumentViewerDrawer } from '../DocumentViewerDrawer';

interface Document {
  id: string;
  name: string;
  type: 'CV' | 'PORTFOLIO' | 'CERTIFICATE' | 'OTHER';
  url: string;
  uploadDate: string;
  size?: string;
}

interface DocumentsSectionProps {
  documents: Document[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (document: Document) => void;
  onDelete: (document: Document) => void;
  onDownload: (document: Document) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete,
  onDownload
}) => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
    setIsViewerOpen(true);
  };
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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Card className='border-default-200/50 hover:border-primary/20 transition-all duration-300'>
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-colors duration-200'>
              <Icon icon='solar:folder-with-files-linear' className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h3 className='text-lg font-semibold text-foreground'>
                Documents ({documents.length})
              </h3>
              <p className='text-sm text-default-500'>
                CVs, portfolios, and certificates
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons
              showAdd
              onAdd={onAdd}
              addTooltip="Upload document"
              size="md"
            />
          )}
        </div>
      </CardHeader>

      <CardBody className='pt-0'>
        {documents.length > 0 ? (
          <div className='space-y-3'>
            {documents.map((doc, index) => (
              <Card 
                key={doc.id || index}
                className='border border-default-200/50 hover:border-primary/30 transition-all duration-200 group'
              >
                <CardBody className='p-4'>
                  <div className='flex items-center gap-3'>
                    {/* Document Icon */}
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${getDocumentColor(doc.type)}/10`}>
                      <Icon 
                        icon={getDocumentIcon(doc.type)} 
                        className={`h-5 w-5 text-${getDocumentColor(doc.type)}`} 
                      />
                    </div>

                    {/* Document Info */}
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2 mb-1'>
                        <h4 className='font-medium text-foreground truncate'>
                          {doc.name}
                        </h4>
                        <Chip 
                          size='sm' 
                          variant='flat' 
                          color={getDocumentColor(doc.type) as any}
                          className='text-xs'
                        >
                          {doc.type}
                        </Chip>
                      </div>
                      
                      <div className='flex items-center gap-3 text-xs text-default-500'>
                        <div className='flex items-center gap-1'>
                          <Icon icon='solar:calendar-linear' className='h-3 w-3' />
                          <span>{formatDate(doc.uploadDate)}</span>
                        </div>
                        {doc.size && (
                          <div className='flex items-center gap-1'>
                            <Icon icon='solar:archive-linear' className='h-3 w-3' />
                            <span>{doc.size}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1'>
                      <Button
                        isIconOnly
                        size='sm'
                        variant='light'
                        className='text-default-500 hover:text-primary'
                        onPress={() => onDownload(doc)}
                      >
                        <Icon icon='solar:download-linear' className='h-4 w-4' />
                      </Button>

                      {isOwnProfile && (
                        <div className='opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => onEdit(doc)}
                            onDelete={() => onDelete(doc)}
                            editTooltip={`Edit ${doc.name}`}
                            deleteTooltip={`Delete ${doc.name}`}
                            size="sm"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10'>
              <Icon icon='solar:folder-with-files-linear' className='h-8 w-8 text-primary/60' />
            </div>
            <p className='text-sm text-default-500 mb-4'>
              No documents uploaded yet
            </p>
            {isOwnProfile && (
              <Button
                size='sm'
                variant='flat'
                color='primary'
                onPress={onAdd}
                startContent={<Icon icon='solar:upload-linear' className='h-4 w-4' />}
              >
                <span className='hidden sm:inline'>Upload Document</span>
                <span className='sm:hidden'>Upload</span>
              </Button>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};
