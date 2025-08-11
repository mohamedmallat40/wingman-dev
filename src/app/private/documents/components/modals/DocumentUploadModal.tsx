'use client';

import React, { useCallback, useEffect, useState } from 'react';

import {
  Button,
  Divider,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Progress,
  Select,
  SelectItem
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { FileUpload, FormField, Tag, TagSelector } from '@/components/ui';
import wingManApi from '@/lib/axios';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (data: {
    name: string;
    tags: string[];
    file: File;
    type: string;
    status: string;
  }) => Promise<void>;
}

interface UploadResponse {
  originalname: string;
  filename: string;
  buffer: string;
}

interface DocumentCreatePayload {
  documentName: string;
  typeId: string;
  tags: string[];
  statusId: string;
  fileName: string;
}

// API Response Types
interface DocumentStatus {
  id: string;
  name: string;
}

interface DocumentTypeResponse {
  id: string;
  name: string;
  statuses: DocumentStatus[];
}

interface TagResponse {
  id: string;
  name: string;
}

// Helper function to assign colors to tags based on their name
const getTagColor = (
  tagName: string
): 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default' => {
  const lowerName = tagName.toLowerCase();

  // Color mapping based on tag content
  if (
    lowerName.includes('urgent') ||
    lowerName.includes('critical') ||
    lowerName.includes('important')
  )
    return 'danger';
  if (
    lowerName.includes('success') ||
    lowerName.includes('complete') ||
    lowerName.includes('done') ||
    lowerName.includes('final')
  )
    return 'success';
  if (
    lowerName.includes('warning') ||
    lowerName.includes('pending') ||
    lowerName.includes('review') ||
    lowerName.includes('draft')
  )
    return 'warning';
  if (lowerName.includes('info') || lowerName.includes('note') || lowerName.includes('secondary'))
    return 'secondary';
  if (lowerName.includes('primary') || lowerName.includes('main') || lowerName.includes('key'))
    return 'primary';

  // Default color rotation based on hash of tag name
  const colors: Array<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'> = [
    'primary',
    'secondary',
    'success',
    'warning',
    'default'
  ];
  let hash = 0;
  for (let i = 0; i < tagName.length; i++) {
    hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const t = useTranslations();

  // Form state
  const [documentName, setDocumentName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentTypeResponse | null>(
    null
  );
  const [documentStatus, setDocumentStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // API state
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeResponse[]>([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  // Fetch document types from API
  useEffect(() => {
    const fetchDocumentTypes = async () => {
      try {
        setIsLoadingTypes(true);
        const response = await wingManApi.get<DocumentTypeResponse[]>('/documents/types');
        setDocumentTypes(response.data);
      } catch (error) {
        console.error('Failed to fetch document types:', error);
        setError('Failed to load document types');
      } finally {
        setIsLoadingTypes(false);
      }
    };

    const fetchTags = async () => {
      try {
        setIsLoadingTags(true);
        const response = await wingManApi.get<TagResponse[]>('/tags/my-created-tags');
        const tags: Tag[] = response.data.map((tag) => ({
          key: tag.id,
          label: tag.name,
          color: getTagColor(tag.name)
        }));
        setAvailableTags(tags);
      } catch (error) {
        console.error('Failed to fetch tags:', error);
        setError('Failed to load tags');
      } finally {
        setIsLoadingTags(false);
      }
    };

    if (isOpen) {
      fetchDocumentTypes();
      fetchTags();
    }
  }, [isOpen]);

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    if (!isUploading) {
      setDocumentName('');
      setSelectedTags([]);
      setSelectedFile(null);
      setSelectedDocumentType(null);
      setDocumentStatus('');
      setUploadProgress(0);
      setError('');
      setSuccess(false);
      onClose();
    }
  }, [isUploading, onClose]);

  // Handle document type change
  const handleTypeChange = useCallback(
    (typeId: string) => {
      const documentType = documentTypes.find((type) => type.id === typeId);
      if (documentType) {
        setSelectedDocumentType(documentType);
        setDocumentStatus(''); // Reset status when type changes
      }
    },
    [documentTypes]
  );

  // Get available status options based on selected document type
  const availableStatuses = selectedDocumentType ? selectedDocumentType.statuses : [];

  // File upload handlers
  const handleFileSelect = useCallback(
    (file: File) => {
      setSelectedFile(file);
      setError('');
      // Auto-populate document name from filename if not set
      if (!documentName) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setDocumentName(nameWithoutExt);
      }
    },
    [documentName]
  );

  const handleFileRemove = useCallback(() => {
    setSelectedFile(null);
  }, []);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Tag handlers
  const handleTagSelect = useCallback((tagKey: string) => {
    setSelectedTags((prev) => [...prev, tagKey]);
  }, []);

  const handleTagRemove = useCallback((tagKey: string) => {
    setSelectedTags((prev) => prev.filter((key) => key !== tagKey));
  }, []);

  // Handle form submission
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedFile || !documentName.trim() || !selectedDocumentType || !documentStatus) {
        setError('Please fill in all required fields');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      try {
        // Create form data with all document information and file
        setUploadProgress(20);

        const typeId = selectedDocumentType.id;
        const selectedStatusObj = selectedDocumentType.statuses.find(
          (status) => status.id === documentStatus
        );
        const statusId = selectedStatusObj?.id;
        const tagIds = selectedTags; // selectedTags now contains actual tag IDs from API

        if (!typeId) throw new Error(`Invalid document type selected`);
        if (!statusId) throw new Error(`Invalid status selected`);

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('documentName', documentName.trim());
        formData.append('typeId', typeId);
        formData.append('statusId', statusId);

        // Append each tag ID separately
        tagIds.forEach((tagId, index) => {
          formData.append(`tags[${index}]`, tagId);
        });

        setUploadProgress(60);

        // Upload document with all data in single request
        const uploadResponse = await wingManApi.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        setUploadProgress(100);

        await onUpload?.({
          name: documentName.trim(),
          tags: selectedTags,
          file: selectedFile,
          type: selectedDocumentType.name,
          status: selectedStatusObj?.name || documentStatus
        });

        setSuccess(true);

        // Auto close after success
        setTimeout(handleClose, 2000);
      } catch (error) {
        console.error('Upload failed:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload document. Please try again.';
        setError(errorMessage);
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    [
      selectedFile,
      documentName,
      selectedTags,
      selectedDocumentType,
      documentStatus,
      onUpload,
      handleClose
    ]
  );

  const isFormValid = documentName.trim() && selectedFile && selectedDocumentType && documentStatus;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='2xl'
      scrollBehavior='inside'
      backdrop='blur'
      isDismissable={!isUploading}
      hideCloseButton
      classNames={{
        wrapper: 'p-4 sm:p-6',
        base: 'bg-background/95 dark:bg-content1/95 backdrop-blur-md border-0',
        backdrop: 'bg-gradient-to-br from-black/40 via-black/30 to-black/40 backdrop-blur-lg'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }
          },
          exit: {
            y: -30,
            opacity: 0,
            scale: 0.9,
            transition: {
              duration: 0.25,
              ease: 'easeInOut'
            }
          }
        }
      }}
    >
      <ModalContent className='border-default-200/50 dark:border-default-700/50 w-full max-w-2xl overflow-hidden rounded-3xl border shadow-2xl ring-1 ring-white/10 backdrop-blur-xl dark:ring-white/5'>
        {() => (
          <>
            <ModalHeader className='via-default-50/20 to-default-50/40 dark:via-default-900/10 dark:to-default-900/20 flex flex-col gap-2 bg-gradient-to-b from-transparent px-8 pt-8 pb-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex items-center gap-3'
              >
                <motion.div
                  className='from-primary/10 via-primary/5 ring-primary/20 relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br to-transparent shadow-lg ring-1 backdrop-blur-sm'
                  whileHover={{ scale: 1.08, rotate: 8 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div className='from-primary/5 to-primary/10 absolute inset-0 rounded-2xl bg-gradient-to-br blur-xl' />
                  <Icon
                    icon={success ? 'solar:check-circle-bold' : 'solar:upload-linear'}
                    className='text-primary relative z-10 h-8 w-8 drop-shadow-sm'
                  />
                </motion.div>
                <div className='flex flex-col gap-1'>
                  <h2 className='text-foreground from-foreground to-foreground/80 bg-gradient-to-r bg-clip-text text-2xl font-bold tracking-tight'>
                    {success ? 'Upload Successful!' : t('documents.upload.title')}
                  </h2>
                  <p className='text-default-500 text-sm font-medium tracking-wide opacity-90'>
                    {success
                      ? `Document "${documentName}" uploaded successfully`
                      : t('documents.upload.subtitle')}
                  </p>
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody className='via-default-50/20 to-default-50/40 dark:via-default-900/10 dark:to-default-900/20 gap-6 bg-gradient-to-b from-transparent px-8 py-6'>
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800/30 rounded-2xl border p-6 text-center'
                >
                  <Icon
                    icon='solar:document-add-bold'
                    className='text-success mx-auto mb-3 h-12 w-12'
                  />
                  <p className='text-success-700 dark:text-success-400 mb-4 font-medium'>
                    Document uploaded successfully!
                  </p>
                  <p className='text-default-600 dark:text-default-400 text-sm'>
                    Your document has been processed and is now available in your document library.
                  </p>
                </motion.div>
              ) : (
                <Form
                  id='upload-form'
                  className='flex flex-col gap-4'
                  validationBehavior='native'
                  onSubmit={handleSubmit}
                >
                  {/* Document Name Input */}
                  <FormField label={t('documents.upload.documentName.label')} required delay={0.1}>
                    <Input
                      isRequired
                      value={documentName}
                      onValueChange={setDocumentName}
                      placeholder={t('documents.upload.documentName.placeholder')}
                      variant='bordered'
                      classNames={{
                        base: 'w-full',
                        mainWrapper: 'w-full',
                        inputWrapper:
                          'border-default-300/60 data-[hover=true]:border-primary/60 data-[hover=true]:bg-primary/5 group-data-[focus=true]:border-primary group-data-[focus=true]:bg-primary/5 group-data-[focus=true]:shadow-lg group-data-[focus=true]:shadow-primary/10 rounded-2xl h-14 bg-default-100/50 dark:bg-default-50/50 backdrop-blur-sm transition-all duration-300',
                        input:
                          'text-foreground font-medium tracking-wide placeholder:text-default-400 pl-2 text-base'
                      }}
                      startContent={
                        <Icon
                          icon='solar:document-text-linear'
                          className='text-default-400 h-5 w-5 flex-shrink-0'
                        />
                      }
                    />
                  </FormField>

                  {/* Document Type and Status */}
                  <div className='flex w-full gap-3'>
                    <FormField
                      label={t('documents.upload.type.label')}
                      required
                      delay={0.2}
                      className='w-1/2'
                    >
                      <Select
                        isRequired
                        isLoading={isLoadingTypes}
                        selectedKeys={selectedDocumentType ? [selectedDocumentType.id] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          if (selectedKey) handleTypeChange(selectedKey as string);
                        }}
                        placeholder={
                          isLoadingTypes
                            ? 'Loading types...'
                            : t('documents.upload.type.placeholder')
                        }
                        variant='bordered'
                        classNames={{
                          base: 'w-full',
                          trigger:
                            'border-default-300/60 data-[hover=true]:border-primary/60 data-[hover=true]:bg-primary/5 group-data-[focus=true]:border-primary group-data-[focus=true]:bg-primary/5 group-data-[focus=true]:shadow-lg group-data-[focus=true]:shadow-primary/10 rounded-2xl h-14 bg-default-100/50 dark:bg-default-50/50 backdrop-blur-sm transition-all duration-300 w-full',
                          value: '!text-black font-medium tracking-wide',
                          listbox: 'max-h-[200px]',
                          popoverContent:
                            'rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-white/5 border border-default-200/50 dark:border-default-700/50 backdrop-blur-xl'
                        }}
                        startContent={
                          <Icon
                            icon='solar:folder-linear'
                            className='text-default-400 h-5 w-5 flex-shrink-0'
                          />
                        }
                      >
                        {documentTypes.map((type) => (
                          <SelectItem
                            key={type.id}
                            value={type.id}
                            classNames={{
                              base: 'hover:!bg-blue-100 data-[hover=true]:!bg-blue-100 data-[selected=true]:!bg-blue-200'
                            }}
                          >
                            {type.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </FormField>

                    <FormField
                      label={t('documents.upload.status.label')}
                      required
                      delay={0.3}
                      className='w-1/2'
                    >
                      <Select
                        isRequired
                        isDisabled={!selectedDocumentType}
                        selectedKeys={documentStatus ? [documentStatus] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          if (selectedKey) setDocumentStatus(selectedKey as string);
                        }}
                        placeholder={
                          !selectedDocumentType
                            ? 'Select document type first'
                            : t('documents.upload.status.placeholder')
                        }
                        variant='bordered'
                        classNames={{
                          base: 'w-full',
                          trigger:
                            'border-default-300/60 data-[hover=true]:border-primary/60 data-[hover=true]:bg-primary/5 group-data-[focus=true]:border-primary group-data-[focus=true]:bg-primary/5 group-data-[focus=true]:shadow-lg group-data-[focus=true]:shadow-primary/10 rounded-2xl h-14 bg-default-100/50 dark:bg-default-50/50 backdrop-blur-sm transition-all duration-300 w-full',
                          value: '!text-black font-medium tracking-wide',
                          listbox: 'max-h-[200px]',
                          popoverContent:
                            'rounded-2xl shadow-2xl ring-1 ring-white/10 dark:ring-white/5 border border-default-200/50 dark:border-default-700/50 backdrop-blur-xl'
                        }}
                        startContent={
                          <Icon
                            icon='solar:flag-linear'
                            className='text-default-400 h-5 w-5 flex-shrink-0'
                          />
                        }
                      >
                        {availableStatuses.map((status) => (
                          <SelectItem
                            key={status.id}
                            value={status.id}
                            classNames={{
                              base: 'hover:!bg-blue-100 data-[hover=true]:!bg-blue-100 data-[selected=true]:!bg-blue-200'
                            }}
                          >
                            {status.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </FormField>
                  </div>

                  {/* Tags Selection */}
                  <FormField label={t('documents.upload.tags.label')} delay={0.4}>
                    <TagSelector
                      availableTags={availableTags}
                      selectedTags={selectedTags}
                      onTagSelect={handleTagSelect}
                      onTagRemove={handleTagRemove}
                      placeholder={
                        isLoadingTags ? 'Loading tags...' : t('documents.upload.tags.placeholder')
                      }
                      maxSelectedTags={5}
                    />
                  </FormField>

                  <Divider className='bg-default-200/50' />

                  {/* File Upload */}
                  <FormField label={t('documents.upload.file.label')} required delay={0.5}>
                    <FileUpload
                      selectedFile={selectedFile}
                      onFileSelect={handleFileSelect}
                      onFileRemove={handleFileRemove}
                      isDragOver={isDragOver}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      acceptedFileTypes='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx'
                      maxFileSize={10 * 1024 * 1024}
                    />
                  </FormField>

                  {/* Upload Progress */}
                  <AnimatePresence>
                    {isUploading && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className='space-y-2'
                      >
                        <div className='flex justify-between text-sm'>
                          <span className='text-foreground'>
                            {t('documents.upload.progress.uploading')}
                          </span>
                          <span className='text-default-500'>{uploadProgress}%</span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          color='primary'
                          className='w-full'
                          classNames={{
                            track: 'drop-shadow-md border border-default',
                            indicator: 'bg-gradient-to-r from-primary-500 to-primary-600',
                            label: 'tracking-wider font-medium text-default-600',
                            value: 'text-foreground/60'
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Form>
              )}
            </ModalBody>

            <ModalFooter className='from-background/70 to-background/90 dark:from-content1/70 dark:to-content1/90 border-divider/30 justify-end border-t bg-gradient-to-r px-8 pt-6 pb-8 backdrop-blur-sm'>
              {!success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className='flex gap-3'
                >
                  <Button
                    variant='bordered'
                    onPress={handleClose}
                    disabled={isUploading}
                    className='border-default-300/60 hover:border-primary/60 hover:bg-primary/5 hover:shadow-primary/10 h-12 rounded-2xl font-medium tracking-wide backdrop-blur-sm transition-all duration-300 hover:shadow-lg'
                  >
                    {t('documents.upload.buttons.cancel')}
                  </Button>
                  <Button
                    type='submit'
                    color='primary'
                    size='lg'
                    isDisabled={!isFormValid}
                    isLoading={isUploading}
                    startContent={
                      !isUploading ? (
                        <Icon icon='solar:upload-linear' className='h-4 w-4 drop-shadow-sm' />
                      ) : undefined
                    }
                    className='from-primary to-primary-600 shadow-primary/20 hover:shadow-primary/30 h-12 rounded-2xl bg-gradient-to-r text-lg font-bold tracking-wide shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl'
                    form='upload-form'
                  >
                    {isUploading
                      ? t('documents.upload.buttons.uploading')
                      : t('documents.upload.buttons.upload')}
                  </Button>
                </motion.div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DocumentUploadModal;
