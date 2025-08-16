'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Avatar,
  Badge,
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
  Spinner,
  Switch,
  Textarea
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useNetworkUsers, useShareDocument } from '@root/modules/documents/hooks/use-documents';
import { type IUserProfile } from '@root/modules/profile/types';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type IDocument, type SharedUser } from '../../types';

interface DocumentShareModalProperties {
  isOpen: boolean;
  onClose: () => void;
  document: IDocument | null;
  onShare?: (data: { users: string[]; message?: string; notifyUsers: boolean }) => Promise<void>;
}

const DocumentShareModal: React.FC<DocumentShareModalProperties> = ({
  isOpen,
  onClose,
  document,
  onShare
}) => {
  const t = useTranslations('documents');

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [success, setSuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState('');

  // API hooks
  const {
    data: networkResponse,
    isLoading: isLoadingUsers,
    error: networkError,
    refetch: refetchUsers
  } = useNetworkUsers(currentPage, 8, isOpen);

  const shareDocumentMutation = useShareDocument();

  const networkUsers = networkResponse?.items;
  const existingSharedUsers = useMemo(() => {
    return (
      document?.sharedWith.map((shared: SharedUser) => ({
        id: shared.id,
        email: shared.email,
        firstName: shared.firstName,
        lastName: shared.lastName,
        avatar: shared.profileImage || shared.avatar || '',
        role: shared.role || 'FREELANCER'
      })) ?? []
    );
  }, [document]);

  // Set error from mutation or network error
  useEffect(() => {
    if (shareDocumentMutation.error) {
      setError(
        shareDocumentMutation.error.message || 'Failed to share document. Please try again.'
      );
    } else if (networkError) {
      setError('Failed to load users. Please try again.');
    } else {
      setError('');
    }
  }, [shareDocumentMutation.error, networkError]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    const existingUserIds = new Set(existingSharedUsers.map((user) => user.id));
    const selectedUserIds = new Set(selectedUsers);
    return networkUsers?.filter((user: IUserProfile) => {
        if (existingUserIds.has(user.id) || selectedUserIds.has(user.id)) {
          return false;
        }

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            user.firstName?.toLowerCase().includes(query) ||
            user.lastName?.toLowerCase().includes(query) ||
            user.email?.toLowerCase().includes(query) ||
            user.department?.toLowerCase().includes(query) ||
            user.company?.toLowerCase().includes(query)
          );
        }

        return true;
      })
      .slice(0, 8); // Limit results
  }, [searchQuery, selectedUsers, existingSharedUsers, networkUsers]);

  // Reset state on close
  const handleClose = useCallback(() => {
    if (!shareDocumentMutation.isPending) {
      setSearchQuery('');
      setSelectedUsers(new Set());
      setMessage('');
      setNotifyUsers(true);
      setSuccess(false);
      setError('');
      setCurrentPage(1);
      onClose();
    }
  }, [shareDocumentMutation.isPending, onClose]);

  // Handle user selection toggle
  const toggleUser = useCallback((userId: string) => {
    setSelectedUsers((previous) => {
      const newSet = new Set(previous);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  // Handle share submission
  const handleShare = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (selectedUsers.size === 0) {
        setError('Please select at least one user to share with');
        return;
      }

      if (!document?.id) {
        setError('Document not found');
        return;
      }

      setError('');

      try {
        await shareDocumentMutation.mutateAsync({
          documentId: document.id,
          data: {
            users: [...selectedUsers],
            message: message.trim() || undefined,
            notifyUsers
          }
        });

        setSuccess(true);

        // Call the optional onShare callback
        await onShare?.({
          users: [...selectedUsers],
          message: message.trim() || undefined,
          notifyUsers
        });

        // Auto close after success delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
        console.error('Share failed:', error);
      }
    },
    [selectedUsers, message, notifyUsers, document?.id, shareDocumentMutation, onShare, handleClose]
  );

  // Handle search with debouncing
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Refetch users when search changes
  useEffect(() => {
    if (isOpen && debouncedSearch.trim()) {
      refetchUsers();
    }
  }, [debouncedSearch, refetchUsers, isOpen]);

  // Get role color
  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'Admin': {
        return 'danger';
      }
      case 'Manager': {
        return 'warning';
      }
      case 'User': {
        return 'primary';
      }
      case 'Guest': {
        return 'default';
      }
      default: {
        return 'default';
      }
    }
  };

  // Loading states
  const isSearching = isLoadingUsers;
  const isSharing = shareDocumentMutation.isPending;

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='2xl'
      scrollBehavior='inside'
      backdrop='opaque'
      isDismissable={!isSharing}
      classNames={{
        wrapper: 'p-4 sm:p-6',
        base: 'border-default-200 dark:border-default-700',
        backdrop: 'bg-black/50 backdrop-blur-sm'
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
      <ModalContent className='w-full max-w-2xl'>
        {(onClose) => (
          <>
            <ModalHeader className='flex flex-col gap-2 px-6 pt-6 pb-4'>
              <div className='flex items-center justify-between'>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className='flex items-center gap-3'
                >
                  <div className='bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-xl ring-1'>
                    <Icon
                      icon={success ? 'solar:check-circle-outline' : 'solar:share-outline'}
                      className='text-primary h-6 w-6'
                    />
                  </div>
                  <div className='flex flex-col'>
                    <h2 className='text-foreground text-xl font-semibold'>
                      {success ? 'Shared Successfully!' : 'Share Document'}
                    </h2>
                    <p className='text-default-500 text-sm'>
                      {success
                        ? `Document shared with ${selectedUsers.size} ${selectedUsers.size === 1 ? 'person' : 'people'}`
                        : `Share "${document.documentName}" with your team`}
                    </p>
                  </div>
                </motion.div>
                <Button
                  isIconOnly
                  variant='light'
                  onPress={onClose}
                  className='hover:bg-default-100 dark:hover:bg-default-800'
                >
                  <Icon icon='solar:close-circle-outline' className='h-5 w-5' />
                </Button>
              </div>
            </ModalHeader>

            <ModalBody className='flex flex-col gap-4 px-6 py-4 max-h-[70vh] overflow-y-auto'>
              {success ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800/30 rounded-xl border p-6 text-center'
                >
                  <Icon icon='solar:check-circle-outline' className='text-success mx-auto mb-3 h-16 w-16' />
                  <p className='text-success-700 dark:text-success-400 mb-4 font-medium text-lg'>
                    Document shared successfully!
                  </p>
                  <p className='text-default-600 dark:text-default-400 text-sm'>
                    The selected team members now have access to this document.
                    {notifyUsers && ' They will receive email notifications.'}
                  </p>
                </motion.div>
              ) : (
                <Form
                  className='flex flex-col gap-4'
                  validationBehavior='native'
                  onSubmit={handleShare}
                >
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className='bg-danger-50 border-danger-200 dark:bg-danger-900/20 dark:border-danger-800/30 rounded-xl border p-4'
                      >
                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:danger-triangle-outline' className='text-danger h-5 w-5' />
                          <p className='text-danger text-sm font-medium'>{error}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Currently Shared Users */}
                  {existingSharedUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className='space-y-3'
                    >
                      <div className='flex items-center gap-2'>
                        <Icon icon='solar:users-group-rounded-outline' className='text-primary h-4 w-4' />
                        <span className='text-foreground text-sm font-medium'>
                          Already shared with ({existingSharedUsers.length})
                        </span>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        {existingSharedUsers.map((user) => (
                          <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='bg-default-100 dark:bg-default-800 flex items-center gap-2 rounded-full px-3 py-2'
                          >
                            <Avatar
                              src={user.avatar}
                              name={`${user.firstName} ${user.lastName}`}
                              size='sm'
                              className='h-6 w-6'
                            />
                            <span className='text-foreground text-sm'>
                              {user.firstName} {user.lastName}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <Divider className='my-4' />
                    </motion.div>
                  )}

                  {/* Search */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className='space-y-3'
                  >
                    <div className='flex items-center gap-2'>
                      <Icon icon='solar:user-plus-outline' className='text-primary h-4 w-4' />
                      <span className='text-foreground text-sm font-medium'>Add people</span>
                    </div>

                    <Input
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      placeholder='Search by name, email, or department...'
                      variant='bordered'
                      className='w-full'
                      classNames={{
                        inputWrapper: 'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary'
                      }}
                      startContent={
                        isSearching ? (
                          <Spinner size='sm' color='primary' />
                        ) : (
                          <Icon icon='solar:magnifer-outline' className='text-default-400 h-4 w-4' />
                        )
                      }
                    />
                  </motion.div>

                  {/* User Results */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className='min-h-0 flex-1 space-y-2'
                  >
                    <AnimatePresence mode='wait'>
                      {isSearching ? (
                        <motion.div
                          key='searching'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='flex h-32 items-center justify-center'
                        >
                          <div className='text-center'>
                            <Spinner size='md' color='primary' />
                            <p className='text-default-500 mt-3 text-sm'>Searching users...</p>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key='users'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='space-y-2 max-h-60 overflow-y-auto'
                        >
                          {filteredUsers.length > 0 ? (
                            filteredUsers.map((user: IUserProfile, index: number) => (
                              <motion.div
                                key={user.id}
                                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                whileHover={{ y: -1 }}
                                transition={{
                                  delay: index * 0.05,
                                  type: 'spring',
                                  stiffness: 300,
                                  damping: 20
                                }}
                              >
                                <Card
                                  className='border-default-200 hover:border-primary/50 hover:bg-primary/5 cursor-pointer border transition-all duration-200'
                                  isPressable
                                  onPress={() => toggleUser(user.id)}
                                >
                                  <CardBody className='p-3'>
                                    <div className='flex items-center gap-3'>
                                      {/* Avatar with online status */}
                                      <div className='relative'>
                                        <Badge
                                          content=''
                                          color={user.isOnline ? 'success' : 'default'}
                                          placement='bottom-right'
                                          size='sm'
                                        >
                                          <Avatar
                                            src={user.avatar}
                                            name={`${user.firstName} ${user.lastName}`}
                                            size='md'
                                            className='h-10 w-10'
                                          />
                                        </Badge>
                                      </div>

                                      {/* User info */}
                                      <div className='min-w-0 flex-1'>
                                        <div className='mb-1 flex items-center gap-2'>
                                          <h4 className='text-foreground truncate text-sm font-medium'>
                                            {user.firstName} {user.lastName}
                                          </h4>
                                          <Chip
                                            size='sm'
                                            color={getRoleColor(user.role) as any}
                                            variant='flat'
                                            className='text-xs'
                                          >
                                            {user.role || 'User'}
                                          </Chip>
                                        </div>
                                        <p className='text-default-500 truncate text-xs'>{user.email}</p>
                                        {(user.department || user.company) && (
                                          <p className='text-default-400 truncate text-xs'>
                                            {user.department || user.company}
                                          </p>
                                        )}
                                      </div>

                                      {/* Selection indicator */}
                                      <div className='flex-shrink-0'>
                                        {selectedUsers.has(user.id) ? (
                                          <motion.div
                                            className='bg-primary ring-primary/30 flex h-5 w-5 items-center justify-center rounded-full ring-2'
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                                          >
                                            <Icon icon='solar:check-outline' className='h-3 w-3 text-white' />
                                          </motion.div>
                                        ) : (
                                          <div className='border-default-300 hover:border-primary/60 h-5 w-5 rounded-full border-2 transition-colors duration-200'></div>
                                        )}
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              </motion.div>
                            ))
                          ) : (
                            <div className='flex h-32 items-center justify-center text-center'>
                              <div>
                                <Icon icon='solar:user-cross-rounded-outline' className='text-default-300 mx-auto mb-3 h-12 w-12' />
                                <p className='text-default-500 text-sm'>
                                  {searchQuery
                                    ? 'No users found matching your search'
                                    : 'No users available to share with'}
                                </p>
                                {networkError && (
                                  <Button
                                    size='sm'
                                    variant='flat'
                                    color='primary'
                                    onPress={() => refetchUsers()}
                                    className='mt-2'
                                  >
                                    Try Again
                                  </Button>
                                )}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Selected Users Preview */}
                  <AnimatePresence>
                    {selectedUsers.size > 0 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className='space-y-3'
                      >
                        <Divider />

                        <div className='flex items-center gap-2'>
                          <Icon icon='solar:user-plus-outline' className='text-success-600 h-4 w-4' />
                          <span className='text-foreground text-sm font-medium'>
                            Will be shared with ({selectedUsers.size})
                          </span>
                        </div>

                        <div className='flex flex-wrap gap-2'>
                          {[...selectedUsers].map((userId) => {
                            const user = networkUsers?.find((u: IUserProfile) => u.id === userId);
                            if (!user) return null;

                            return (
                              <motion.div
                                key={userId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className='bg-success-50 dark:bg-success-900/20 flex items-center gap-2 rounded-full px-3 py-2'
                              >
                                <Avatar
                                  src={user.avatar}
                                  name={`${user.firstName} ${user.lastName}`}
                                  size='sm'
                                  className='h-5 w-5'
                                />
                                <span className='text-foreground text-sm'>
                                  {user.firstName} {user.lastName}
                                </span>
                                <Button
                                  isIconOnly
                                  size='sm'
                                  variant='light'
                                  color='danger'
                                  className='h-4 w-4 min-w-4'
                                  onPress={() => toggleUser(userId)}
                                >
                                  <Icon icon='solar:close-circle-outline' className='h-3 w-3' />
                                </Button>
                              </motion.div>
                            );
                          })}
                        </div>

                        <div className='space-y-3'>
                          <Textarea
                            value={message}
                            onValueChange={setMessage}
                            label='Message (optional)'
                            placeholder='Add a personal message...'
                            variant='bordered'
                            maxRows={3}
                            classNames={{
                              inputWrapper: 'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary'
                            }}
                          />

                          <div className='flex items-center gap-2'>
                            <Switch
                              size='sm'
                              isSelected={notifyUsers}
                              onValueChange={setNotifyUsers}
                            />
                            <span className='text-foreground text-sm'>Notify users via email</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Form>
              )}
            </ModalBody>

            <ModalFooter className='justify-end px-6 pt-4 pb-6'>
              {!success && (
                <div className='flex gap-3'>
                  <Button
                    variant='bordered'
                    onPress={handleClose}
                    disabled={isSharing}
                  >
                    Cancel
                  </Button>
                  {selectedUsers.size > 0 && (
                    <Button
                      type='submit'
                      color='primary'
                      isDisabled={selectedUsers.size === 0}
                      isLoading={isSharing}
                      startContent={
                        isSharing ? undefined : <Icon icon='solar:share-outline' className='h-4 w-4' />
                      }
                      onPress={() => {
                        const form = document.querySelector('form');
                        if (form) {
                          form.requestSubmit();
                        }
                      }}
                    >
                      {isSharing
                        ? 'Sharing...'
                        : `Share with ${selectedUsers.size} ${selectedUsers.size === 1 ? 'person' : 'people'}`}
                    </Button>
                  )}
                </div>
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DocumentShareModal;
