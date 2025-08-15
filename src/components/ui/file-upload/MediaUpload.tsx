'use client';

import React, { useCallback, useRef, useState, useEffect, useId } from 'react';

import { Button, Card, CardBody, Progress, Input, Badge, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';
import { env } from '@/env';

// Inline utility functions
const validateFile = (
  file: File,
  type?: 'image' | 'video'
): { isValid: boolean; error?: string } => {
  const maxSize = type === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File ${file.name} is too large. Maximum size is ${type === 'video' ? '100MB' : '10MB'}`
    };
  }

  if (type) {
    const validTypes =
      type === 'video'
        ? ['video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime']
        : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (!validTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Invalid file type for ${file.name}. Please select a valid ${type} file.`
      };
    }
  }

  return { isValid: true };
};

const uploadFilesSequentially = async (
  files: File[],
  onProgress?: (fileId: string, progress: number) => void,
  onComplete?: (fileId: string, result: any) => void,
  onError?: (fileId: string, error: string) => void
): Promise<any[]> => {
  const results: any[] = [];

  for (const file of files) {
    const fileId = `${Date.now()}-${Math.random()}`;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await wingManApi.post(API_ROUTES.upload.public, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(fileId, progress);
          }
        }
      });

      const result = {
        ...response.data,
        id: fileId
      };

      results.push(result);

      if (onComplete) {
        onComplete(fileId, result);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';

      if (onError) {
        onError(fileId, errorMessage);
      }

      throw new Error(`Failed to upload ${file.name}: ${errorMessage}`);
    }
  }

  return results;
};

// Enhanced MediaFile interface
export interface MediaFile {
  file: File;
  preview: string;
  id: string;
  type: 'image' | 'video';
  caption?: string;
  altText?: string;
  uploadProgress?: number;
  uploaded?: boolean;
  url?: string;
  filename?: string; // Store the actual filename from upload response
  error?: string;
}

export interface MediaUploadProps {
  files: MediaFile[];
  onFilesChange: (files: MediaFile[] | ((prev: MediaFile[]) => MediaFile[])) => void;
  maxFiles?: number;
  maxFileSize?: number;
  acceptedTypes?: string[];
  isUploading?: boolean;
  className?: string;
}

// Get file type from file
const getFileType = (file: File): 'image' | 'video' => {
  return file.type.startsWith('video/') ? 'video' : 'image';
};

// Note: Smart media grid moved to preview section only

