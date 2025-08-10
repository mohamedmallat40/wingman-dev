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
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { IDocument } from '../../types';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'Admin' | 'Manager' | 'User' | 'Guest';
  department: string;
  isOnline: boolean;
}

interface DocumentShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: IDocument | null;
  onShare?: (data: { userIds: string[]; message?: string; notifyUsers: boolean }) => Promise<void>;
}

// Simple mock users data
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'sarah.chen@company.com',
    firstName: 'Sarah',
    lastName: 'Chen',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    role: 'Manager',
    department: 'Product Management',
    isOnline: true
  },
  {
    id: '2',
    email: 'marcus.rodriguez@company.com',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    role: 'User',
    department: 'Engineering',
    isOnline: false
  },
  {
    id: '3',
    email: 'emma.watson@company.com',
    firstName: 'Emma',
    lastName: 'Watson',
    avatar: 'https://i.pravatar.cc/150?u=emma',
    role: 'Admin',
    department: 'Operations',
    isOnline: true
  },
  {
    id: '4',
    email: 'alex.kim@company.com',
    firstName: 'Alex',
    lastName: 'Kim',
    role: 'User',
    department: 'Design',
    isOnline: true
  },
  {
    id: '5',
    email: 'lisa.thompson@company.com',
    firstName: 'Lisa',
    lastName: 'Thompson',
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    role: 'Manager',
    department: 'Marketing',
    isOnline: false
  },
  {
    id: '6',
    email: 'david.parker@external.com',
    firstName: 'David',
    lastName: 'Parker',
    avatar: 'https://i.pravatar.cc/150?u=david',
    role: 'Guest',
    department: 'External Partner',
    isOnline: true
  }
];

