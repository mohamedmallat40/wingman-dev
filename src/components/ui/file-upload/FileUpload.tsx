'use client';

import React, { useCallback, useRef } from 'react';

import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export interface FileUploadProps {
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  isDragOver: boolean;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  className?: string;
}

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

// Format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const FileUpload: React.FC<FileUploadProps> = ({
  selectedFile,
  onFileSelect,
  onFileRemove,
  isDragOver,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  acceptedFileTypes = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.xls,.ppt,.pptx',
  maxFileSize = 10 * 1024 * 1024, // 10MB
  className = ''
}) => {
  const t = useTranslations();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  return (
    <motion.div
      className={`relative rounded-xl border-2 border-dashed transition-all duration-300 ${
        isDragOver
          ? 'border-primary bg-primary-50 dark:bg-primary-900/20 scale-[1.02]'
          : selectedFile
            ? 'border-success bg-success-50 dark:bg-success-900/20'
            : 'border-default-300 hover:border-default-400 hover:bg-default-50 dark:hover:bg-default-900/20'
      } ${className}`}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      whileHover={{ scale: selectedFile ? 1 : 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <input
        ref={fileInputRef}
        type='file'
        onChange={handleFileInputChange}
        className='hidden'
        accept={acceptedFileTypes}
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
              icon={isDragOver ? 'solar:download-linear' : 'solar:cloud-upload-linear'}
              className='text-primary h-8 w-8'
            />
          </motion.div>

          <h3 className='text-foreground mb-2 font-semibold'>
            {isDragOver ? 'Drop your file here' : 'Upload your file'}
          </h3>

          <p className='text-default-500 mb-4 text-sm'>Drag and drop or click to browse</p>

          <Button
            color='primary'
            variant='flat'
            onPress={() => fileInputRef.current?.click()}
            startContent={<Icon icon='solar:folder-open-linear' className='h-4 w-4' />}
            className='font-medium'
          >
            Choose File
          </Button>

          <p className='text-default-400 mt-3 text-xs'>
            Max file size: {formatFileSize(maxFileSize)}
          </p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='p-6'>
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
                  <p className='text-foreground truncate font-medium'>{selectedFile.name}</p>
                  <p className='text-default-500 text-sm'>
                    {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}
                  </p>
                </div>

                <Button isIconOnly size='sm' variant='light' color='danger' onPress={onFileRemove}>
                  <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default FileUpload;
