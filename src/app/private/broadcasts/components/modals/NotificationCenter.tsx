'use client';

import React, { useState, useEffect } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Badge,
  Tabs,
  Tab,
  Divider
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'post' | 'trending' | 'milestone';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high';
  author?: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  postId?: string;
  subcastId?: string;
  actionUrl?: string;
  metadata?: {
    count?: number;
    growth?: number;
    milestone?: string;
  };
}

interface LiveUpdate {
  id: string;
  type: 'new_post' | 'trending_topic' | 'viral_post' | 'subcast_activity';
  content: string;
  timestamp: string;
  subcast?: string;
  postId?: string;
  count?: number;
}

interface TrendingItem {
  id: string;
  name: string;
  type: 'topic' | 'hashtag' | 'subcast';
  count: number;
  growth: number;
  category: string;
}

// Mock data
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'like',
    title: 'New likes on your post',
    message: 'Sarah Chen and 23 others liked your post about "React 19 Features"',
    timestamp: '2 minutes ago',
    isRead: false,
    priority: 'normal',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://i.pravatar.cc/150?img=1',
      verified: true
    },
    postId: 'post-123',
    metadata: { count: 24 }
  },
  {
    id: '2',
    type: 'follow',
    title: 'New follower',
    message: 'Marcus Rodriguez started following you',
    timestamp: '5 minutes ago',
    isRead: false,
    priority: 'normal',
    author: {
      name: 'Marcus Rodriguez',
      avatar: 'https://i.pravatar.cc/150?img=2'
    }
  },
  {
    id: '3',
    type: 'trending',
    title: 'Your post is trending!',
    message: 'Your post "AI in Web Development" is trending in the AI Innovation subcast',
    timestamp: '15 minutes ago',
    isRead: false,
    priority: 'high',
    subcastId: 'ai-innovation',
    postId: 'post-456',
    metadata: { growth: 250 }
  },
  {
    id: '4',
    type: 'comment',
    title: 'New comment',
    message: 'Dr. Emily Watson commented on your post',
    timestamp: '1 hour ago',
    isRead: true,
    priority: 'normal',
    author: {
      name: 'Dr. Emily Watson',
      avatar: 'https://i.pravatar.cc/150?img=3',
      verified: true
    },
    postId: 'post-789'
  },
  {
    id: '5',
    type: 'milestone',
    title: 'Milestone reached!',
    message: 'Congratulations! You\'ve reached 1,000 followers',
    timestamp: '2 hours ago',
    isRead: true,
    priority: 'high',
    metadata: { milestone: '1K followers' }
  }
];

const MOCK_LIVE_UPDATES: LiveUpdate[] = [
  {
    id: '1',
    type: 'new_post',
    content: 'New post in AI Innovation: "GPT-4 API Integration Best Practices"',
    timestamp: '1 minute ago',
    subcast: 'AI Innovation',
    count: 1
  },
  {
    id: '2',
    type: 'trending_topic',
    content: 'React 19 is trending with 89 new posts in the last hour',
    timestamp: '3 minutes ago',
    count: 89
  },
  {
    id: '3',
    type: 'viral_post',
    content: 'Post by Sarah Chen has reached 1K views in Design Trends',
    timestamp: '5 minutes ago',
    subcast: 'Design Trends',
    postId: 'post-viral-123',
    count: 1000
  }
];

