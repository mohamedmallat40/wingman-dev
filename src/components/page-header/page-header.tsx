'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

interface ActionConfig {
  key: string;
  label: string;
  icon?: string;
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  variant?: 'solid' | 'bordered' | 'light' | 'flat' | 'faded' | 'shadow' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isLoading?: boolean;
  tooltip?: string;
  confirmMessage?: string;
  priority?: 'primary' | 'secondary' | 'tertiary';
  onClick?: () => void | Promise<void>;
}

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
  actionItems?: ActionConfig[];
  maxVisibleActions?: number;
  className?: string;
}

const ActionButton: React.FC<{
  action: ActionConfig;
  index: number;
}> = ({ action, index }) => {
  const [isLoading, setIsLoading] = useState(action.isLoading || false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = async () => {
    if (action.confirmMessage && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (action.onClick) {
      setIsLoading(true);
      try {
        await action.onClick();
      } finally {
        setIsLoading(false);
        setShowConfirm(false);
      }
    }
  };

  const buttonContent = (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        key={action.key}
        color={action.color || 'default'}
        variant={action.variant || 'solid'}
        size={action.size || 'sm'}
        isDisabled={action.isDisabled}
        isLoading={isLoading}
        startContent={
          action.icon && !isLoading ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined
        }
        onClick={handleClick}
        className='transition-all duration-200 hover:shadow-md'
        aria-label={action.tooltip || action.label}
      >
        {showConfirm ? 'Confirm?' : action.label}
      </Button>
    </motion.div>
  );

  if (action.tooltip) {
    return (
      <Tooltip content={action.tooltip} placement='bottom'>
        {buttonContent}
      </Tooltip>
    );
  }

  return buttonContent;
};

const ActionGroup: React.FC<{
  actions: ActionConfig[];
  maxVisible: number;
}> = ({ actions, maxVisible }) => {
  const visibleActions = actions.slice(0, maxVisible);
  const hiddenActions = actions.slice(maxVisible);

  return (
    <div className='flex items-center gap-3'>
      <AnimatePresence mode='wait'>
        {visibleActions.map((action, index) => (
          <ActionButton key={action.key} action={action} index={index} />
        ))}
      </AnimatePresence>

      {hiddenActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: visibleActions.length * 0.1, duration: 0.3 }}
        >
          <Dropdown placement='bottom-end'>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant='flat'
                size='sm'
                className='min-w-8 transition-all duration-200 hover:shadow-md'
                aria-label='More actions'
              >
                <Icon icon='solar:menu-dots-linear' className='h-4 w-4' />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label='Additional actions' variant='flat' className='min-w-48'>
              {hiddenActions.map((action) => (
                <DropdownItem
                  key={action.key}
                  startContent={
                    action.icon ? <Icon icon={action.icon} className='h-4 w-4' /> : undefined
                  }
                  color={action.color}
                  className='gap-3'
                  isDisabled={action.isDisabled}
                  onClick={() => action.onClick?.()}
                >
                  {action.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </motion.div>
      )}
    </div>
  );
};

export default function PageHeader({
  title,
  description,
  icon,
  badge,
  breadcrumbs,
  actions,
  actionItems,
  maxVisibleActions = 3,
  className = ''
}: PageHeaderProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (actionsRef.current) {
        setContainerWidth(actionsRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const getResponsiveMaxActions = () => {
    if (containerWidth < 480) return 1;
    if (containerWidth < 768) return 2;
    return maxVisibleActions;
  };

  const sortedActions = actionItems?.sort((a, b) => {
    const priorityOrder = { primary: 0, secondary: 1, tertiary: 2 };
    const aPriority = priorityOrder[a.priority || 'secondary'];
    const bPriority = priorityOrder[b.priority || 'secondary'];
    return aPriority - bPriority;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`border-divider/50 bg-background/97 relative z-20 w-full border-b backdrop-blur-xl ${className}`}
    >
      {/* Enhanced Background Gradient */}
      <div className='from-primary/6 via-primary/3 to-secondary/6 absolute inset-0 bg-gradient-to-r opacity-70' />
      
      {/* Subtle Pattern Overlay */}
      <div className='absolute inset-0 opacity-40'>
        <div className='bg-primary/5 absolute top-0 left-1/4 h-20 w-20 rounded-full blur-2xl' />
        <div className='bg-secondary/5 absolute top-0 right-1/3 h-16 w-16 rounded-full blur-2xl' />
      </div>

      <div className='relative py-8 sm:py-10 lg:py-12'>
        <div className='mx-auto w-full px-4 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
          {/* Enhanced Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className='mb-6'
            >
              <Breadcrumbs
                size='sm'
                classNames={{
                  list: 'gap-3',
                  separator: 'text-default-400 mx-1'
                }}
              >
                {breadcrumbs.map((crumb, index) => (
                  <BreadcrumbItem
                    key={index}
                    href={crumb.href}
                    startContent={crumb.icon && <Icon icon={crumb.icon} className='h-4 w-4' />}
                    className='flex items-center gap-2'
                  >
                    {crumb.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumbs>
            </motion.div>
          )}

          <div className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between lg:gap-8'>
            {/* Enhanced Title Section */}
            <div className='flex-1 min-w-0'>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className='flex items-center gap-4 lg:gap-6'
              >
                {/* Enhanced Icon */}
                {icon && (
                  <div className='bg-primary/15 ring-primary/25 ring-offset-background/50 flex h-14 w-14 items-center justify-center rounded-2xl ring-2 ring-offset-2 shadow-lg lg:h-16 lg:w-16'>
                    <Icon icon={icon} className='text-primary h-7 w-7 lg:h-8 lg:w-8' />
                  </div>
                )}

                <div className='flex-1 min-w-0'>
                  <div className='flex items-center gap-4 flex-wrap'>
                    <h1 className='text-foreground text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl'>
                      {title}
                    </h1>
                    {badge && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.3 }}
                      >
                        <Chip
                          size='md'
                          color={badge.color || 'primary'}
                          variant={badge.variant || 'flat'}
                          className='shadow-small'
                        >
                          {badge.text}
                        </Chip>
                      </motion.div>
                    )}
                  </div>

                  {description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4, duration: 0.4 }}
                      className='text-default-600 mt-3 text-sm leading-relaxed sm:text-base lg:text-lg lg:mt-4'
                    >
                      {description}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Enhanced Actions */}
            {(actions || actionItems) && (
              <motion.div
                ref={actionsRef}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className='flex flex-shrink-0 items-center gap-3 sm:gap-4'
              >
                {actionItems && sortedActions ? (
                  <ActionGroup actions={sortedActions} maxVisible={getResponsiveMaxActions()} />
                ) : (
                  actions
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
