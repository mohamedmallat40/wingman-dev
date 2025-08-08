'use client';

import React, { useState, useCallback } from 'react';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Form,
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite?: (data: {
    firstName: string;
    lastName: string;
    email: string;
    personalMessage?: string;
  }) => Promise<void>;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite
}) => {
  const t = useTranslations('talentPool');
  
  // Form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Reset state on close
  const handleClose = useCallback(() => {
    if (!isInviting) {
      setFirstName('');
      setLastName('');
      setEmail('');
      setPersonalMessage('');
      setError('');
      setSuccess(false);
      onClose();
    }
  }, [isInviting, onClose]);

  // Handle form submission
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName || !lastName || !email) return;

    setError('');
    setIsInviting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await onInvite?.({
        firstName,
        lastName,
        email,
        personalMessage: personalMessage.trim() || undefined
      });

      setSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Invite failed:', error);
      setError('Failed to send invitation. Please try again.');
    } finally {
      setIsInviting(false);
    }
  }, [firstName, lastName, email, personalMessage, onInvite, handleClose]);

  // Validation
  const isFormValid = firstName.trim() && lastName.trim() && email.trim();

  return (
    <Modal
      backdrop='blur'
      classNames={{
        base: 'bg-background dark:bg-content1',
        backdrop: 'bg-black/50 backdrop-blur-sm'
      }}
      isOpen={isOpen}
      placement='center'
      size='lg'
      onOpenChange={handleClose}
    >
      <ModalContent className='w-full max-w-lg rounded-[24px] shadow-[0px_12px_24px_rgba(0,0,0,0.08)]'>
        <ModalHeader className='flex flex-col items-center pt-8 pb-6'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-center'
          >
            <div className='mb-4'>
              <div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px]'>
                <Icon
                  icon={success ? 'solar:check-circle-bold' : 'solar:user-plus-bold'}
                  className='text-primary h-8 w-8'
                />
              </div>
            </div>
            <h2 className='text-foreground mb-2 text-2xl font-bold tracking-[0.02em]'>
              {success ? 'Invitation Sent!' : 'Invite to Talent Pool'}
            </h2>
            <p className='text-default-500 font-normal tracking-[0.02em]'>
              {success 
                ? `We've sent an invitation to ${email}`
                : 'Send an invitation to join your talent pool'
              }
            </p>
          </motion.div>
        </ModalHeader>

        <ModalBody className='px-6'>
          {success ? (
            // Success state
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className='bg-success-50 border-success-200 rounded-[16px] border p-6 text-center'
            >
              <Icon
                icon='solar:mailbox-bold'
                className='text-success mx-auto mb-3 h-12 w-12'
              />
              <p className='text-success-700 mb-4 font-medium'>
                Invitation sent successfully!
              </p>
              <p className='text-default-600 text-sm'>
                {firstName} {lastName} will receive an email invitation to join your talent pool.
              </p>
            </motion.div>
          ) : (
            // Invitation Form
            <Form
              className='flex flex-col gap-4'
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
                    className='bg-danger-50 border-danger-200 mb-4 rounded-[16px] border p-4'
                  >
                    <div className='flex items-center gap-2'>
                      <Icon icon='solar:danger-triangle-bold' className='text-danger h-4 w-4' />
                      <p className='text-danger text-sm font-medium tracking-[0.02em]'>{error}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* First Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className='w-full'
              >
                <Input
                  autoFocus
                  isRequired
                  classNames={{
                    base: 'w-full',
                    mainWrapper: 'w-full',
                    inputWrapper:
                      'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                    input:
                      'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                  }}
                  isInvalid={!!error}
                  name='firstName'
                  placeholder='First name'
                  startContent={
                    <Icon
                      icon='solar:user-linear'
                      className='text-default-400 h-5 w-5 flex-shrink-0'
                    />
                  }
                  type='text'
                  value={firstName}
                  variant='bordered'
                  onValueChange={setFirstName}
                />
              </motion.div>

              {/* Last Name */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className='w-full'
              >
                <Input
                  isRequired
                  classNames={{
                    base: 'w-full',
                    mainWrapper: 'w-full',
                    inputWrapper:
                      'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                    input:
                      'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                  }}
                  isInvalid={!!error}
                  name='lastName'
                  placeholder='Last name'
                  startContent={
                    <Icon
                      icon='solar:user-linear'
                      className='text-default-400 h-5 w-5 flex-shrink-0'
                    />
                  }
                  type='text'
                  value={lastName}
                  variant='bordered'
                  onValueChange={setLastName}
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className='w-full'
              >
                <Input
                  isRequired
                  classNames={{
                    base: 'w-full',
                    mainWrapper: 'w-full',
                    inputWrapper:
                      'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-default-100 dark:bg-default-50 pl-4',
                    input:
                      'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 pl-2 text-base'
                  }}
                  isInvalid={!!error}
                  name='email'
                  placeholder='Email address'
                  startContent={
                    <Icon
                      icon='solar:letter-linear'
                      className='text-default-400 h-5 w-5 flex-shrink-0'
                    />
                  }
                  type='email'
                  value={email}
                  variant='bordered'
                  onValueChange={setEmail}
                />
              </motion.div>

              {/* Personal Message */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className='w-full'
              >
                <Textarea
                  classNames={{
                    base: 'w-full',
                    mainWrapper: 'w-full',
                    inputWrapper:
                      'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] bg-default-100 dark:bg-default-50 p-4',
                    input:
                      'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base resize-none'
                  }}
                  maxRows={4}
                  minRows={3}
                  name='personalMessage'
                  placeholder='Add a personal message (optional)...'
                  value={personalMessage}
                  variant='bordered'
                  onValueChange={setPersonalMessage}
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
                className='flex w-full justify-center pt-4'
              >
                <Button
                  className='h-14 w-full max-w-md rounded-[16px] text-lg font-bold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                  color='primary'
                  isDisabled={!isFormValid || isInviting}
                  isLoading={isInviting}
                  startContent={
                    !isInviting && (
                      <Icon icon='solar:letter-unread-bold' className='h-5 w-5' />
                    )
                  }
                  type='submit'
                >
                  {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
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
              className='flex gap-3'
            >
              <Button
                className='border-default-300 hover:border-primary hover:bg-primary/5 h-12 rounded-[16px] font-medium tracking-[0.02em] transition-all duration-300'
                variant='bordered'
                onPress={handleClose}
                isDisabled={isInviting}
              >
                Cancel
              </Button>
            </motion.div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InviteUserModal;