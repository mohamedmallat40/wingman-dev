'use client';

import React, { useState, useEffect } from 'react';

import { 
  Button, 
  Card, 
  CardBody, 
  Avatar,
  Badge,
  Chip,
  Input,
  Divider,
  ScrollShadow,
  Tab,
  Tabs
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';

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
        if (Math.random() > 0.7) { // 30% chance every 30 seconds
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
        className={`fixed top-24 right-6 z-50 ${className}`}
        initial={{ scale: 0, opacity: 0, x: 100, y: -50 }}
        animate={{ scale: 1, opacity: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, type: "spring", bounce: 0.4 }}
      >
        <div className="relative">
          {/* Enhanced Floating Button */}
          <motion.div
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -2, 0]
            }}
            transition={{ 
              scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              hover: { duration: 0.2 }
            }}
            className="relative cursor-pointer focus:outline-none"
            onClick={handleToggle}
          >
            {/* Premium Button Container */}
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 ring-2 ring-primary/20 ring-offset-2 ring-offset-background shadow-xl hover:shadow-2xl transition-all duration-300 hover:ring-primary/40">
              {/* Avatar Image */}
              <img
                src="/mr_success_manager.png"
                alt="Mr. Lode Schoors - Success Manager"
                className="w-full h-full object-cover object-center"
              />
              
              {/* Premium Hover Effects */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 hover:opacity-100 transition-all duration-300" />
              <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Enhanced Online Status - Outside container to avoid clipping */}
            <div className="absolute -bottom-1 -right-1 z-20">
              <div className="w-5 h-5 bg-success rounded-full border-2 border-background shadow-lg" />
            </div>

            {/* Floating Glow Effect */}
            <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl scale-110 opacity-0 hover:opacity-50 transition-opacity duration-500" />
          </motion.div>

          {/* Notification Badge */}
          <AnimatePresence>
            {hasNewMessage && !isOpen && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute -top-1 -right-1"
              >
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold animate-pulse">!</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Horizontal Welcome Message */}
          <AnimatePresence>
            {!isOpen && showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0, x: 20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 20, y: 10 }}
                transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
                className="absolute right-24 top-0 z-10"
              >
                <div className="bg-gradient-to-r from-primary-50 via-background/95 to-secondary-50 backdrop-blur-xl rounded-2xl px-8 py-5 min-w-[500px] w-[500px] border border-primary/20 shadow-2xl ring-1 ring-primary/10">
                  
                  {/* Enhanced Horizontal Layout */}
                  <div className="flex gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-xl overflow-hidden ring-2 ring-primary/30 ring-offset-1 ring-offset-background">
                        <img
                          src="/mr_success_manager.png"
                          alt="Mr. Lode Schoors"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                      {/* Top Row: Name + Green Dot + Response Time + Close Button */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <p className="text-foreground font-bold text-base">Mr. Lode Schoors</p>
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="text-default-500 text-sm font-medium">~30s response time</span>
                        </div>
                        <button
                          onClick={handleDismissMessage}
                          className="text-default-400 hover:text-danger transition-colors p-1 hover:bg-danger/10 rounded-lg ml-2"
                        >
                          <Icon icon="solar:close-circle-linear" className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Title Row */}
                      <p className="text-sm font-medium text-primary mb-3">Success Manager</p>
                      
                      {/* Welcome Message */}
                      <p className="text-base text-foreground mb-3 font-semibold">
                        👋 <span className="text-primary">Welcome to Wingman!</span>
                      </p>
                      
                      {/* Description + Action Button */}
                      <div className="flex items-end justify-between">
                        <p className="text-sm text-default-600 leading-relaxed flex-1 mr-4">
                          I'm here to help you find the perfect talent and ensure your project success.
                        </p>
                        <button
                          onClick={handleToggle}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-md flex-shrink-0"
                        >
                          <Icon icon="solar:chat-round-linear" className="h-4 w-4" />
                          <span>Start Chat</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Speech bubble arrow - positioned on the right */}
                  <div className="absolute left-full top-6 -ml-1">
                    <div className="w-0 h-0 border-l-8 border-l-primary-50 border-t-4 border-t-transparent border-b-4 border-b-transparent drop-shadow-sm" />
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
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-xl"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-8 lg:inset-12 z-50 flex items-center justify-center"
            >
              <div className="w-full max-w-6xl h-full max-h-[90vh] bg-background border border-divider rounded-3xl shadow-2xl overflow-hidden flex flex-col">
                
                {/* Header */}
                <div className="flex-shrink-0 px-8 py-6 border-b border-divider bg-gradient-to-r from-background to-background/95">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                          <img
                            src="/mr_success_manager.png"
                            alt="Mr. Lode Schoors"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-background">
                          <div className="w-full h-full bg-success rounded-full animate-ping opacity-75" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h1 className="text-2xl font-bold text-foreground">Mr. Lode Schoors</h1>
                          <Badge color="success" variant="dot" size="sm">Online</Badge>
                        </div>
                        <p className="text-sm text-default-600 flex items-center gap-2">
                          <Icon icon="solar:star-linear" className="h-4 w-4 text-warning" />
                          Your Personal Success Manager
                          <span className="text-success">• ~30s response</span>
                        </p>
                      </div>
                    </div>
                    
                    <Button
                      isIconOnly
                      variant="flat"
                      color="default"
                      size="lg"
                      onClick={() => setIsOpen(false)}
                      className="bg-default-100 hover:bg-danger/20 hover:text-danger border border-divider hover:border-danger/30 transition-all duration-200"
                    >
                      <Icon icon="solar:close-circle-bold" className="h-6 w-6" />
                    </Button>
                  </div>
                </div>

                {/* Chat Content */}
                <div className="flex-1 min-h-0 p-6">
                  <div className="h-full bg-gradient-to-b from-default-50/50 to-background rounded-2xl border border-divider/50 overflow-hidden">
                    <AssistantSidebar
                      className="h-full"
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