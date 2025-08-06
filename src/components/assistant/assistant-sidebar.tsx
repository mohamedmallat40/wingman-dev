'use client';

import React, { useEffect, useRef, useState } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  ScrollShadow
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { AnimatePresence, motion } from 'framer-motion';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AssistantSidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const quickActions = [
  {
    id: 1,
    label: 'Find Developers',
    icon: 'solar:users-group-rounded-linear',
    color: 'primary' as const,
    action: 'find-developers'
  },
  {
    id: 2,
    label: 'Project Status',
    icon: 'solar:chart-square-linear',
    color: 'secondary' as const,
    action: 'project-status'
  },
  {
    id: 3,
    label: 'Schedule Meeting',
    icon: 'solar:calendar-linear',
    color: 'success' as const,
    action: 'schedule-meeting'
  },
  {
    id: 4,
    label: 'Get Help',
    icon: 'solar:question-circle-linear',
    color: 'warning' as const,
    action: 'get-help'
  }
];

const sampleMessages: Message[] = [
  {
    id: '1',
    type: 'assistant',
    content: '👋 Hello! I\'m Mr. Lode Schoors, your personal Success Manager at Wingman. I\'m here to help you succeed with your projects and find the perfect talent. How can I assist you today?',
    timestamp: new Date(Date.now() - 60000)
  },
  {
    id: '2',
    type: 'user',
    content: 'I need help finding a React developer for my e-commerce project',
    timestamp: new Date(Date.now() - 30000)
  },
  {
    id: '3',
    type: 'assistant',
    content:
      'Excellent! 🚀 I can help you find experienced React developers perfect for e-commerce projects. Based on your requirements, I recommend looking for developers with experience in payment integration, state management, and performance optimization. Let me guide you through our talent pool!',
    timestamp: new Date(Date.now() - 10000)
  }
];