const DocumentShareModal: React.FC<DocumentShareModalProps> = ({
  isOpen,
  onClose,
  document,
  onShare
}) => {
  const t = useTranslations('documents');

  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isSearching, setIsSearching] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [message, setMessage] = useState('');
  const [notifyUsers, setNotifyUsers] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Mock existing shared users
  const [existingSharedUsers] = useState<User[]>([
    MOCK_USERS[0] // Sarah is already shared
  ]);

  // Debounced search effect
  useEffect(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 400);
      return () => clearTimeout(timer);
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    const existingUserIds = existingSharedUsers.map((user) => user.id);
    const selectedUserIds = Array.from(selectedUsers);

    return MOCK_USERS.filter((user) => {
      // Exclude already shared and selected users
      if (existingUserIds.includes(user.id) || selectedUserIds.includes(user.id)) {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          user.firstName.toLowerCase().includes(query) ||
          user.lastName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.department.toLowerCase().includes(query)
        );
      }

      return true;
    }).slice(0, 8); // Limit results
  }, [searchQuery, selectedUsers, existingSharedUsers]);

  // Reset state on close
  const handleClose = useCallback(() => {
    if (!isSharing) {
      setSearchQuery('');
      setSelectedUsers(new Set());
      setMessage('');
      setNotifyUsers(true);
      setSuccess(false);
      setError('');
      onClose();
    }
  }, [isSharing, onClose]);

  // Handle user selection toggle
  const toggleUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => {
      const newSet = new Set(prev);
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

      setIsSharing(true);
      setError('');

      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));

        await onShare?.({
          userIds: Array.from(selectedUsers),
          message: message.trim() || undefined,
          notifyUsers
        });

        setSuccess(true);

        // Auto close after success delay
        setTimeout(() => {
          handleClose();
        }, 2000);
      } catch (error) {
        console.error('Share failed:', error);
        setError('Failed to share document. Please try again.');
      } finally {
        setIsSharing(false);
      }
    },
    [selectedUsers, message, notifyUsers, onShare, handleClose]
  );

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'danger';
      case 'Manager':
        return 'warning';
      case 'User':
        return 'primary';
      case 'Guest':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size='xl'
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
      <ModalContent className='w-full max-w-xl rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
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
                    icon={success ? 'solar:check-circle-bold' : 'solar:share-linear'}
                    className='text-primary h-8 w-8'
                  />
                </motion.div>
                <div>
                  <h2 className='text-foreground text-2xl font-bold tracking-[0.02em]'>
                    {success ? 'Shared Successfully!' : 'Share Document'}
                  </h2>
                  <p className='text-default-500 font-normal tracking-[0.02em]'>
                    {success
                      ? `Document shared with ${selectedUsers.size} ${selectedUsers.size === 1 ? 'person' : 'people'}`
                      : `Share "${document.documentName}" with your team`}
                  </p>
                </div>
              </motion.div>
            </ModalHeader>

            <ModalBody className='flex h-[600px] flex-col gap-6 overflow-hidden py-6'>
              {success ? (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className='bg-success-50 border-success-200 dark:bg-success-900/20 dark:border-success-800/30 rounded-[16px] border p-6 text-center'
                >
                  <Icon icon='solar:share-bold' className='text-success mx-auto mb-3 h-12 w-12' />
                  <p className='text-success-700 dark:text-success-400 mb-4 font-medium'>
                    Document shared successfully!
                  </p>
                  <p className='text-default-600 dark:text-default-400 text-sm'>
                    The selected team members now have access to this document.
                    {notifyUsers && ' They will receive email notifications.'}
                  </p>
                </motion.div>
              ) : (
                // Share Form
                <Form
                  className='flex h-full flex-col gap-6'
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

                  {/* Currently Shared Users */}
                  {existingSharedUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      className='space-y-3'
                    >
                      <div className='flex items-center gap-2'>
                        <Icon
                          icon='solar:users-group-rounded-bold'
                          className='text-primary h-4 w-4'
                        />
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
                            <span className='text-foreground text-sm font-medium'>
                              {user.firstName} {user.lastName}
                            </span>
                          </motion.div>
                        ))}
                      </div>

                      <Divider />
                    </motion.div>
                  )}

                  {/* Search */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className='space-y-4'
                  >
                    <label className='text-foreground text-sm font-medium'>Add people</label>

                    <Input
                      value={searchQuery}
                      onValueChange={setSearchQuery}
                      placeholder='Search by name, email, or department...'
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
                        isSearching ? (
                          <Spinner size='sm' color='primary' />
                        ) : (
                          <Icon
                            icon='solar:magnifer-linear'
                            className='text-default-400 h-5 w-5 flex-shrink-0'
                          />
                        )
                      }
                    />
                  </motion.div>

                  {/* User Results */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className='min-h-0 flex-1 space-y-3'
                  >
                    <AnimatePresence mode='wait'>
                      {!isSearching ? (
                        <motion.div
                          key='users'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='h-full space-y-2'
                        >
                          {filteredUsers.length > 0 ? (
                            <div className='h-full w-full space-y-2 overflow-y-auto'>
                              {filteredUsers.map((user, index) => (
                                <motion.div
                                  key={user.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className='w-full'
                                >
                                  <Card
                                    className='h-20 w-full cursor-pointer transition-all hover:shadow-md'
                                    isPressable
                                    onPress={() => toggleUser(user.id)}
                                  >
                                    <CardBody className='h-full p-4'>
                                      <div className='flex h-full items-center gap-4'>
                                        {/* Avatar with online status */}
                                        <div className='relative shrink-0'>
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
                                              className='h-12 w-12'
                                            />
                                          </Badge>
                                        </div>

                                        {/* User info - fixed layout */}
                                        <div className='flex min-w-0 flex-1 flex-col justify-center'>
                                          <div className='mb-1 flex items-center gap-2'>
                                            <h4 className='text-foreground truncate text-sm font-semibold'>
                                              {user.firstName} {user.lastName}
                                            </h4>
                                            <Chip
                                              size='sm'
                                              color={getRoleColor(user.role) as any}
                                              variant='flat'
                                              className='shrink-0 text-xs'
                                            >
                                              {user.role}
                                            </Chip>
                                          </div>
                                          <p className='text-default-500 truncate text-xs leading-tight'>
                                            {user.email}
                                          </p>
                                          <p className='text-default-400 truncate text-xs leading-tight'>
                                            {user.department}
                                          </p>
                                        </div>

                                        {/* Selection indicator - fixed position */}
                                        <div className='shrink-0'>
                                          {selectedUsers.has(user.id) ? (
                                            <div className='bg-primary flex h-6 w-6 items-center justify-center rounded-full'>
                                              <Icon
                                                icon='solar:check-linear'
                                                className='h-4 w-4 text-white'
                                              />
                                            </div>
                                          ) : (
                                            <div className='border-default-300 h-6 w-6 rounded-full border-2'></div>
                                          )}
                                        </div>
                                      </div>
                                    </CardBody>
                                  </Card>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className='flex h-full items-center justify-center text-center'>
                              <div>
                                <Icon
                                  icon='solar:user-cross-rounded-linear'
                                  className='text-default-300 mx-auto mb-3 h-12 w-12'
                                />
                                <p className='text-default-500 text-sm'>
                                  {searchQuery
                                    ? 'No users found matching your search'
                                    : 'No users available to share with'}
                                </p>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key='searching'
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className='flex h-full items-center justify-center'
                        >
                          <div className='text-center'>
                            <Spinner size='md' color='primary' />
                            <p className='text-default-500 mt-3 text-sm'>Searching users...</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Selected Users */}
                  <div className='flex-shrink-0'>
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
                            <Icon
                              icon='solar:user-plus-linear'
                              className='text-success-600 h-4 w-4'
                            />
                            <span className='text-foreground text-sm font-medium'>
                              Will be shared with ({selectedUsers.size})
                            </span>
                          </div>

                          <div className='flex flex-wrap gap-2'>
                            {Array.from(selectedUsers).map((userId) => {
                              const user = MOCK_USERS.find((u) => u.id === userId);
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
                                    className='h-6 w-6'
                                  />
                                  <span className='text-foreground text-sm font-medium'>
                                    {user.firstName} {user.lastName}
                                  </span>
                                  <Button
                                    isIconOnly
                                    size='sm'
                                    variant='light'
                                    color='danger'
                                    className='h-5 w-5 min-w-5'
                                    onPress={() => toggleUser(userId)}
                                  >
                                    <Icon icon='solar:close-circle-bold' className='h-3 w-3' />
                                  </Button>
                                </motion.div>
                              );
                            })}
                          </div>

                          <div className='space-y-3 pt-2'>
                            <Textarea
                              value={message}
                              onValueChange={setMessage}
                              label='Message (optional)'
                              placeholder='Add a personal message...'
                              variant='bordered'
                              maxRows={3}
                              classNames={{
                                base: 'w-full',
                                mainWrapper: 'w-full',
                                inputWrapper:
                                  'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50 p-4',
                                input:
                                  'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base resize-none'
                              }}
                            />

                            <div className='flex items-center gap-2'>
                              <Switch
                                size='sm'
                                isSelected={notifyUsers}
                                onValueChange={setNotifyUsers}
                              />
                              <span className='text-foreground text-sm'>
                                Notify users via email
                              </span>
                            </div>
                          </div>

                          {/* Submit Button */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1, duration: 0.4 }}
                            className='pt-4'
                          >
                            <Button
                              type='submit'
                              color='primary'
                              size='lg'
                              fullWidth
                              isDisabled={selectedUsers.size === 0}
                              isLoading={isSharing}
                              startContent={
                                !isSharing ? (
                                  <Icon icon='solar:share-linear' className='h-4 w-4' />
                                ) : undefined
                              }
                              className='h-14 rounded-[16px] text-lg font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                            >
                              {isSharing
                                ? 'Sharing...'
                                : `Share with ${selectedUsers.size} ${selectedUsers.size === 1 ? 'person' : 'people'}`}
                            </Button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Form>
              )}
            </ModalBody>

            <ModalFooter className='justify-center pt-4 pb-8'>
              {!success && selectedUsers.size === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <Button
                    variant='bordered'
                    onPress={handleClose}
                    disabled={isSharing}
                    className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                  >
                    Cancel
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

export default DocumentShareModal;
