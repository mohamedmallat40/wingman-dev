'use client';

import React, { useCallback, useRef, useState } from 'react';

import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Chip,
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

// Document types
const DOCUMENT_TYPES = ['INVOICE', 'QUOTE', 'CONTRACT'] as const;
type DocumentType = (typeof DOCUMENT_TYPES)[number];

// Status options based on document type
const STATUS_OPTIONS = {
  INVOICE: [
    'Draft',
    'Pending Review',
    'Issued',
    'Rejected',
    'Overdue',
    'Archived',
    'Cancelled',
    'Disputed'
  ],
  QUOTE: ['Draft', 'Pending Review', 'Issued', 'Rejected', 'Overdue', 'Archived', 'Cancelled'],
  CONTRACT: ['Draft', 'Pending Review', 'Issued', 'Rejected', 'Overdue', 'Archived', 'Cancelled']
} as const;

// Document type ID mappings - TODO: Update with real IDs from your system
const DOCUMENT_TYPE_IDS = {
  INVOICE: '08d5bea7-7a2f-499e-9768-f12dbd1f1071', // Example ID - replace with actual
  QUOTE: 'quote-type-id-here', // TODO: Replace with actual ID
  CONTRACT: 'contract-type-id-here' // TODO: Replace with actual ID
};

// Status ID mappings - TODO: Update with real IDs from your system
const STATUS_IDS = {
  Draft: '60d445b8-4ce6-4eb6-be0c-1acaebedf208', // Example ID - replace with actual
  'Pending Review': 'pending-review-id-here', // TODO: Replace with actual ID
  Issued: 'issued-id-here', // TODO: Replace with actual ID
  Rejected: 'rejected-id-here', // TODO: Replace with actual ID
  Overdue: 'overdue-id-here', // TODO: Replace with actual ID
  Archived: 'archived-id-here', // TODO: Replace with actual ID
  Cancelled: 'cancelled-id-here', // TODO: Replace with actual ID
  Disputed: 'disputed-id-here' // TODO: Replace with actual ID
};

// Tag ID mappings - TODO: Update with real IDs from your system
const TAG_IDS = {
  contract: '4d702ba4-6403-40e6-a679-5f07b2bd8416', // Example ID - replace with actual
  proposal: 'proposal-tag-id-here', // TODO: Replace with actual ID
  invoice: 'invoice-tag-id-here', // TODO: Replace with actual ID
  financial: 'financial-tag-id-here', // TODO: Replace with actual ID
  legal: 'legal-tag-id-here', // TODO: Replace with actual ID
  marketing: 'marketing-tag-id-here', // TODO: Replace with actual ID
  hr: 'hr-tag-id-here', // TODO: Replace with actual ID
  technical: 'technical-tag-id-here', // TODO: Replace with actual ID
  design: 'design-tag-id-here', // TODO: Replace with actual ID
  project: 'project-tag-id-here', // TODO: Replace with actual ID
  client: 'client-tag-id-here', // TODO: Replace with actual ID
  internal: 'internal-tag-id-here', // TODO: Replace with actual ID
  urgent: 'urgent-tag-id-here', // TODO: Replace with actual ID
  draft: 'draft-tag-id-here', // TODO: Replace with actual ID
  final: 'final-tag-id-here' // TODO: Replace with actual ID
};