export default function AssistantSidebar({
  className = '',
  isCollapsed = false,
  onToggleCollapse
}: AssistantSidebarProps) {
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content:
          'Thank you for your question! 💡 I\'m analyzing your request and will get back to you with the perfect solution. Let me connect you with the right resources and talent that match your needs.',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickAction = (action: string) => {
    const actionMessages: Record<string, string> = {
      'find-developers': 'Ik wil graag hulp bij het vinden van ontwikkelaars',
      'project-status': 'Kunt u mij een update geven over mijn projecten?',
      'schedule-meeting': 'Ik wil graag een afspraak inplannen',
      'get-help': 'Ik heb hulp nodig met het platform'
    };

    setInputValue(actionMessages[action] || '');
    inputRef.current?.focus();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isCollapsed) {
    return (
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 'auto', opacity: 1 }}
        className={`flex flex-col ${className}`}
      >
        <Button
          isIconOnly
          variant='light'
          color='primary'
          className='border-primary/20 bg-primary/5 h-12 w-12 rounded-2xl border backdrop-blur-sm'
          onPress={onToggleCollapse}
        >
          <Icon icon='solar:chat-round-linear' className='h-5 w-5' />
        </Button>
      </motion.div>
    );
  }

  return (
    <div className={`flex h-full flex-col ${className}`}>
      {/* Messages Area */}
      <div className='flex min-h-0 flex-1 flex-col'>
        <ScrollShadow className='flex-1 p-4'>
          <div className='space-y-6'>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`flex max-w-[85%] items-start gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {message.type === 'assistant' && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Avatar
                          src='/mr_success_manager.png'
                          alt='Mr. Lode Schoors'
                          size='sm'
                          className='ring-primary/30 flex-shrink-0 ring-2 ring-offset-1 ring-offset-background shadow-medium transition-all duration-300 hover:ring-primary/50'
                          imgProps={{
                            className: 'object-cover'
                          }}
                        />
                      </motion.div>
                    )}
                    <div
                      className={`rounded-2xl px-5 py-4 backdrop-blur-sm transition-all duration-300 hover:shadow-medium ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-primary-600 text-primary-foreground shadow-medium ring-1 ring-primary/20'
                          : 'bg-gradient-to-br from-background/90 to-background/70 border border-divider/50 shadow-soft ring-1 ring-foreground/5 hover:ring-primary/10'
                      }`}
                    >
                      <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                        {message.content}
                      </p>
                      <div className='mt-3 flex items-center justify-between'>
                        <p
                          className={`text-xs ${message.type === 'user' ? 'text-primary-200' : 'text-foreground-500'}`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                        {message.type === 'assistant' && (
                          <div className='flex items-center gap-1'>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='light'
                              className='h-6 w-6 min-w-6 hover:bg-primary/10 transition-all duration-200 hover:scale-110'
                            >
                              <Icon icon='solar:copy-linear' className='h-3 w-3' />
                            </Button>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='light'
                              className='h-6 w-6 min-w-6 hover:bg-success/10 hover:text-success transition-all duration-200 hover:scale-110'
                            >
                              <Icon icon='solar:like-linear' className='h-3 w-3' />
                            </Button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Enhanced Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className='flex justify-start'
              >
                <div className='flex items-start gap-3'>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Avatar
                      src='/mr_success_manager.png'
                      alt='Mr. Lode Schoors'
                      size='sm'
                      className='ring-primary/30 ring-2 ring-offset-1 ring-offset-background shadow-medium transition-all duration-300 hover:ring-primary/50'
                      imgProps={{
                        className: 'object-cover'
                      }}
                    />
                  </motion.div>
                  <div className='bg-gradient-to-br from-background/90 to-background/70 border border-divider/50 shadow-soft rounded-2xl px-5 py-4 ring-1 ring-foreground/5'>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]' />
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]' />
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full' />
                      </div>
                      <span className='text-foreground-500 text-xs'>
                        Mr. Lode Schoors is typing...
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollShadow>

        {/* Premium Input Area */}
        <div className='flex-shrink-0 border-t border-divider/30 bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm px-4 py-3'>
          <div className='space-y-2'>
            {/* Small Quick Actions */}
            <div className='flex gap-1 overflow-x-auto pb-1'>
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant='flat'
                  color={action.color}
                  size='sm'
                  className='min-w-fit whitespace-nowrap h-7 px-2 text-xs transition-all duration-200 hover:scale-105 hover:shadow-small'
                  startContent={<Icon icon={action.icon} className='h-3 w-3' />}
                  onPress={() => handleQuickAction(action.action)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            
            {/* Input Field */}
            <div className='flex items-end gap-3'>
              <div className='flex-1'>
                <Input
                  ref={inputRef}
                  placeholder='Type your message here...'
                  value={inputValue}
                  onValueChange={setInputValue}
                  variant='bordered'
                  size='md'
                  classNames={{
                    input: 'text-sm',
                    inputWrapper:
                      'min-h-12 border-divider/50 hover:border-primary focus-within:border-primary bg-background/50 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 ring-1 ring-foreground/5 focus-within:ring-primary/20'
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  startContent={
                    <Button
                      isIconOnly
                      size='sm'
                      variant='light'
                      className='text-default-400 hover:text-foreground transition-all duration-200 hover:scale-110'
                    >
                      <Icon icon='solar:paperclip-linear' className='h-4 w-4' />
                    </Button>
                  }
                />
              </div>
              <Button
                size='md'
                color='primary'
                isIconOnly
                className='h-12 w-12 transition-all duration-300 hover:shadow-medium hover:scale-105'
                variant={inputValue.trim() ? 'solid' : 'flat'}
                isDisabled={!inputValue.trim()}
                onPress={handleSendMessage}
              >
                <Icon icon='solar:arrow-up-bold' className='h-4 w-4' />
              </Button>
            </div>

            {/* Helper Text - Minimal spacing */}
            <div className='text-foreground-500 flex items-center justify-between text-xs'>
              <span>Press Enter to send, Shift + Enter for new line</span>
              <div className='flex items-center gap-2'>
                <Icon icon='solar:shield-check-linear' className='h-3 w-3' />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
