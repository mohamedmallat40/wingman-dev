'use client';

import React from 'react';
import { motion } from 'framer-motion';

import { MediaUpload } from '@/components/ui/file-upload/MediaUpload';
import type { MediaTabProps } from './types';

export const MediaTab: React.FC<MediaTabProps> = ({
  mediaFiles,
  setMediaFiles,
  isUploading
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 py-4"
    >
      {/* Media Upload Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <MediaUpload
          files={mediaFiles}
          onFilesChange={(files) => {
            if (typeof files === 'function') {
              setMediaFiles(files);
            } else {
              setMediaFiles(files);
            }
          }}
          maxFiles={10}
          maxFileSize={100 * 1024 * 1024}
          acceptedTypes={[
            'image/*',
            'video/*',
            '.jpg',
            '.jpeg',
            '.png',
            '.gif',
            '.mp4',
            '.mov',
            '.avi'
          ]}
          isUploading={isUploading}
        />
      </motion.div>
    </motion.div>
  );
};