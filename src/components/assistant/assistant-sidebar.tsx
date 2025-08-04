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
    <motion.div
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 400, opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`flex h-full flex-col ${className}`}
    >
      <Card className='border-divider/50 bg-background/95 flex h-full flex-col rounded-3xl border shadow-xl backdrop-blur-xl'>
        {/* Header */}
        <CardHeader className='flex items-center justify-between p-6 pb-4'>
          <div className='flex items-center gap-3'>
            <div className='relative'>
              <Avatar
                src='https://i.pravatar.cc/150?u=assistant'
                size='sm'
                className='ring-primary/20 ring-2'
              />
              <div className='bg-success ring-background absolute -right-1 -bottom-1 h-3 w-3 rounded-full ring-2' />
            </div>
            <div>
              <h3 className='text-foreground text-lg font-semibold'>Success Manager</h3>
              <Chip
                size='sm'
                color='success'
                variant='flat'
                startContent={<div className='bg-success h-2 w-2 animate-pulse rounded-full' />}
              >
                Online
              </Chip>
            </div>
          </div>
          <Button isIconOnly variant='light' size='sm' onPress={onToggleCollapse}>
            <Icon icon='solar:minimize-linear' className='h-4 w-4' />
          </Button>
        </CardHeader>

        <Divider />

        {/* Quick Actions */}
        <div className='p-4'>
          <p className='text-foreground mb-3 text-sm font-medium'>Snelle Acties</p>
          <div className='grid grid-cols-2 gap-2'>
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Button
                  size='sm'
                  variant='flat'
                  color={action.color}
                  startContent={<Icon icon={action.icon} className='h-4 w-4' />}
                  className='h-auto min-h-0 flex-col gap-1 p-3 text-xs'
                  onPress={() => handleQuickAction(action.action)}
                >
                  {action.label}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>

        <Divider />

        {/* Messages */}
        <CardBody className='flex-1 p-0'>
          <ScrollShadow className='flex-1 p-4'>
            <div className='space-y-4'>
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                        message.type === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-default-100 text-foreground'
                      }`}
                    >
                      <p className='text-sm leading-relaxed'>{message.content}</p>
                      <p className={`mt-1 text-xs opacity-70`}>{formatTime(message.timestamp)}</p>

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className='mt-3 flex flex-wrap gap-2'>
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              size='sm'
                              variant='bordered'
                              className='h-6 min-h-0 px-2 text-xs'
                              onPress={() => setInputValue(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className='flex justify-start'
                >
                  <div className='bg-default-100 rounded-2xl px-4 py-3'>
                    <div className='flex items-center gap-1'>
                      <div className='bg-default-400 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.3s]' />
                      <div className='bg-default-400 h-2 w-2 animate-bounce rounded-full [animation-delay:-0.15s]' />
                      <div className='bg-default-400 h-2 w-2 animate-bounce rounded-full' />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollShadow>

          {/* Input */}
          <div className='border-divider/50 border-t p-4'>
            <div className='flex gap-2'>
              <Input
                ref={inputRef}
                placeholder='Stel een vraag...'
                value={inputValue}
                onValueChange={setInputValue}
                classNames={{
                  input: 'text-sm',
                  inputWrapper: 'h-12 border-default-300'
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                endContent={
                  <Button
                    isIconOnly
                    size='sm'
                    color='primary'
                    variant={inputValue.trim() ? 'solid' : 'light'}
                    isDisabled={!inputValue.trim()}
                    onPress={handleSendMessage}
                  >
                    <Icon icon='solar:arrow-up-linear' className='h-4 w-4' />
                  </Button>
                }
              />
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