const MOCK_TRENDING: TrendingItem[] = [
  { id: '1', name: 'React 19', type: 'topic', count: 234, growth: 45.2, category: 'Development' },
  { id: '2', name: '#AIFirst', type: 'hashtag', count: 189, growth: 32.1, category: 'AI' },
  { id: '3', name: 'Design Systems', type: 'topic', count: 156, growth: 28.7, category: 'Design' },
  { id: '4', name: 'AI Innovation', type: 'subcast', count: 143, growth: 25.3, category: 'AI' },
  { id: '5', name: '#RemoteWork', type: 'hashtag', count: 121, growth: 19.8, category: 'Lifestyle' }
];

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function NotificationCenter({ isOpen, onClose, className = '' }: NotificationCenterProps) {
  const t = useTranslations('broadcasts.notifications');
  
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [liveUpdates, setLiveUpdates] = useState<LiveUpdate[]>(MOCK_LIVE_UPDATES);
  const [trending, setTrending] = useState<TrendingItem[]>(MOCK_TRENDING);
  const [activeTab, setActiveTab] = useState('notifications');
  const [filter, setFilter] = useState('all');

  // Simulate real-time updates
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      // Add random live update
      const updates = [
        {
          id: Date.now().toString(),
          type: 'new_post' as const,
          content: 'New post in Developer Life: "Advanced TypeScript Patterns"',
          timestamp: 'just now',
          subcast: 'Developer Life',
          count: 1
        },
        {
          id: Date.now().toString(),
          type: 'trending_topic' as const,
          content: 'TypeScript is gaining momentum with 45 new posts',
          timestamp: 'just now',
          count: 45
        }
      ];

      const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
      setLiveUpdates(prev => [randomUpdate, ...prev.slice(0, 9)]);
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return 'solar:heart-bold';
      case 'comment':
        return 'solar:chat-round-bold';
      case 'follow':
        return 'solar:user-plus-bold';
      case 'mention':
        return 'solar:mention-circle-bold';
      case 'post':
        return 'solar:document-add-bold';
      case 'trending':
        return 'solar:fire-bold';
      case 'milestone':
        return 'solar:crown-bold';
      default:
        return 'solar:bell-bold';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'like':
        return 'danger';
      case 'comment':
        return 'primary';
      case 'follow':
        return 'success';
      case 'mention':
        return 'warning';
      case 'post':
        return 'secondary';
      case 'trending':
        return 'warning';
      case 'milestone':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getLiveUpdateIcon = (type: string) => {
    switch (type) {
      case 'new_post':
        return 'solar:document-add-linear';
      case 'trending_topic':
        return 'solar:fire-linear';
      case 'viral_post':
        return 'solar:eye-linear';
      case 'subcast_activity':
        return 'solar:users-group-rounded-linear';
      default:
        return 'solar:refresh-linear';
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-background shadow-xl border-l border-default-200"
      >
        <Card className="h-full rounded-none border-none shadow-none">
          <CardBody className="flex flex-col p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-default-200">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Icon icon="solar:bell-bold" className="h-6 w-6 text-primary" />
                  {unreadCount > 0 && (
                    <Badge
                      content={unreadCount > 99 ? '99+' : unreadCount}
                      color="danger"
                      size="sm"
                      className="absolute -top-1 -right-1"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                  <p className="text-sm text-foreground-500">
                    {unreadCount} unread updates
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={onClose}
                >
                  <Icon icon="solar:close-linear" className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs
              selectedKey={activeTab}
              onSelectionChange={(key) => setActiveTab(key as string)}
              variant="underlined"
              className="px-4 pt-2"
              classNames={{
                tabList: "w-full",
                tab: "flex-1"
              }}
            >
              <Tab key="notifications" title="Activity" />
              <Tab key="live" title="Live" />
              <Tab key="trending" title="Trending" />
            </Tabs>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'notifications' && (
                <div className="h-full flex flex-col">
                  {/* Filter */}
                  <div className="p-4 border-b border-default-200">
                    <Dropdown>
                      <DropdownTrigger>
                        <Button
                          variant="flat"
                          size="sm"
                          endContent={<Icon icon="solar:alt-arrow-down-linear" className="h-4 w-4" />}
                        >
                          {filter === 'all' ? 'All notifications' :
                           filter === 'unread' ? 'Unread only' :
                           filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </Button>
                      </DropdownTrigger>
                      <DropdownMenu
                        selectedKeys={[filter]}
                        onSelectionChange={(keys) => setFilter(Array.from(keys)[0] as string)}
                        classNames={{
                          content: "bg-background text-foreground border border-default-200"
                        }}
                      >
                        <DropdownItem key="all" className="text-foreground hover:bg-default-100">All notifications</DropdownItem>
                        <DropdownItem key="unread" className="text-foreground hover:bg-default-100">Unread only</DropdownItem>
                        <DropdownItem key="like" className="text-foreground hover:bg-default-100">Likes</DropdownItem>
                        <DropdownItem key="comment" className="text-foreground hover:bg-default-100">Comments</DropdownItem>
                        <DropdownItem key="follow" className="text-foreground hover:bg-default-100">Follows</DropdownItem>
                        <DropdownItem key="trending" className="text-foreground hover:bg-default-100">Trending</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  {/* Notifications List */}
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                      {filteredNotifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-default-100 p-4 cursor-pointer transition-colors hover:bg-default-50 ${
                            !notification.isRead ? 'bg-primary/5' : ''
                          }`}
                          onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                          <div className="flex gap-3">
                            {/* Icon */}
                            <div className={`flex-shrink-0 rounded-full p-2 bg-${getNotificationColor(notification.type)}/10`}>
                              <Icon
                                icon={getNotificationIcon(notification.type)}
                                className={`h-4 w-4 text-${getNotificationColor(notification.type)}`}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <h4 className={`text-sm font-medium ${!notification.isRead ? 'text-foreground' : 'text-foreground-700'}`}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-foreground-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className="text-xs text-foreground-500">
                                      {notification.timestamp}
                                    </span>
                                    {notification.priority === 'high' && (
                                      <Chip size="sm" color="danger" variant="flat" className="h-4 text-xs">
                                        High priority
                                      </Chip>
                                    )}
                                  </div>
                                </div>

                                {/* Avatar or metadata */}
                                <div className="flex-shrink-0">
                                  {notification.author ? (
                                    <div className="relative">
                                      <Avatar
                                        src={notification.author.avatar}
                                        size="sm"
                                        className="h-8 w-8"
                                      />
                                      {notification.author.verified && (
                                        <div className="absolute -bottom-0.5 -right-0.5 bg-primary rounded-full p-0.5">
                                          <Icon icon="solar:verified-check-bold" className="h-2 w-2 text-white" />
                                        </div>
                                      )}
                                    </div>
                                  ) : notification.metadata?.count && (
                                    <Chip size="sm" variant="flat" className="text-xs">
                                      +{notification.metadata.count}
                                    </Chip>
                                  )}
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-2 mt-3">
                                {notification.actionUrl && (
                                  <Button size="sm" variant="flat" className="h-6 text-xs">
                                    View
                                  </Button>
                                )}
                                {!notification.isRead && (
                                  <div className="w-2 h-2 bg-primary rounded-full" />
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {filteredNotifications.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Icon icon="solar:bell-off-linear" className="h-12 w-12 text-default-400 mb-3" />
                        <p className="text-foreground-500">No notifications found</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'live' && (
                <div className="h-full overflow-y-auto">
                  <div className="p-4 border-b border-default-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span className="text-sm font-medium text-success">Live Updates</span>
                    </div>
                    <p className="text-xs text-foreground-500">
                      Real-time activity from your followed subcasts
                    </p>
                  </div>

                  <div className="space-y-3 p-4">
                    <AnimatePresence>
                      {liveUpdates.map((update, index) => (
                        <motion.div
                          key={update.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20"
                        >
                          <div className="flex-shrink-0 rounded-full p-1.5 bg-success/10">
                            <Icon
                              icon={getLiveUpdateIcon(update.type)}
                              className="h-3 w-3 text-success"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground">{update.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-foreground-500">{update.timestamp}</span>
                              {update.count && (
                                <Chip size="sm" color="success" variant="flat" className="h-4 text-xs">
                                  {update.count}
                                </Chip>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {activeTab === 'trending' && (
                <div className="h-full overflow-y-auto">
                  <div className="p-4 border-b border-default-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon icon="solar:fire-bold" className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium text-foreground">Trending Now</span>
                    </div>
                    <p className="text-xs text-foreground-500">
                      Popular topics and trending content
                    </p>
                  </div>

                  <div className="space-y-3 p-4">
                    {trending.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 rounded-lg border border-default-200 hover:border-warning/50 hover:bg-warning/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-lg font-bold text-foreground-500">
                            #{index + 1}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">
                                {item.name}
                              </span>
                              <Chip size="sm" variant="flat" className="h-4 text-xs">
                                {item.type}
                              </Chip>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-foreground-500">
                                {item.count} posts
                              </span>
                              <span className="text-xs text-foreground-400">•</span>
                              <span className="text-xs text-foreground-500">
                                {item.category}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Chip
                            size="sm"
                            color="warning"
                            variant="flat"
                            startContent={<Icon icon="solar:arrow-up-linear" className="h-2 w-2" />}
                            className="h-5 text-xs"
                          >
                            +{item.growth}%
                          </Chip>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
