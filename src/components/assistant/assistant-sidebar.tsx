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
    content: 'Hallo! Ik ben uw persoonlijke Success Manager. Hoe kan ik u vandaag helpen?',
    timestamp: new Date(Date.now() - 60000),
    suggestions: ['Find developers', 'Project updates', 'Schedule meeting']
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
      'Perfect! I can help you find experienced React developers. Based on your e-commerce project requirements, I recommend looking for developers with:',
    timestamp: new Date(Date.now() - 10000),
    suggestions: ['View recommended developers', 'Set project budget', 'Schedule consultation']
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
          'Bedankt voor uw vraag! Ik ga dit voor u uitzoeken en kom snel bij u terug met een passend antwoord.',
        timestamp: new Date(),
        suggestions: ['More details', 'Alternative options', 'Contact specialist']
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
      {/* Enhanced Chat Header */}
      <div className='flex items-center justify-between p-6 pb-4 border-b border-default-200'>
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <Avatar
              src='https://i.pravatar.cc/150?u=assistant'
              size='lg'
              className='ring-2 ring-primary/20 shadow-medium'
            />
            <div className='bg-success ring-background absolute -right-1 -bottom-1 h-4 w-4 rounded-full ring-2' />
          </div>
          <div>
            <h3 className='text-foreground text-xl font-bold tracking-tight'>Success Manager</h3>
            <div className='flex items-center gap-2 mt-1'>
              <div className='bg-success h-2 w-2 animate-pulse rounded-full' />
              <span className='text-sm text-foreground-600 font-medium'>Online • Response time: ~30s</span>
            </div>
          </div>
        </div>
        <Button 
          isIconOnly 
          variant='light' 
          size='sm' 
          onPress={onToggleCollapse}
          className='hover:bg-default-100'
        >
          <Icon icon='solar:minimize-linear' className='h-4 w-4' />
        </Button>
      </div>

      {/* Enhanced Quick Actions */}
      <div className='p-6 pb-4 bg-default-50/50'>
        <div className='flex items-center justify-between mb-4'>
          <h4 className='text-foreground font-semibold'>Quick Actions</h4>
          <Chip size='sm' variant='flat' color='primary'>Most Popular</Chip>
        </div>
        <div className='grid grid-cols-2 gap-3'>
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant='flat'
                color={action.color}
                className='w-full h-auto p-4 flex-col gap-2 bg-background hover:bg-default-100 border border-default-200 shadow-small'
                onPress={() => handleQuickAction(action.action)}
              >
                <Icon icon={action.icon} className='h-6 w-6' />
                <span className='text-sm font-medium'>{action.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Enhanced Messages Area */}
      <div className='flex-1 flex flex-col min-h-0'>
        <ScrollShadow className='flex-1 p-6 pt-4'>
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
                  <div className={`flex items-start gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                    {message.type === 'assistant' && (
                      <Avatar
                        src='https://i.pravatar.cc/150?u=assistant'
                        size='sm'
                        className='ring-1 ring-primary/20 flex-shrink-0'
                      />
                    )}
                    <div
                      className={`rounded-2xl px-5 py-4 shadow-small ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-primary to-primary-600 text-primary-foreground'
                          : 'bg-background border border-default-200'
                      }`}
                    >
                      <p className='text-sm leading-relaxed whitespace-pre-wrap'>{message.content}</p>
                      <div className='flex items-center justify-between mt-3'>
                        <p className={`text-xs ${message.type === 'user' ? 'text-primary-200' : 'text-foreground-500'}`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.type === 'assistant' && (
                          <div className='flex items-center gap-1'>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='light'
                              className='h-6 w-6 min-w-6'
                            >
                              <Icon icon='solar:copy-linear' className='h-3 w-3' />
                            </Button>
                            <Button
                              isIconOnly
                              size='sm'
                              variant='light'
                              className='h-6 w-6 min-w-6'
                            >
                              <Icon icon='solar:like-linear' className='h-3 w-3' />
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className='mt-4 space-y-2'>
                          <p className='text-xs font-medium text-foreground-600'>Suggested actions:</p>
                          <div className='flex flex-wrap gap-2'>
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                size='sm'
                                variant='bordered'
                                className='h-8 px-3 text-xs hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors'
                                onPress={() => setInputValue(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
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
                  <Avatar
                    src='https://i.pravatar.cc/150?u=assistant'
                    size='sm'
                    className='ring-1 ring-primary/20'
                  />
                  <div className='bg-background border border-default-200 rounded-2xl px-5 py-4 shadow-small'>
                    <div className='flex items-center gap-2'>
                      <div className='flex items-center gap-1'>
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]' />
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]' />
                        <div className='bg-primary h-2 w-2 animate-bounce rounded-full' />
                      </div>
                      <span className='text-xs text-foreground-500'>Success Manager is typing...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollShadow>

        {/* Enhanced Input Area */}
        <div className='border-t border-default-200 p-6 bg-background'>
          <div className='space-y-3'>
            {/* Input Field */}
            <div className='flex gap-3 items-end'>
              <div className='flex-1'>
                <Input
                  ref={inputRef}
                  placeholder='Type your message here...'
                  value={inputValue}
                  onValueChange={setInputValue}
                  variant='bordered'
                  size='lg'
                  classNames={{
                    input: 'text-sm',
                    inputWrapper: 'min-h-14 border-default-300 hover:border-primary focus-within:border-primary shadow-small'
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
                      className='text-default-400 hover:text-foreground'
                    >
                      <Icon icon='solar:paperclip-linear' className='h-4 w-4' />
                    </Button>
                  }
                />
              </div>
              <Button
                size='lg'
                color='primary'
                isIconOnly
                className='h-14 w-14 shadow-medium hover:shadow-large transition-shadow'
                variant={inputValue.trim() ? 'solid' : 'flat'}
                isDisabled={!inputValue.trim()}
                onPress={handleSendMessage}
              >
                <Icon icon='solar:arrow-up-bold' className='h-5 w-5' />
              </Button>
            </div>
            
            {/* Helper Text */}
            <div className='flex items-center justify-between text-xs text-foreground-500'>
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