// Get file icon based on type
const getFileIcon = (file: File): string => {
  const type = file.type.toLowerCase();
  if (type.includes('video')) return 'solar:videocamera-record-bold';
  if (type.includes('image')) return 'solar:gallery-bold';
  return 'solar:file-bold';
};

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const MediaUpload: React.FC<MediaUploadProps> = ({
  files,
  onFilesChange,
  maxFiles = 10,
  maxFileSize = 100 * 1024 * 1024, // 100MB
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/mov', 'video/avi', 'video/quicktime'],
  isUploading = false,
  className = ''
}) => {
  const t = useTranslations();
  const componentId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{[key: string]: number}>({}); // Track progress per file
  const [currentUploadingFile, setCurrentUploadingFile] = useState<string | null>(null);
  const [totalFiles, setTotalFiles] = useState(0);
  const [completedFiles, setCompletedFiles] = useState(0);
  const fileIdCounter = useRef(0);

  // Client-side effect to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate stable ID for files
  const generateFileId = useCallback(() => {
    fileIdCounter.current += 1;
    return `${componentId}-file-${fileIdCounter.current}`;
  }, [componentId]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      handleFilesSelected(droppedFiles);
    }
  }, [files]);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const remainingSlots = maxFiles - files.length;
    const filesToProcess = selectedFiles.slice(0, remainingSlots);
    
    if (selectedFiles.length > remainingSlots) {
      // Show warning about max files
      console.warn(`Can only add ${remainingSlots} more files. Maximum ${maxFiles} files allowed.`);
    }

    const newFiles: MediaFile[] = [];
    
    filesToProcess.forEach((file) => {
      const fileType = getFileType(file);
      
      // Validate file
      const validation = validateFile(file, fileType);
      if (!validation.isValid) {
        console.error(validation.error);
        return;
      }

      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        id: generateFileId(),
        type: fileType,
        uploadProgress: 0,
        uploaded: false
      };

      newFiles.push(mediaFile);
    });

    if (newFiles.length > 0) {
      const updatedFiles = [...files, ...newFiles];
      onFilesChange(updatedFiles);
      
      // Start uploading files one by one
      setTotalFiles(newFiles.length);
      setCompletedFiles(0);
      
      try {
        // Upload files one by one and track them by index
        for (let i = 0; i < newFiles.length; i++) {
          const file = newFiles[i];
          const fileId = file.id;
          
          setCurrentUploadingFile(file.file.name);
          
          try {
            const result = await uploadFilesSequentially(
              [file.file],
              (uploadFileId, progress) => {
                // Update progress for current file
                setUploadingFiles(prev => ({ ...prev, [fileId]: progress }));
                onFilesChange((prev: MediaFile[]) => prev.map(mediaFile => {
                  if (mediaFile.id === fileId) {
                    return { ...mediaFile, uploadProgress: progress };
                  }
                  return mediaFile;
                }));
              },
              (uploadFileId, uploadResult) => {
                // Mark as uploaded with S3 URL and store fileName
                setCompletedFiles(prev => prev + 1);
                setUploadingFiles(prev => {
                  const updated = { ...prev };
                  delete updated[fileId];
                  return updated;
                });
                
                onFilesChange((prev: MediaFile[]) => prev.map(mediaFile => {
                  if (mediaFile.id === fileId) {
                    const s3Url = `${env.NEXT_PUBLIC_S3_BASE_URL}/${uploadResult.fileName}`;
                    return {
                      ...mediaFile,
                      uploaded: true,
                      url: s3Url,
                      filename: uploadResult.fileName, // Store the actual fileName from server response
                      uploadProgress: 100
                    };
                  }
                  return mediaFile;
                }));
              },
              (uploadFileId, error) => {
                // Handle error for this specific file
                setUploadingFiles(prev => {
                  const updated = { ...prev };
                  delete updated[fileId];
                  return updated;
                });
                
                onFilesChange((prev: MediaFile[]) => prev.map(mediaFile => {
                  if (mediaFile.id === fileId) {
                    return { ...mediaFile, error };
                  }
                  return mediaFile;
                }));
              }
            );
          } catch (error) {
            console.error(`Upload failed for file ${file.file.name}:`, error);
            // Error already handled in the error callback above
          }
        }
        
        // Reset upload state when done
        setCurrentUploadingFile(null);
        setTotalFiles(0);
        setCompletedFiles(0);
      } catch (error) {
        console.error('Upload failed:', error);
        setCurrentUploadingFile(null);
        setTotalFiles(0);
        setCompletedFiles(0);
      }
    }
  }, [files, maxFiles, onFilesChange, generateFileId]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      handleFilesSelected(selectedFiles);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [handleFilesSelected]);

  const removeFile = useCallback((id: string) => {
    const fileToRemove = files.find(f => f.id === id);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    onFilesChange(files.filter(f => f.id !== id));
  }, [files, onFilesChange]);

  const acceptString = acceptedTypes.join(',');
  const isCurrentlyUploading = currentUploadingFile !== null || Object.keys(uploadingFiles).length > 0;
  const canAddMore = files.length < maxFiles && !isCurrentlyUploading;

  // Prevent hydration mismatch by only rendering interactive content client-side
  if (!isClient) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="relative rounded-xl border-2 border-dashed border-default-300 p-8">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="from-primary/20 to-secondary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br">
              <Icon icon="solar:cloud-upload-linear" className="text-primary h-8 w-8" />
            </div>
            <h3 className="text-foreground mb-2 font-semibold">Upload Images & Videos</h3>
            <p className="text-default-500 mb-4 text-sm">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      {canAddMore && (
        <motion.div
          className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
            isCurrentlyUploading 
              ? 'border-default-200 bg-default-50 dark:bg-default-900/10 opacity-50 cursor-not-allowed'
              : isDragOver
                ? 'border-primary bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
                : 'border-default-300 hover:border-default-400 hover:bg-default-50 dark:hover:bg-default-900/20'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            accept={acceptString}
            multiple
          />

          <div className="flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              className="from-primary/20 to-secondary/20 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br"
              animate={{
                rotate: isDragOver ? 360 : 0,
                scale: isDragOver ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <Icon
                icon={isDragOver ? 'solar:download-linear' : 'solar:cloud-upload-linear'}
                className="text-primary h-8 w-8"
              />
            </motion.div>

            <h3 className="text-foreground mb-2 font-semibold">
              {isDragOver ? 'Drop your media here' : 'Upload Images & Videos'}
            </h3>

            <p className="text-default-500 mb-4 text-sm">
              Drag and drop or click to browse • {maxFiles - files.length} slots remaining
            </p>

            <div className="flex justify-center items-center gap-8 mb-6">
              <div className="flex flex-col items-center gap-2">
                <Icon icon="solar:camera-outline" className="h-6 w-6 text-primary" />
                <span className="text-xs font-medium text-default-600">Images</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <Icon icon="solar:videocamera-outline" className="h-6 w-6 text-secondary" />
                <span className="text-xs font-medium text-default-600">Videos</span>
              </div>
            </div>

            <Button
              color="primary"
              variant="flat"
              onPress={() => fileInputRef.current?.click()}
              startContent={<Icon icon="solar:folder-open-linear" className="h-4 w-4" />}
              className="font-medium"
              isDisabled={isUploading || isCurrentlyUploading}
            >
              {isCurrentlyUploading ? 'Uploading...' : 'Choose Media Files'}
            </Button>

            <p className="text-default-400 mt-3 text-xs">
              Max file size: {formatFileSize(maxFileSize)} • JPG, PNG, GIF, MP4, MOV, AVI
            </p>
          </div>
        </motion.div>
      )}

      {/* File Count Badge & Upload Progress */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge content={files.length} color="primary" size="sm">
                <span></span>
              </Badge>
              <span className="text-sm text-foreground-600">
                {files.length} file{files.length !== 1 ? 's' : ''} selected
              </span>
            </div>
            {files.length >= maxFiles && (
              <Chip size="sm" color="warning" variant="flat">
                Maximum reached
              </Chip>
            )}
          </div>
          
          {/* Premium Upload Progress UI */}
          {(currentUploadingFile || Object.keys(uploadingFiles).length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-950/20 dark:to-secondary-950/20 p-6 shadow-lg border border-primary-200/30 dark:border-primary-800/30"
            >
              {/* Animated background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-transparent to-secondary-500/20 animate-pulse" />
                <div className="absolute top-0 left-0 w-32 h-32 bg-primary-400/10 rounded-full blur-3xl animate-float" />
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-secondary-400/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
              </div>
              
              <div className="relative space-y-4">
                {/* Header with animated icon */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="animate-spin rounded-full h-8 w-8 border-3 border-primary-200 border-t-primary-500 dark:border-primary-800 dark:border-t-primary-400" />
                      <div className="absolute inset-0 rounded-full bg-primary-500/20 animate-ping" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                        Uploading Media
                      </h4>
                      <p className="text-xs text-primary-600/70 dark:text-primary-400/70">
                        Processing {totalFiles} file{totalFiles !== 1 ? 's' : ''} sequentially
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-700 dark:text-primary-300">
                      {completedFiles}/{totalFiles}
                    </div>
                    <div className="text-xs text-primary-600/70 dark:text-primary-400/70">
                      completed
                    </div>
                  </div>
                </div>
                
                {/* Overall Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-default-700 dark:text-default-300">
                      Overall Progress
                    </span>
                    <span className="text-xs font-mono text-default-600 dark:text-default-400">
                      {Math.round((completedFiles / totalFiles) * 100)}%
                    </span>
                  </div>
                  <div className="relative">
                    <div className="h-2 bg-default-200 dark:bg-default-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(completedFiles / totalFiles) * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary-500 via-primary-400 to-secondary-500 rounded-full relative"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                      </motion.div>
                    </div>
                  </div>
                </div>
                
                {/* Current File Progress */}
                {currentUploadingFile && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-3 p-4 bg-white/50 dark:bg-black/20 rounded-xl border border-white/60 dark:border-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:cloud-upload-bold" className="h-4 w-4 text-primary-500 animate-bounce" />
                        <span className="text-xs font-medium text-default-700 dark:text-default-300">
                          Current File
                        </span>
                      </div>
                      <span className="text-xs font-mono text-primary-600 dark:text-primary-400 font-bold">
                        {Object.values(uploadingFiles)[0] || 0}%
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-xs text-default-600 dark:text-default-400 truncate font-medium">
                        📁 {currentUploadingFile}
                      </div>
                      <div className="relative">
                        <div className="h-1.5 bg-default-200 dark:bg-default-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Object.values(uploadingFiles)[0] || 0}%` }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full relative"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      )}

    </div>
  );
};

export default MediaUpload;