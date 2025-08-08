'use client';

import React, { useState, useRef, useCallback } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Autocomplete,
  AutocompleteItem,
  Chip,
  Card,
  CardBody,
  Progress,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (data: {
    name: string;
    tags: string[];
    file: File;
  }) => Promise<void>;
}

// Mock available tags - in real app this would come from API
const AVAILABLE_TAGS = [
  { key: 'contract', label: 'Contract', color: 'primary' },
  { key: 'proposal', label: 'Proposal', color: 'secondary' },
  { key: 'invoice', label: 'Invoice', color: 'success' },
  { key: 'financial', label: 'Financial', color: 'warning' },
  { key: 'legal', label: 'Legal', color: 'danger' },
  { key: 'marketing', label: 'Marketing', color: 'primary' },
  { key: 'hr', label: 'Human Resources', color: 'secondary' },
  { key: 'technical', label: 'Technical', color: 'success' },
  { key: 'design', label: 'Design', color: 'warning' },
  { key: 'project', label: 'Project', color: 'danger' },
  { key: 'client', label: 'Client', color: 'primary' },
  { key: 'internal', label: 'Internal', color: 'secondary' },
  { key: 'urgent', label: 'Urgent', color: 'danger' },
  { key: 'draft', label: 'Draft', color: 'default' },
  { key: 'final', label: 'Final', color: 'success' }
];

const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload
}) => {
  const t = useTranslations('documents');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [documentName, setDocumentName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchValue, setSearchValue] = useState('');

  // Filter available tags based on search and exclude already selected
  const filteredTags = AVAILABLE_TAGS.filter(tag => 
    !selectedTags.includes(tag.key) &&
    tag.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Reset form when modal closes
  const handleClose = useCallback(() => {
    if (!isUploading) {
      setDocumentName('');
      setSelectedTags([]);
      setSelectedFile(null);
      setSearchValue('');
      setUploadProgress(0);
      onClose();
    }
  }, [isUploading, onClose]);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    // Auto-populate document name from filename if not set
    if (!documentName) {
      const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
      setDocumentName(nameWithoutExt);
    }
  }, [documentName]);

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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // File input change handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Tag selection handlers
  const handleTagSelect = useCallback((tagKey: string) => {
    if (!selectedTags.includes(tagKey)) {
      setSelectedTags(prev => [...prev, tagKey]);
    }
    setSearchValue('');
  }, [selectedTags]);

  const handleTagRemove = useCallback((tagKey: string) => {
    setSelectedTags(prev => prev.filter(key => key !== tagKey));
  }, []);

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
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
    if (type.includes('presentation') || type.includes('powerpoint')) return 'solar:presentation-graph-bold';
    return 'solar:file-bold';
  };

  // Handle form submission
  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !documentName.trim()) return;

    setIsUploading(true);
    
    try {
      // Simulate upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onUpload?.({
        name: documentName.trim(),
        tags: selectedTags,
        file: selectedFile
      });

      handleClose();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [selectedFile, documentName, selectedTags, onUpload, handleClose]);

  const isFormValid = documentName.trim() && selectedFile;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="2xl"
      scrollBehavior="inside"
      backdrop="opaque"
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut"
            }
          },
          exit: {
            y: -20,
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: 0.2,
              ease: "easeIn"
            }
          }
        }
      }}
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 ring-1 ring-primary/30"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon icon="solar:upload-linear" className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Upload Document
                  </h2>
                  <p className="text-sm text-default-500">
                    Add a new document to your collection
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="gap-6 py-6">
              {/* Document Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Document Name <span className="text-danger">*</span>
                </label>
                <Input
                  value={documentName}
                  onValueChange={setDocumentName}
                  placeholder="Enter document name..."
                  variant="bordered"
                  classNames={{
                    base: 'w-full',
                    mainWrapper: 'w-full',
                    inputWrapper:
                      'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                    input:
                      'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                  }}
                  startContent={
                    <Icon icon="solar:document-text-linear" className="h-5 w-5 flex-shrink-0 text-default-400" />
                  }
                />
              </div>

              {/* Tags Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Tags
                </label>
                
                {/* Selected Tags */}
                <AnimatePresence>
                  {selectedTags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {selectedTags.map(tagKey => {
                        const tag = AVAILABLE_TAGS.find(t => t.key === tagKey);
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
                              variant="flat"
                              onClose={() => handleTagRemove(tagKey)}
                              className="transition-transform hover:scale-105"
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
                  placeholder="Search and select tags..."
                  variant="bordered"
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
                    <Icon icon="solar:hashtag-linear" className="h-5 w-5 flex-shrink-0 text-default-400" />
                  }
                  onSelectionChange={(key) => {
                    if (key) {
                      handleTagSelect(key as string);
                    }
                  }}
                >
                  {filteredTags.map(tag => (
                    <AutocompleteItem
                      key={tag.key}
                      value={tag.key}
                      startContent={
                        <div className={`w-3 h-3 rounded-full bg-${tag.color}`} />
                      }
                    >
                      {tag.label}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
              </div>

              <Divider className="bg-default-200" />

              {/* File Upload Area */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  File <span className="text-danger">*</span>
                </label>

                <motion.div
                  className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
                    isDragOver
                      ? 'border-primary bg-primary-50 scale-[1.02]'
                      : selectedFile
                        ? 'border-success bg-success-50'
                        : 'border-default-300 hover:border-default-400 hover:bg-default-50'
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
                    type="file"
                    onChange={handleFileInputChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx"
                  />

                  {!selectedFile ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                      <motion.div
                        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20"
                        animate={{ 
                          rotate: isDragOver ? 360 : 0,
                          scale: isDragOver ? 1.1 : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon 
                          icon={isDragOver ? "solar:download-linear" : "solar:cloud-upload-linear"} 
                          className="h-8 w-8 text-primary" 
                        />
                      </motion.div>
                      
                      <h3 className="mb-2 font-semibold text-foreground">
                        {isDragOver ? 'Drop your file here' : 'Upload your document'}
                      </h3>
                      
                      <p className="mb-4 text-sm text-default-500">
                        Drag and drop your file or click to browse
                      </p>
                      
                      <Button
                        color="primary"
                        variant="flat"
                        onPress={() => fileInputRef.current?.click()}
                        startContent={<Icon icon="solar:folder-open-linear" className="h-4 w-4" />}
                      >
                        Choose File
                      </Button>
                      
                      <p className="mt-3 text-xs text-default-400">
                        Supported: PDF, DOC, DOCX, TXT, JPG, PNG, XLS, PPT (Max 10MB)
                      </p>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6"
                    >
                      <Card className="bg-success-50">
                        <CardBody className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success-100">
                              <Icon 
                                icon={getFileIcon(selectedFile)} 
                                className="h-6 w-6 text-success-600" 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {selectedFile.name}
                              </p>
                              <p className="text-sm text-default-500">
                                {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                              </p>
                            </div>
                            
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => setSelectedFile(null)}
                            >
                              <Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Upload Progress */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">Uploading...</span>
                      <span className="text-default-500">{uploadProgress}%</span>
                    </div>
                    <Progress 
                      value={uploadProgress} 
                      color="primary"
                      className="w-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={handleClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={!isFormValid}
                isLoading={isUploading}
                loadingText="Uploading..."
                startContent={!isUploading ? <Icon icon="solar:upload-linear" className="h-4 w-4" /> : undefined}
                className="min-w-[120px]"
              >
                {isUploading ? 'Uploading...' : 'Upload Document'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DocumentUploadModal;