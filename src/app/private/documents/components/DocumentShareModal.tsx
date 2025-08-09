'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Chip,
  Divider,
  Spinner,
  Card,
  CardBody,
  Badge,
  Textarea,
  Switch
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { IDocument } from '../types';

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
  onShare?: (data: {
    userIds: string[];
    message?: string;
    notifyUsers: boolean;
  }) => Promise<void>;
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
    isOnline: true,
  },
  {
    id: '2',
    email: 'marcus.rodriguez@company.com',
    firstName: 'Marcus',
    lastName: 'Rodriguez',
    avatar: 'https://i.pravatar.cc/150?u=marcus',
    role: 'User',
    department: 'Engineering',
    isOnline: false,
  },
  {
    id: '3',
    email: 'emma.watson@company.com',
    firstName: 'Emma',
    lastName: 'Watson',
    avatar: 'https://i.pravatar.cc/150?u=emma',
    role: 'Admin',
    department: 'Operations',
    isOnline: true,
  },
  {
    id: '4',
    email: 'alex.kim@company.com',
    firstName: 'Alex',
    lastName: 'Kim',
    role: 'User',
    department: 'Design',
    isOnline: true,
  },
  {
    id: '5',
    email: 'lisa.thompson@company.com',
    firstName: 'Lisa',
    lastName: 'Thompson',
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    role: 'Manager',
    department: 'Marketing',
    isOnline: false,
  },
  {
    id: '6',
    email: 'david.parker@external.com',
    firstName: 'David',
    lastName: 'Parker',
    avatar: 'https://i.pravatar.cc/150?u=david',
    role: 'Guest',
    department: 'External Partner',
    isOnline: true,
  },
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

  // Mock existing shared users
  const [existingSharedUsers] = useState<User[]>([
    MOCK_USERS[0], // Sarah is already shared
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
    const existingUserIds = existingSharedUsers.map(user => user.id);
    const selectedUserIds = Array.from(selectedUsers);
    
    return MOCK_USERS.filter(user => {
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
      onClose();
    }
  }, [isSharing, onClose]);

  // Handle user selection toggle
  const toggleUser = useCallback((userId: string) => {
    setSelectedUsers(prev => {
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
  const handleShare = useCallback(async () => {
    if (selectedUsers.size === 0) return;

    setIsSharing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await onShare?.({
        userIds: Array.from(selectedUsers),
        message: message.trim() || undefined,
        notifyUsers
      });

      handleClose();
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSharing(false);
    }
  }, [selectedUsers, message, notifyUsers, onShare, handleClose]);

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'danger';
      case 'Manager': return 'warning'; 
      case 'User': return 'primary';
      case 'Guest': return 'default';
      default: return 'default';
    }
  };

  if (!document) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
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
                  <Icon icon="solar:share-linear" className="h-5 w-5 text-primary" />
                </motion.div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    Share Document
                  </h2>
                  <p className="text-sm text-default-500">
                    Share "{document.documentName}" with your team
                  </p>
                </div>
              </div>
            </ModalHeader>

            <ModalBody className="gap-6 py-6 h-[600px] overflow-hidden flex flex-col">
              {/* Currently Shared Users */}
              {existingSharedUsers.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon icon="solar:users-group-rounded-bold" className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">
                      Already shared with ({existingSharedUsers.length})
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {existingSharedUsers.map((user) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 rounded-full bg-default-100 px-3 py-2"
                      >
                        <Avatar
                          src={user.avatar}
                          name={`${user.firstName} ${user.lastName}`}
                          size="sm"
                          className="h-6 w-6"
                        />
                        <span className="text-sm font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                  
                  <Divider />
                </div>
              )}

              {/* Search */}
              <div className="space-y-4">
                <label className="text-sm font-medium text-foreground">
                  Add people
                </label>

                <Input
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  placeholder="Search by name, email, or department..."
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
                    isSearching ? (
                      <Spinner size="sm" color="primary" />
                    ) : (
                      <Icon icon="solar:magnifer-linear" className="h-5 w-5 flex-shrink-0 text-default-400" />
                    )
                  }
                />
              </div>

              {/* User Results */}
              <div className="space-y-3 flex-1 min-h-0">
                <AnimatePresence mode="wait">
                  {!isSearching ? (
                    <motion.div
                      key="users"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 h-full"
                    >
                      {filteredUsers.length > 0 ? (
                        <div className="h-full space-y-2 overflow-y-auto w-full">
                          {filteredUsers.map((user, index) => (
                            <motion.div
                              key={user.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="w-full"
                            >
                              <Card 
                                className="cursor-pointer transition-all hover:shadow-md h-20 w-full"
                                isPressable
                                onPress={() => toggleUser(user.id)}
                              >
                                <CardBody className="p-4 h-full">
                                  <div className="flex items-center gap-4 h-full">
                                    {/* Avatar with online status */}
                                    <div className="relative shrink-0">
                                      <Badge
                                        content=""
                                        color={user.isOnline ? "success" : "default"}
                                        placement="bottom-right"
                                        size="sm"
                                      >
                                        <Avatar
                                          src={user.avatar}
                                          name={`${user.firstName} ${user.lastName}`}
                                          size="md"
                                          className="h-12 w-12"
                                        />
                                      </Badge>
                                    </div>
                                    
                                    {/* User info - fixed layout */}
                                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-foreground truncate">
                                          {user.firstName} {user.lastName}
                                        </h4>
                                        <Chip
                                          size="sm"
                                          color={getRoleColor(user.role) as any}
                                          variant="flat"
                                          className="text-xs shrink-0"
                                        >
                                          {user.role}
                                        </Chip>
                                      </div>
                                      <p className="text-xs text-default-500 truncate leading-tight">
                                        {user.email}
                                      </p>
                                      <p className="text-xs text-default-400 truncate leading-tight">
                                        {user.department}
                                      </p>
                                    </div>

                                    {/* Selection indicator - fixed position */}
                                    <div className="shrink-0">
                                      {selectedUsers.has(user.id) ? (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                                          <Icon icon="solar:check-linear" className="h-4 w-4 text-white" />
                                        </div>
                                      ) : (
                                        <div className="h-6 w-6 rounded-full border-2 border-default-300"></div>
                                      )}
                                    </div>
                                  </div>
                                </CardBody>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-full text-center">
                          <div>
                            <Icon icon="solar:user-cross-rounded-linear" className="mx-auto mb-3 h-12 w-12 text-default-300" />
                            <p className="text-sm text-default-500">
                              {searchQuery ? 'No users found matching your search' : 'No users available to share with'}
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="searching"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center h-full"
                    >
                      <div className="text-center">
                        <Spinner size="md" color="primary" />
                        <p className="mt-3 text-sm text-default-500">Searching users...</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Selected Users */}
              <div className="flex-shrink-0">
                <AnimatePresence>
                  {selectedUsers.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                    <Divider />
                    
                    <div className="flex items-center gap-2">
                      <Icon icon="solar:user-plus-linear" className="h-4 w-4 text-success-600" />
                      <span className="text-sm font-medium text-foreground">
                        Will be shared with ({selectedUsers.size})
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {Array.from(selectedUsers).map((userId) => {
                        const user = MOCK_USERS.find(u => u.id === userId);
                        if (!user) return null;

                        return (
                          <motion.div
                            key={userId}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex items-center gap-2 rounded-full bg-success-50 px-3 py-2"
                          >
                            <Avatar
                              src={user.avatar}
                              name={`${user.firstName} ${user.lastName}`}
                              size="sm"
                              className="h-6 w-6"
                            />
                            <span className="text-sm font-medium text-foreground">
                              {user.firstName} {user.lastName}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              className="h-5 w-5 min-w-5"
                              onPress={() => toggleUser(userId)}
                            >
                              <Icon icon="solar:close-circle-bold" className="h-3 w-3" />
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>

                    <div className="space-y-3 pt-2">
                      <Textarea
                        value={message}
                        onValueChange={setMessage}
                        label="Message (optional)"
                        placeholder="Add a personal message..."
                        variant="bordered"
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

                      <div className="flex items-center gap-2">
                        <Switch
                          size="sm"
                          isSelected={notifyUsers}
                          onValueChange={setNotifyUsers}
                        />
                        <span className="text-sm text-foreground">
                          Notify users via email
                        </span>
                      </div>
                    </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                variant="light"
                onPress={handleClose}
                disabled={isSharing}
              >
                Cancel
              </Button>
              
              <Button
                color="primary"
                onPress={handleShare}
                isDisabled={selectedUsers.size === 0}
                isLoading={isSharing}
                loadingText="Sharing..."
                startContent={!isSharing ? <Icon icon="solar:share-linear" className="h-4 w-4" /> : undefined}
                className="min-w-[120px]"
              >
                {isSharing ? 'Sharing...' : `Share with ${selectedUsers.size} ${selectedUsers.size === 1 ? 'person' : 'people'}`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DocumentShareModal;