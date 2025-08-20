'use client';

import React, { use, useCallback, useEffect, useState } from 'react';

import { useUpload } from '@root/modules/documents/hooks/useUpload';
import { ArrowLeft, ArrowRight, Camera, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import wingManApi from '@/lib/axios';

export interface UploadResponse {
  readonly fileName: string;
  readonly originalname: string;
  readonly buffer: string;
}

interface ProfileImageStepProperties {
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userData: IUserProfile | null;
}

export default function ProfileImageStep({
  onNext,
  onPrevious,
  isLoading,
  setIsLoading,
  userData
}: Readonly<ProfileImageStepProperties>) {
  const t = useTranslations('setup.profileImage');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const upload = useUpload();
  useEffect(() => {
    if (userData?.profileImage) {
      setPreviewUrl(
        `https://eu2.contabostorage.com/a694c4e82ef342c1a1413e1459bf9cdb:wingman/public/${userData?.profileImage}`
      );
    }
  }, []);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError(t('validation.imageTypeRequired'));
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError(t('validation.fileSizeTooLarge'));
        return;
      }

      setUploadError('');
      setSelectedFile(file);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [t]
  );

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    } else if (event.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);

      if (event.dataTransfer.files?.[0]) {
        handleFileSelect(event.dataTransfer.files[0]);
      }
    },
    [handleFileSelect]
  );

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      handleFileSelect(event.target.files[0]);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadError('');
  };

  const uploadImage = async (): Promise<string> => {
    if (!selectedFile) throw new Error('No file selected');

    const uploadResponse = (await upload.uploadPublicFile(selectedFile)) as UploadResponse;
    return uploadResponse.fileName;
  };

  const updateProfileImage = async (profileImage: string) => {
    const response = await wingManApi.patch('/users/me', {
      profileImage
    });

    if (!response.data) {
      throw new Error('Failed to update profile');
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      // Skip this step if no image is selected
      onNext();
      return;
    }

    setIsLoading(true);
    try {
      // Upload image and get filename
      const profileImage = await uploadImage();
      // Update user profile with filename
      await updateProfileImage(profileImage);

      onNext();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      setUploadError(t('uploadError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-card/50 border-border rounded-2xl border p-6 shadow-xl backdrop-blur-sm sm:p-8 lg:p-10'>
      {/* Enhanced header with better typography and spacing */}
      <div className='mb-8 text-center'>
        <div className='bg-primary/10 mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl'>
          <Camera className='text-primary h-8 w-8' />
        </div>
        <h2 className='text-foreground mb-3 text-2xl font-bold sm:text-3xl'>{t('title')}</h2>
        <p className='text-muted-foreground mx-auto max-w-md text-base sm:text-lg'>
          {t('description')}
        </p>
      </div>

      <div className='space-y-8'>
        {/* Enhanced upload area with better visual hierarchy */}
        <div className='flex flex-col items-center'>
          {previewUrl ? (
            /* Enhanced Preview */
            <div className='group relative'>
              <div className='border-primary/20 h-32 w-32 overflow-hidden rounded-full border-4 shadow-2xl sm:h-40 sm:w-40'>
                <Image
                  width={32}
                  height={32}
                  src={previewUrl}
                  alt={t('altText')}
                  className='h-full w-full object-cover transition-transform group-hover:scale-105'
                />
              </div>
              <button
                onClick={removeFile}
                className='bg-destructive hover:bg-destructive/90 text-destructive-foreground absolute -top-2 -right-2 rounded-full p-2 shadow-lg transition-all hover:scale-110'
              >
                <X className='h-4 w-4' />
              </button>
              <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black/20 opacity-0 transition-opacity group-hover:opacity-100'>
                <Camera className='h-6 w-6 text-white' />
              </div>
            </div>
          ) : (
            /* Enhanced Upload Area */
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`group relative w-full max-w-lg cursor-pointer rounded-2xl border-2 border-dashed p-8 transition-all duration-300 sm:p-12 ${
                dragActive
                  ? 'border-primary bg-primary/5 scale-105'
                  : 'border-border hover:border-primary/50 hover:bg-card/80'
              }`}
            >
              <input
                type='file'
                accept='image/*'
                onChange={handleFileInputChange}
                className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
              />

              <div className='space-y-6 text-center'>
                <div
                  className={`mx-auto flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 ${
                    dragActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted group-hover:bg-primary/10'
                  }`}
                >
                  <ImageIcon
                    className={`h-10 w-10 transition-colors ${
                      dragActive
                        ? 'text-primary-foreground'
                        : 'text-muted-foreground group-hover:text-primary'
                    }`}
                  />
                </div>

                <div>
                  <p className='text-foreground mb-2 text-xl font-semibold'>
                    {dragActive ? t('dropHere') : t('uploadPrompt')}
                  </p>
                  <p className='text-muted-foreground mb-6'>{t('clickToBrowse')}</p>

                  <div className='bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center space-x-3 rounded-xl px-6 py-3 font-medium shadow-lg transition-all hover:scale-105'>
                    <Upload className='h-5 w-5' />
                    <span>{t('chooseFile')}</span>
                  </div>
                </div>

                <p className='text-muted-foreground text-sm'>{t('supportedFormats')}</p>
              </div>
            </div>
          )}

          {uploadError && (
            <div className='bg-destructive/10 border-destructive/20 mt-4 rounded-lg border p-3'>
              <p className='text-destructive text-sm font-medium'>{uploadError}</p>
            </div>
          )}
        </div>

        {/* Enhanced file info with better styling */}
        {selectedFile && (
          <div className='bg-muted/50 border-border rounded-xl border p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-3'>
                <div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-lg'>
                  <ImageIcon className='text-primary h-5 w-5' />
                </div>
                <div>
                  <p className='text-foreground font-medium'>{selectedFile.name}</p>
                  <p className='text-muted-foreground text-sm'>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className='text-muted-foreground hover:text-destructive p-1 transition-colors'
              >
                <X className='h-5 w-5' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced navigation with better button styling */}
      <div className='border-border mt-10 flex items-center justify-between border-t pt-6'>
        <button
          onClick={onPrevious}
          className='text-muted-foreground hover:text-foreground hover:bg-muted/50 inline-flex items-center space-x-2 rounded-lg px-4 py-2 transition-colors'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('back')}</span>
        </button>

        <div className='flex items-center space-x-4'>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className='bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center space-x-2 rounded-xl px-6 py-3 font-medium shadow-lg transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100'
          >
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                <span>{t('uploading')}</span>
              </>
            ) : (
              <>
                <span>{t('continue')}</span>
                <ArrowRight className='h-4 w-4' />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
