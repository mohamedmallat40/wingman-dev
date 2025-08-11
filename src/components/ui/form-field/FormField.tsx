'use client';

import React from 'react';

import { motion } from 'framer-motion';

export interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  required?: boolean;
  error?: string;
  className?: string;
  delay?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  children,
  label,
  required = false,
  error,
  className = '',
  delay = 0
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`w-full ${className}`}
    >
      {label && (
        <label className='text-foreground text-sm font-medium mb-2 block'>
          {label}
          {required && <span className='text-danger ml-1'>*</span>}
        </label>
      )}
      
      {children}
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-danger text-xs mt-1'
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;