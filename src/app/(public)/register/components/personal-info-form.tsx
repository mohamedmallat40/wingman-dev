'use client';

import { Input } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface PersonalInfoFormProperties {
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
}

export default function PersonalInfoForm({
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange
}: Readonly<PersonalInfoFormProperties>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='space-y-6'
    >
      <div className='text-center'>
        <div className='bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[16px]'>
          <Icon icon='solar:user-bold' className='text-primary h-6 w-6' />
        </div>
        <h2 className='text-foreground mb-2 text-xl font-bold tracking-[0.02em]'>
          Personal Information
        </h2>
        <p className='text-default-600 tracking-[0.02em]'>Tell us about yourself</p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Input
            type='text'
            placeholder='First name'
            value={firstName}
            onChange={(event: { target: { value: string } }) => {
              onFirstNameChange(event.target.value);
            }}
            variant='bordered'
            classNames={{
              base: 'w-full',
              mainWrapper: 'w-full',
              inputWrapper:
                'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
              input:
                'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
            }}
            startContent={
              <Icon icon='solar:user-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
            }
            isRequired
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Input
            type='text'
            placeholder='Last name'
            value={lastName}
            onChange={(event: { target: { value: string } }) => {
              onLastNameChange(event.target.value);
            }}
            variant='bordered'
            classNames={{
              base: 'w-full',
              mainWrapper: 'w-full',
              inputWrapper:
                'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
              input:
                'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
            }}
            startContent={
              <Icon icon='solar:user-linear' className='text-default-400 h-5 w-5 flex-shrink-0' />
            }
            isRequired
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
