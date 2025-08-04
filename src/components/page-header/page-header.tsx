'use client';

import React from 'react';

import { BreadcrumbItem, Breadcrumbs, Button, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  badge?: {
    text: string;
    color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
    variant?: 'flat' | 'solid' | 'bordered' | 'light' | 'faded' | 'shadow';
  };
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    icon?: string;
  }>;
  actions?: React.ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  icon,
  badge,
  breadcrumbs,
  actions,
  className = ''
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`border-divider/50 bg-background/95 relative z-10 w-full border-b backdrop-blur-xl ${className}`}
    >
      {/* Background gradient */}
      <div className='from-primary/5 to-secondary/5 absolute inset-0 bg-gradient-to-r via-transparent opacity-60' />

      <div className='relative px-4 py-6 sm:px-6 lg:px-8'>
        <div className='mx-auto max-w-7xl'>
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className='mb-4'
            >
              <Breadcrumbs
                size='sm'
                classNames={{
                  list: 'gap-2',
                  separator: 'text-default-400'
                }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem
                    key={index}
                    href={crumb.href}
                    startContent={crumb.icon && <Icon icon={crumb.icon} className='h-4 w-4' />}
                  >
                    {crumb.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            </motion.div>
          )}

          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            {/* Title Section */}
            <div className='flex-1'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className='flex items-center gap-4'
              >
                {/* Icon */}
                {icon && (
                  <div className='bg-primary/10 ring-primary/20 flex h-12 w-12 items-center justify-center rounded-2xl ring-1'>
                    <Icon icon={icon} className='text-primary h-6 w-6' />
                  </div>
                )}

                <div className='flex-1'>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl'>
                      {title}
                    </h1>
                    {badge && (
                      <Chip
                        size='sm'
                        color={badge.color || 'primary'}
                        variant={badge.variant || 'flat'}
                        className='ml-2'
                      >
                        {badge.text}
                      </Chip>
                    )}
                  </div>

                  {description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className='text-default-600 mt-2 text-sm sm:text-base'
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Actions */}
            {actions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className='flex flex-shrink-0 items-center gap-3'
              >
                {actions}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
