'use client';

import React, { useCallback, useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

import {
  Card,
  CardBody,
  Button,
  Progress,
  Image,
  Input,
  Textarea,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Chip,
  Badge
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  caption?: string;
  altText?: string;
  uploadProgress?: number;
  uploaded?: boolean;
  url?: string;
  error?: string;
  size: number;
  duration?: number; // for videos
  dimensions?: { width: number; height: number };
}

interface MediaUploadZoneProps {
  files: MediaFile[];
  onFilesChange: (files: MediaFile[]) => void;
  onUpload: (files: File[], type: 'image' | 'video') => Promise<void>;
  maxFiles?: number;
  maxFileSize?: number; // in bytes
  acceptedTypes?: string[];
  allowedTypes?: ('image' | 'video')[];
  isUploading?: boolean;
  className?: string;
}

const MediaUploadZone: React.FC<MediaUploadZoneProps> = ({
  files,
  onFilesChange,
  onUpload,
  maxFiles = 10,
  maxFileSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/*', 'video/*'],
  allowedTypes = ['image', 'video'],
  isUploading = false,
  className = ''
}) => {
  const t = useTranslations('broadcasts.create.media');
  const tValidation = useTranslations('broadcasts.validation');
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Format file size for display
  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }, []);

  // Get file type from File object
  const getFileType = useCallback((file: File): 'image' | 'video' => {
    return file.type.startsWith('video/') ? 'video' : 'image';
  }, []);

  // Validate file
  const validateFile = useCallback((file: File): string | null => {
    const type = getFileType(file);
    
    // Check file size
    const maxSize = type === 'video' ? 100 * 1024 * 1024 : maxFileSize; // 100MB for video
    if (file.size > maxSize) {
      return tValidation('fileTooLarge', { 
        filename: file.name, 
        maxSize: formatFileSize(maxSize) 
      });
    }

    // Check file type
    const validTypes = type === 'video' 
      ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (!validTypes.includes(file.type)) {
      return tValidation('invalidFileType', { filename: file.name, type });
    }

    return null;
  }, [getFileType, maxFileSize, formatFileSize, tValidation]);

  // Process selected files
  const processFiles = useCallback(async (fileList: FileList) => {
    const newFiles: MediaFile[] = [];
    const newErrors: string[] = [];

    // Check total file count
    if (files.length + fileList.length > maxFiles) {
      newErrors.push(tValidation('maxFilesExceeded', { maxFiles }));
      setErrors(newErrors);
      return;
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        newErrors.push(validationError);
        continue;
      }

      // Check for duplicates
      const isDuplicate = files.some(existingFile => 
        existingFile.file.name === file.name && 
        existingFile.file.size === file.size
      );
      
      if (isDuplicate) {
        newErrors.push(`File "${file.name}" is already added`);
        continue;
      }

      // Create preview URL
      const preview = URL.createObjectURL(file);
      const type = getFileType(file);

      // Get dimensions for images
      let dimensions: { width: number; height: number } | undefined;
      if (type === 'image') {
        try {
          dimensions = await getImageDimensions(file);
        } catch (error) {
          console.warn('Failed to get image dimensions:', error);
        }
      }

      const mediaFile: MediaFile = {
        id: `${Date.now()}-${i}-${Math.random()}`,
        file,
        preview,
        type,
        size: file.size,
        uploadProgress: 0,
        uploaded: false,
        dimensions
      };

      newFiles.push(mediaFile);
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
    } else {
      setErrors([]);
    }

    // Add new files to existing ones
    const updatedFiles = [...files, ...newFiles];
    onFilesChange(updatedFiles);

    // Start upload process if files are valid
    if (newFiles.length > 0) {
      try {
        const filesToUpload = newFiles.map(mf => mf.file);
        const type = newFiles[0].type; // Assume all files are same type for this upload
        await onUpload(filesToUpload, type);
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  }, [files, maxFiles, validateFile, getFileType, onFilesChange, onUpload, tValidation]);

  // Get image dimensions
  const getImageDimensions = useCallback((file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ''; // Reset input
    }
  }, [processFiles]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      processFiles(droppedFiles);
    }
  }, [processFiles]);

  // Remove file
  const removeFile = useCallback((id: string) => {
    const updatedFiles = files.filter(file => {
      if (file.id === id) {
        URL.revokeObjectURL(file.preview);
        return false;
      }
      return true;
    });
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  // Update file caption
  const updateFileCaption = useCallback((id: string, caption: string) => {
    const updatedFiles = files.map(file =>
      file.id === id ? { ...file, caption } : file
    );
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  // Update file alt text
  const updateFileAltText = useCallback((id: string, altText: string) => {
    const updatedFiles = files.map(file =>
      file.id === id ? { ...file, altText } : file
    );
    onFilesChange(updatedFiles);
  }, [files, onFilesChange]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Controls */}
      <div className="flex flex-wrap gap-3">
        {allowedTypes.includes('image') && (
          <Button
            variant="flat"
            color="primary"
            onPress={() => fileInputRef.current?.click()}
            isDisabled={isUploading || files.length >= maxFiles}
            startContent={<Icon icon="solar:camera-linear" className="h-4 w-4" />}
          >
            {t('addImages')}
          </Button>
        )}
        
        {allowedTypes.includes('video') && (
          <Button
            variant="flat"
            color="secondary"
            onPress={() => videoInputRef.current?.click()}
            isDisabled={isUploading || files.length >= maxFiles}
            startContent={<Icon icon="solar:videocamera-linear" className="h-4 w-4" />}
          >
            {t('addVideo')}
          </Button>
        )}

        <div className="text-sm text-foreground-500">
          {files.length}/{maxFiles} files
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      {/* Drop Zone */}
      <Card
        className={`transition-all duration-200 ${
          isDragOver 
            ? 'border-2 border-primary border-dashed bg-primary/5' 
            : 'border-2 border-dashed border-default-300 hover:border-default-400'
        }`}
      >
        <CardBody
          className="p-8 text-center"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
              isDragOver ? 'bg-primary/20' : 'bg-default-100'
            }`}>
              <Icon 
                icon={isDragOver ? "solar:download-linear" : "solar:cloud-upload-linear"} 
                className={`h-8 w-8 ${isDragOver ? 'text-primary' : 'text-foreground-500'}`} 
              />
            </div>
            
            <div>
              <h3 className="font-semibold text-lg">
                {isDragOver ? 'Drop files here' : 'Drag & drop files here'}
              </h3>
              <p className="text-foreground-500 text-sm">
                or click the buttons above to browse
              </p>
            </div>

            <div className="text-xs text-foreground-400">
              <p>{t('supportedFormats', { formats: acceptedTypes.join(', ') })}</p>
              <p>{t('maxSizeImage')} • {t('maxSizeVideo')}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Error Messages */}
      <AnimatePresence>
        {errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="border border-danger-200 bg-danger-50">
              <CardBody className="p-3">
                <div className="flex items-start gap-2">
                  <Icon icon="solar:warning-circle-linear" className="h-5 w-5 text-danger-500 mt-0.5" />
                  <div className="space-y-1">
                    {errors.map((error, index) => (
                      <p key={index} className="text-sm text-danger-600">
                        {error}
                      </p>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Grid */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Card>
                  <CardBody className="p-3">
                    {/* Media Preview */}
                    <div className="relative mb-3 group">
                      {file.type === 'image' ? (
                        <Image
                          src={file.preview}
                          alt={file.altText || 'Preview'}
                          className="h-32 w-full object-cover"
                          radius="sm"
                        />
                      ) : (
                        <div className="relative h-32 w-full">
                          <video
                            src={file.preview}
                            className="h-full w-full object-cover rounded-sm"
                            controls={false}
                            muted
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-sm">
                            <Icon icon="solar:play-linear" className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      )}
                      
                      {/* File Actions */}
                      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dropdown>
                          <DropdownTrigger>
                            <Button
                              isIconOnly
                              size="sm"
                              color="default"
                              variant="solid"
                              className="bg-white/90 backdrop-blur-sm"
                            >
                              <Icon icon="solar:menu-dots-linear" className="h-3 w-3" />
                            </Button>
                          </DropdownTrigger>
                          <DropdownMenu>
                            <DropdownItem
                              key="view"
                              startContent={<Icon icon="solar:eye-linear" className="h-4 w-4" />}
                            >
                              View Full Size
                            </DropdownItem>
                            <DropdownItem
                              key="download"
                              startContent={<Icon icon="solar:download-linear" className="h-4 w-4" />}
                            >
                              Download
                            </DropdownItem>
                            <DropdownItem
                              key="delete"
                              color="danger"
                              startContent={<Icon icon="solar:trash-bin-minimalistic-linear" className="h-4 w-4" />}
                              onPress={() => removeFile(file.id)}
                            >
                              Remove
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>

                      {/* Upload Progress */}
                      {file.uploadProgress !== undefined && file.uploadProgress < 100 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-sm">
                          <div className="w-3/4 space-y-2">
                            <Progress
                              value={file.uploadProgress}
                              color="primary"
                              size="sm"
                            />
                            <p className="text-white text-xs text-center">
                              {t('uploading')} {file.uploadProgress}%
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Upload Status */}
                      {file.uploaded && (
                        <Badge
                          color="success"
                          content={<Icon icon="solar:check-circle-linear" className="h-3 w-3" />}
                          className="absolute top-2 left-2"
                        />
                      )}

                      {file.error && (
                        <Badge
                          color="danger"
                          content={<Icon icon="solar:close-circle-linear" className="h-3 w-3" />}
                          className="absolute top-2 left-2"
                        />
                      )}
                    </div>

                    {/* File Info */}
                    <div className="space-y-2 text-xs text-foreground-500">
                      <div className="flex items-center justify-between">
                        <span className="truncate" title={file.file.name}>
                          {file.file.name}
                        </span>
                        <Chip size="sm" variant="flat">
                          {file.type}
                        </Chip>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>{formatFileSize(file.size)}</span>
                        {file.dimensions && (
                          <span>{file.dimensions.width}×{file.dimensions.height}</span>
                        )}
                      </div>
                    </div>

                    {/* Caption Input */}
                    <Input
                      size="sm"
                      placeholder={t('addCaption')}
                      value={file.caption || ''}
                      onValueChange={(value) => updateFileCaption(file.id, value)}
                      className="mt-2"
                    />
                    
                    {/* Alt Text Input (for accessibility) */}
                    {file.type === 'image' && (
                      <Input
                        size="sm"
                        placeholder={t('addAltText')}
                        value={file.altText || ''}
                        onValueChange={(value) => updateFileAltText(file.id, value)}
                        className="mt-2"
                        description="For screen readers and accessibility"
                      />
                    )}

                    {/* Error Message */}
                    {file.error && (
                      <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded text-xs text-danger-600">
                        {file.error}
                      </div>
                    )}
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MediaUploadZone;
