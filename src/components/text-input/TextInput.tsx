import React, { FC } from 'react';

import { Input, InputProps } from '@heroui/input';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';
import { FieldError } from 'react-hook-form';

interface TextInputProps extends InputProps {
  error?: FieldError;
}

const TextInput: FC<TextInputProps> = ({ error, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full space-y-2'
    >
      <Input
        isInvalid={error?.message ? true : false}
        variant='bordered'
        classNames={{
          base: 'w-full',
          mainWrapper: 'w-full',
          inputWrapper:
            'border-default-300 data-[hover=true]:border-primary group-data-[focus=true]:border-primary rounded-[16px] h-14 bg-white dark:bg-background transition-all duration-300',
          input:
            'text-foreground font-normal tracking-[0.02em] placeholder:text-default-400 text-base'
        }}
        {...props}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='flex items-center gap-2 px-1'
          >
            <Icon icon='solar:danger-triangle-bold' className='text-danger h-4 w-4 flex-shrink-0' />
            <p className='text-danger text-sm font-medium tracking-[0.02em]'>{error.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TextInput;