// Mock available tags - in real app this would come from API
const AVAILABLE_TAG_KEYS = [
  { key: 'contract', color: 'primary' },
  { key: 'proposal', color: 'secondary' },
  { key: 'invoice', color: 'success' },
  { key: 'financial', color: 'warning' },
  { key: 'legal', color: 'danger' },
  { key: 'marketing', color: 'primary' },
  { key: 'hr', color: 'secondary' },
  { key: 'technical', color: 'success' },
  { key: 'design', color: 'warning' },
  { key: 'project', color: 'danger' },
  { key: 'client', color: 'primary' },
  { key: 'internal', color: 'secondary' },
  { key: 'urgent', color: 'danger' },
  { key: 'draft', color: 'default' },
  { key: 'final', color: 'success' }
];

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create available tags with i18n labels
  const AVAILABLE_TAGS = AVAILABLE_TAG_KEYS.map((tagConfig) => ({
    ...tagConfig,
    label: t(`documents.tags.${tagConfig.key}`)
  }));

  // Form state
  const [documentName, setDocumentName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [documentStatus, setDocumentStatus] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Filter available tags based on search and exclude already selected
  const filteredTags = AVAILABLE_TAGS.filter(
    (tag) =>
      !selectedTags.includes(tag.key) && tag.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    if (!isUploading) {
      setDocumentName('');
      setSelectedTags([]);
      setSelectedFile(null);
      setDocumentType('');
      setDocumentStatus('');
      setSearchValue('');
      setUploadProgress(0);
      setError('');
      setSuccess(false);
      onClose();
    }
  }, [isUploading, onClose]);

  // Handle document type change
  const handleTypeChange = useCallback((value: string) => {
    if (value && DOCUMENT_TYPES.includes(value as DocumentType)) {
      setDocumentType(value as DocumentType);
      // Reset status when type changes
      setDocumentStatus('');
    }
  }, []);

  // Get available status options based on document type
  const availableStatuses =
    documentType && STATUS_OPTIONS[documentType] ? STATUS_OPTIONS[documentType] : [];

  // Handle file selection
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

  // File input change handler
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFileSelect(files[0]);
      }
    },
    [handleFileSelect]
  );

  // Tag selection handlers
  const handleTagSelect = useCallback(
    (tagKey: string) => {
      if (!selectedTags.includes(tagKey)) {
        setSelectedTags((prev) => [...prev, tagKey]);
      }
      setSearchValue('');
    },
    [selectedTags]
  );

  const handleTagRemove = useCallback((tagKey: string) => {
    setSelectedTags((prev) => prev.filter((key) => key !== tagKey));
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return `0 ${t('documents.upload.fileSize.bytes')}`;
    const k = 1024;
    const sizes = [
      t('documents.upload.fileSize.bytes'),
      t('documents.upload.fileSize.kb'),
      t('documents.upload.fileSize.mb'),
      t('documents.upload.fileSize.gb')
    ];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (file: File): string => {
    const type = file.type.toLowerCase();
    if (type.includes('pdf')) return 'solar:file-text-bold';
    if (type.includes('image')) return 'solar:gallery-bold';
    if (type.includes('video')) return 'solar:videocamera-record-bold';
    if (type.includes('audio')) return 'solar:music-note-bold';
    if (type.includes('spreadsheet') || type.includes('excel')) return 'solar:chart-square-bold';
    if (type.includes('word') || type.includes('document')) return 'solar:document-bold';
    if (type.includes('presentation') || type.includes('powerpoint'))
      return 'solar:presentation-graph-bold';
    return 'solar:file-bold';
  };

  // Handle form submission with real API calls
  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedFile || !documentName.trim() || !documentType || !documentStatus) {
        setError('Please fill in all required fields');
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError('');

      try {
        // Step 1: Upload the file to /upload endpoint
        setUploadProgress(20);
        const formData = new FormData();
        formData.append('file', selectedFile);

        console.log('Uploading file to /upload endpoint...');
        const uploadResponse = await wingManApi.post<UploadResponse>('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('File upload response:', uploadResponse.data);
        setUploadProgress(60);

        // Step 2: Create the document record with /documents endpoint
        const typeId = DOCUMENT_TYPE_IDS[documentType];
        const statusId = STATUS_IDS[documentStatus];
        const tagIds = selectedTags.map((tagKey) => TAG_IDS[tagKey]).filter(Boolean); // Filter out undefined IDs

        if (!typeId) {
          throw new Error(`No ID mapping found for document type: ${documentType}`);
        }
        if (!statusId) {
          throw new Error(`No ID mapping found for status: ${documentStatus}`);
        }

        const documentPayload: DocumentCreatePayload = {
          documentName: documentName.trim(),
          typeId,
          tags: tagIds,
          statusId,
          fileName: uploadResponse.data.filename
        };

        console.log('Creating document with payload:', documentPayload);
        setUploadProgress(80);

        const documentResponse = await wingManApi.post('/documents', documentPayload);
        console.log('Document created:', documentResponse.data);

        setUploadProgress(100);

        // Call the optional onUpload callback for parent component
        await onUpload?.({
          name: documentName.trim(),
          tags: selectedTags,
          file: selectedFile,
          type: documentType,
          status: documentStatus
        });

        setSuccess(true);

        // Auto close after success delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
        console.error('Upload failed:', error);

        // Show user-friendly error message
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to upload document. Please try again.';
        setError(errorMessage);

        // Reset progress on error
        setUploadProgress(0);
      } finally {
        setIsUploading(false);
      }
    },
    [selectedFile, documentName, selectedTags, documentType, documentStatus, onUpload, handleClose]
  );

  const isFormValid = documentName.trim() && selectedFile && documentType && documentStatus;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='2xl'
      scrollBehavior='inside'
      backdrop='opaque'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50 backdrop-blur-sm'
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: 'easeOut'
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: 'easeIn'
            }
          }
        }
      }}
    >
      <ModalContent className='w-full max-w-2xl rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
        {() => (
          <>
            <ModalHeader className='flex flex-col gap-1 pt-8 pb-6'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex items-center gap-3'
              >
                <motion.div
                  className='from-primary/20 to-secondary/20 ring-primary/30 flex h-16 w-16 items-center justify-center rounded-[24px] bg-gradient-to-br ring-1'
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon
                    icon={success ? 'solar:check-circle-bold' : 'solar:upload-linear'}
                    className='text-primary h-8 w-8'
                  />
                </motion.div>
                <div>
                  <h2 className='text-foreground text-2xl font-bold tracking-[0.02em]'>
                    {success ? 'Upload Successful!' : t('documents.upload.title')}
                  </h2>
                  <p className='text-default-500 font-normal tracking-[0.02em]'>
                    {success
                      ? `Document "${documentName}" uploaded successfully`
                      : t('documents.upload.subtitle')}
                  </p>
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody className='gap-6 py-6'>
              {success ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800/30 rounded-[16px] border p-6 text-center'
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
                // Upload Form
                <Form
                  className='flex flex-col gap-6'
                  validationBehavior='native'
                  onSubmit={handleSubmit}
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800/30 mb-4 rounded-[16px] border p-4'
                      >
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:danger-triangle-bold' className='text-danger h-4 w-4' />
                          <p className='text-danger text-sm font-medium tracking-[0.02em]'>
                            {error}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Document Name Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className='space-y-2'
                  >
                    <label className='text-foreground text-sm font-medium'>
                      {t('documents.upload.documentName.label')}{' '}
                      <span className='text-danger'>*</span>
                    </label>
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
                          'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                        input:
                          'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                      }}
                      startContent={
                        <Icon
                          icon='solar:document-text-linear'
                          className='text-default-400 h-5 w-5 flex-shrink-0'
                        />
                      }
                    />
                  </motion.div>

                  {/* Document Type Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className='space-y-2'
                  >
                    <label className='text-foreground text-sm font-medium'>
                      {t('documents.upload.type.label')} <span className='text-danger'>*</span>
                    </label>
                    <Select
                      isRequired
                      selectedKeys={documentType ? [documentType] : []}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0];
                        if (selectedKey) {
                          handleTypeChange(selectedKey as string);
                        }
                      }}
                      placeholder={t('documents.upload.type.placeholder')}
                      variant='bordered'
                      classNames={{
                        trigger:
                          'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50',
                        value: 'text-foreground font-normal tracking-[0.02em]',
                        listbox: 'max-h-[200px]',
                        popoverContent: 'rounded-[16px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'
                      }}
                      startContent={
                        <Icon
                          icon='solar:document-linear'
                          className='text-default-400 h-5 w-5 flex-shrink-0'
                        />
                      }
                    >
                      {DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {t(`documents.upload.type.options.${type.toLowerCase()}`)}
                        </SelectItem>
                      ))}
                    </Select>
                  </motion.div>

                  {/* Document Status Selection */}
                  {documentType && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className='space-y-2'
                    >
                      <label className='text-foreground text-sm font-medium'>
                        {t('documents.upload.status.label')} <span className='text-danger'>*</span>
                      </label>
                      <Select
                        isRequired
                        selectedKeys={documentStatus ? [documentStatus] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0];
                          if (selectedKey) {
                            setDocumentStatus(selectedKey as string);
                          }
                        }}
                        placeholder={t('documents.upload.status.placeholder')}
                        variant='bordered'
                        classNames={{
                          trigger:
                            'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50',
                          value: 'text-foreground font-normal tracking-[0.02em]',
                          listbox: 'max-h-[200px]',
                          popoverContent: 'rounded-[16px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'
                        }}
                        startContent={
                          <Icon
                            icon='solar:flag-linear'
                            className='text-default-400 h-5 w-5 flex-shrink-0'
                          />
                        }
                      >
                        {availableStatuses && availableStatuses.length > 0
                          ? availableStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(
                                  `documents.upload.status.options.${status.toLowerCase().replace(' ', '_')}`
                                )}
                              </SelectItem>
                            ))
                          : null}
                      </Select>
                    </motion.div>
                  )}

                  {/* Tags Selection */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className='space-y-3'
                  >
                    <label className='text-foreground text-sm font-medium'>
                      {t('documents.upload.tags.label')}
                    </label>

                    {/* Selected Tags */}
                    <AnimatePresence>
                      {selectedTags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className='flex flex-wrap gap-2'
                        >
                          {selectedTags.map((tagKey) => {
                            const tag = AVAILABLE_TAGS.find((t) => t.key === tagKey);
                            return (
                              <motion.div
                                key={tagKey}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Chip
                                  color={tag?.color as any}
                                  variant='flat'
                                  onClose={() => handleTagRemove(tagKey)}
                                  className='transition-transform hover:scale-105'
                                >
                                  {tag?.label}
                                </Chip>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tag Search */}
                    <Autocomplete
                      inputValue={searchValue}
                      onInputChange={setSearchValue}
                      placeholder={t('documents.upload.tags.placeholder')}
                      variant='bordered'
                      classNames={{
                        base: 'w-full',
                        mainWrapper: 'w-full',
                        inputWrapper:
                          'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                        input:
                          'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base',
                        listbox: 'max-h-[200px]',
                        popoverContent: 'rounded-[16px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'
                      }}
                      startContent={
                        <Icon
                          icon='solar:hashtag-linear'
                          className='text-default-400 h-5 w-5 flex-shrink-0'
                        />
                      }
                      onSelectionChange={(key) => {
                        if (key) {
                          handleTagSelect(key as string);
                        }
                      }}
                    >
                      {filteredTags.map((tag) => (
                        <AutocompleteItem
                          key={tag.key}
                          value={tag.key}
                          startContent={<div className={`h-3 w-3 rounded-full bg-${tag.color}`} />}
                        >
                          {tag.label}
                        </AutocompleteItem>
                      ))}
                    </Autocomplete>
                  </motion.div>

                  <Divider className='bg-default-200' />

                  {/* File Upload Area */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className='space-y-3'
                  >
                    <label className='text-foreground text-sm font-medium'>
                      {t('documents.upload.file.label')} <span className='text-danger'>*</span>
                    </label>

                    <motion.div
                      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
                        isDragOver
                          ? 'border-primary bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                          : selectedFile
                            ? 'border-success bg-success-50 dark:bg-success-900/20'
                            : 'border-default-300 hover:border-default-400 hover:bg-default-50 dark:hover:bg-default-900/20'
                      }`}
                      onDragEnter={handleDragEnter}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      whileHover={{ scale: selectedFile ? 1 : 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <input
                        ref={fileInputRef}
                        type='file'
                        onChange={handleFileInputChange}
                        className='hidden'
                        accept='.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx'
                      />

                      {!selectedFile ? (
                        <div className='flex flex-col items-center justify-center p-8 text-center'>
                          <motion.div
                            className='from-primary/20 to-secondary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br'
                            animate={{
                              rotate: isDragOver ? 360 : 0,
                              scale: isDragOver ? 1.1 : 1
                            }}
                            transition={{ duration: 0.3 }}
                          >
                            <Icon
                              icon={
                                isDragOver ? 'solar:download-linear' : 'solar:cloud-upload-linear'
                              }
                              className='text-primary h-8 w-8'
                            />
                          </motion.div>

                          <h3 className='text-foreground mb-2 font-semibold'>
                            {isDragOver
                              ? t('documents.upload.file.dropTitle')
                              : t('documents.upload.file.uploadTitle')}
                          </h3>

                          <p className='text-default-500 mb-4 text-sm'>
                            {t('documents.upload.file.description')}
                          </p>

                          <Button
                            color='primary'
                            variant='flat'
                            onPress={() => fileInputRef.current?.click()}
                            startContent={
                              <Icon icon='solar:folder-open-linear' className='h-4 w-4' />
                            }
                            className='font-medium'
                          >
                            {t('documents.upload.file.chooseFile')}
                          </Button>

                          <p className='text-default-400 mt-3 text-xs'>
                            {t('documents.upload.file.supported')}
                          </p>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className='p-6'
                        >
                          <Card className='bg-success-50 dark:bg-success-900/20'>
                            <CardBody className='p-4'>
                              <div className='flex items-center gap-4'>
                                <div className='bg-success-100 dark:bg-success-900/30 flex h-12 w-12 items-center justify-center rounded-xl'>
                                  <Icon
                                    icon={getFileIcon(selectedFile)}
                                    className='text-success-600 dark:text-success-400 h-6 w-6'
                                  />
                                </div>

                                <div className='min-w-0 flex-1'>
                                  <p className='text-foreground truncate font-medium'>
                                    {selectedFile.name}
                                  </p>
                                  <p className='text-default-500 text-sm'>
                                    {formatFileSize(selectedFile.size)} •{' '}
                                    {selectedFile.type || t('documents.upload.file.unknownType')}
                                  </p>
                                </div>

                                <Button
                                  isIconOnly
                                  size='sm'
                                  variant='light'
                                  color='danger'
                                  onPress={() => setSelectedFile(null)}
                                >
                                  <Icon
                                    icon='solar:trash-bin-minimalistic-linear'
                                    className='h-4 w-4'
                                  />
                                </Button>
                              </div>
                            </CardBody>
                          </Card>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>

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

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className='pt-4'
                  >
                    <Button
                      type='submit'
                      color='primary'
                      size='lg'
                      fullWidth
                      isDisabled={!isFormValid}
                      isLoading={isUploading}
                      startContent={
                        !isUploading ? (
                          <Icon icon='solar:upload-linear' className='h-4 w-4' />
                        ) : undefined
                      }
                      className='h-14 rounded-[16px] text-lg font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                    >
                      {isUploading
                        ? t('documents.upload.buttons.uploading')
                        : t('documents.upload.buttons.upload')}
                    </Button>
                  </motion.div>
                </Form>
              )}
            </ModalBody>

            <ModalFooter className='justify-center pt-4 pb-8'>
              {!success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <Button
                    variant='bordered'
                    onPress={handleClose}
                    disabled={isUploading}
                    className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                  >
                    {t('documents.upload.buttons.cancel')}
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
