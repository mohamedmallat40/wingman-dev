'use client';

import React, { useEffect, useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  Chip,
  Divider,
  Input,
  ScrollShadow,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

import AssistantSidebar from '@/components/assistant/assistant-sidebar';

interface FloatingSuccessManagerProps {
  className?: string;
}

const FloatingSuccessManager: React.FC<FloatingSuccessManagerProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);

  // Show welcome message on every page refresh
  useEffect(() => {
    // Always show the welcome message on page load
    console.log('Showing welcome message on page load'); // Debug log
    setShowPulse(true);
    setShowWelcomeMessage(true);

    const timer = setTimeout(() => {
      setShowPulse(false);
      setShowWelcomeMessage(false);
      console.log('Auto-hiding welcome message'); // Debug log
    }, 8000); // Show for 8 seconds on every visit

    return () => clearTimeout(timer);
  }, []);

  // Simulate periodic new messages
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        if (Math.random() > 0.7) {
          // 30% chance every 30 seconds
          setHasNewMessage(true);
          setShowPulse(true);
          setTimeout(() => setShowPulse(false), 3000);
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasNewMessage(false);
      setShowPulse(false);
      setShowWelcomeMessage(false);
    }
  };

  const handleDismissMessage = () => {
    setShowWelcomeMessage(false);
    setShowPulse(false);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className={`fixed right-6 bottom-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0, x: 100, y: 50 }}
        animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <div className='relative'>
          {/* Enhanced Floating Button */}
          <motion.div
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -2, 0]
            }}
            transition={{
              scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              hover: { duration: 0.2 }
            }}
            className='relative cursor-pointer focus:outline-none'
            onClick={handleToggle}
          >
            {/* Premium Button Container */}
            <div className='from-primary/10 to-secondary/10 ring-primary/20 ring-offset-background hover:ring-primary/40 relative h-20 w-20 overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl ring-2 ring-offset-2 transition-all duration-300 hover:shadow-2xl'>
              {/* Avatar Image */}
              <img
                src='/mr_success_manager.png'
                alt='Mr. Lode Schoors - Success Manager'
                className='h-full w-full object-cover object-center'
              />

              {/* Premium Hover Effects */}
              <div className='from-primary/20 absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-0 transition-all duration-300 hover:opacity-100' />
              <div className='absolute inset-0 rounded-2xl opacity-0 ring-1 ring-white/20 transition-opacity duration-300 ring-inset hover:opacity-100' />
            </div>

            {/* Enhanced Online Status - Outside container to avoid clipping */}
            <div className='absolute -right-1 -bottom-1 z-20'>
              <div className='bg-success border-background h-5 w-5 rounded-full border-2 shadow-lg' />
            </div>

            {/* Floating Glow Effect */}
            <div className='bg-primary/20 absolute inset-0 scale-110 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 hover:opacity-50' />
          </motion.div>

          {/* Notification Badge */}
          <AnimatePresence>
            {hasNewMessage && !isOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className='absolute -top-1 -right-1'
              >
                <div className='flex h-6 w-6 items-center justify-center rounded-full bg-red-500'>
                  <span className='animate-pulse text-xs font-bold text-white'>!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal Welcome Message */}
          <AnimatePresence>
            {!isOpen && showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -20, y: 10 }}
                transition={{ delay: 1.5, duration: 0.5, ease: 'easeOut' }}
                className='absolute top-0 right-24 z-10'
              >
                <div className='from-primary-50 via-background/95 to-secondary-50 border-primary/20 ring-primary/10 w-[500px] min-w-[500px] rounded-2xl border bg-gradient-to-r px-8 py-5 shadow-2xl ring-1 backdrop-blur-xl'>
                  {/* Enhanced Horizontal Layout */}
                  <div className='flex gap-4'>
                    {/* Avatar */}
                    <div className='flex-shrink-0'>
                      <div className='ring-primary/30 ring-offset-background h-14 w-14 overflow-hidden rounded-xl ring-2 ring-offset-1'>
                        <img
                          src='/mr_success_manager.png'
                          alt='Mr. Lode Schoors'
                          className='h-full w-full object-cover'
                        />
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className='min-w-0 flex-1'>
                      {/* Top Row: Name + Green Dot + Response Time + Close Button */}
                      <div className='mb-1 flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <p className='text-foreground text-base font-bold'>Mr. Lode Schoors</p>
                          <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
                          <span className='text-default-500 text-sm font-medium'>
                            ~30s response time
                          </span>
                        </div>
                        <button
                          onClick={handleDismissMessage}
                          className='text-default-400 hover:text-danger hover:bg-danger/10 ml-2 rounded-lg p-1 transition-colors'
                        >
                          <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                        </button>
                      </div>

                      {/* Title Row */}
                      <p className='text-primary mb-3 text-sm font-medium'>Success Manager</p>

                      {/* Welcome Message */}
                      <p className='text-foreground mb-3 text-base font-semibold'>
                        👋 <span className='text-primary'>Welcome to Wingman!</span>
                      </p>

                      {/* Description + Action Button */}
                      <div className='flex items-end justify-between'>
                        <p className='text-default-600 mr-4 flex-1 text-sm leading-relaxed'>
                          I'm here to help you find the perfect talent and ensure your project
                          success.
                        </p>
                        <button
                          onClick={handleToggle}
                          className='bg-primary text-primary-foreground hover:bg-primary/90 flex flex-shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold shadow-md transition-colors'
                        >
                          <Icon icon='solar:chat-round-linear' className='h-4 w-4' />
                          <span>Start Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Speech bubble arrow - positioned on the right */}
                  <div className='absolute top-6 left-full -ml-1'>
                    <div className='border-l-primary-50 h-0 w-0 border-t-4 border-b-4 border-l-8 border-t-transparent border-b-transparent drop-shadow-sm' />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Success Manager Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='bg-background/80 fixed inset-0 z-40 backdrop-blur-xl'
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className='fixed inset-4 z-50 flex items-center justify-center md:inset-8 lg:inset-12'
            >
              <div className='bg-background border-divider flex h-full max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border shadow-2xl'>
                {/* Header */}
                <div className='border-divider from-background to-background/95 flex-shrink-0 border-b bg-gradient-to-r px-8 py-6'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='relative'>
                        <div className='ring-primary/20 ring-offset-background h-16 w-16 overflow-hidden rounded-2xl ring-2 ring-offset-2'>
                          <img
                            src='/mr_success_manager.png'
                            alt='Mr. Lode Schoors'
                            className='h-full w-full object-cover'
                          />
                        </div>
                        <div className='bg-success border-background absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2'>
                          <div className='bg-success h-full w-full animate-ping rounded-full opacity-75' />
                        </div>
                      </div>

                      <div>
                        <div className='mb-1 flex items-center gap-3'>
                          <h1 className='text-foreground text-2xl font-bold'>Mr. Lode Schoors</h1>
                          <Badge color='success' variant='flat' size='sm'>
                            Online
                          </Badge>
                        </div>
                        <p className='text-default-600 flex items-center gap-2 text-sm'>
                          <Icon icon='solar:star-linear' className='text-warning h-4 w-4' />
                          Your Personal Success Manager
                          <span className='text-success'>• ~30s response</span>
                        </p>
                      </div>
                    </div>

                    <Button
                      isIconOnly
                      variant='flat'
                      color='default'
                      size='lg'
                      onClick={() => setIsOpen(false)}
                      className='bg-default-100 hover:bg-danger/20 hover:text-danger border-divider hover:border-danger/30 border transition-all duration-200'
                    >
                      <Icon icon='solar:close-circle-bold' className='h-6 w-6' />
                    </Button>
                  </div>
                </div>

                {/* Chat Content */}
                <div className='min-h-0 flex-1 p-6'>
                  <div className='from-default-50/50 to-background border-divider/50 h-full overflow-hidden rounded-2xl border bg-gradient-to-b'>
                    <AssistantSidebar
                      className='h-full'
                      isCollapsed={false}
                      onToggleCollapse={() => setIsOpen(false)}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingSuccessManager;
