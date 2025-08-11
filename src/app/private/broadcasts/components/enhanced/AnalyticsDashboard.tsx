'use client';

import React, { useState, useMemo } from 'react';

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  Select,
  SelectItem,
  Tabs,
  Tab,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  Line, 
  LineChart,
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  XAxis, 
  YAxis,
  Legend
} from 'recharts';

interface PostAnalytics {
  id: string;
  title: string;
  type: 'article' | 'video' | 'image' | 'poll' | 'quote';
  publishedAt: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    bookmarks: number;
    clickthrough: number;
    engagementRate: number;
    reachRate: number;
  };
  demographics: {
    topCountries: Array<{ name: string; percentage: number }>;
    ageGroups: Array<{ range: string; percentage: number }>;
    deviceTypes: Array<{ type: string; percentage: number }>;
  };
  performance: {
    peakHour: number;
    avgTimeSpent: number;
    bounceRate: number;
    viralityScore: number;
  };
  subcast?: string;
  tags: string[];
}

interface AnalyticsDashboardProps {
  userId?: string;
  timeRange?: '7d' | '30d' | '90d' | '1y';
  className?: string;
}

// Mock analytics data
const MOCK_POSTS: PostAnalytics[] = [
  {
    id: '1',
    title: 'The Future of AI in Web Development',
    type: 'video',
    publishedAt: '2024-01-15',
    subcast: 'AI Innovation',
    tags: ['AI', 'Web Development', 'Technology'],
    metrics: {
      views: 4567,
      likes: 342,
      comments: 89,
      shares: 45,
      bookmarks: 123,
      clickthrough: 234,
      engagementRate: 7.5,
      reachRate: 23.4
    },
    demographics: {
      topCountries: [
        { name: 'United States', percentage: 35 },
        { name: 'Germany', percentage: 18 },
        { name: 'United Kingdom', percentage: 12 },
        { name: 'Canada', percentage: 10 },
        { name: 'Netherlands', percentage: 8 }
      ],
      ageGroups: [
        { range: '18-24', percentage: 15 },
        { range: '25-34', percentage: 45 },
        { range: '35-44', percentage: 28 },
        { range: '45-54', percentage: 12 }
      ],
      deviceTypes: [
        { type: 'Desktop', percentage: 52 },
        { type: 'Mobile', percentage: 43 },
        { type: 'Tablet', percentage: 5 }
      ]
    },
    performance: {
      peakHour: 14,
      avgTimeSpent: 180,
      bounceRate: 25,
      viralityScore: 8.2
    }
  },
  {
    id: '2',
    title: 'Building Resilient Design Systems',
    type: 'article',
    publishedAt: '2024-01-12',
    subcast: 'Design Trends',
    tags: ['Design Systems', 'UI/UX'],
    metrics: {
      views: 2341,
      likes: 189,
      comments: 34,
      shares: 22,
      bookmarks: 91,
      clickthrough: 156,
      engagementRate: 9.2,
      reachRate: 18.7
    },
    demographics: {
      topCountries: [
        { name: 'United States', percentage: 40 },
        { name: 'United Kingdom', percentage: 22 },
        { name: 'Germany', percentage: 15 },
        { name: 'France', percentage: 12 },
        { name: 'Spain', percentage: 6 }
      ],
      ageGroups: [
        { range: '18-24', percentage: 22 },
        { range: '25-34', percentage: 48 },
        { range: '35-44', percentage: 25 },
        { range: '45-54', percentage: 5 }
      ],
      deviceTypes: [
        { type: 'Desktop', percentage: 68 },
        { type: 'Mobile', percentage: 28 },
        { type: 'Tablet', percentage: 4 }
      ]
    },
    performance: {
      peakHour: 10,
      avgTimeSpent: 320,
      bounceRate: 18,
      viralityScore: 6.8
    }
  }
];

const ENGAGEMENT_TIMELINE = [
  { date: '2024-01-08', views: 120, likes: 15, comments: 3, shares: 2 },
  { date: '2024-01-09', views: 289, likes: 34, comments: 8, shares: 5 },
  { date: '2024-01-10', views: 456, likes: 67, comments: 12, shares: 8 },
  { date: '2024-01-11', views: 678, likes: 89, comments: 18, shares: 12 },
  { date: '2024-01-12', views: 834, likes: 112, comments: 25, shares: 16 },
  { date: '2024-01-13', views: 567, likes: 78, comments: 15, shares: 9 },
  { date: '2024-01-14', views: 345, likes: 45, comments: 9, shares: 6 }
];

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

export default function AnalyticsDashboard({ 
  userId,
  timeRange = '30d',
  className = ''
}: AnalyticsDashboardProps) {
  const t = useTranslations('broadcasts.analytics');
  
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Calculate summary metrics
  const summaryMetrics = useMemo(() => {
    const totalViews = MOCK_POSTS.reduce((sum, post) => sum + post.metrics.views, 0);
    const totalLikes = MOCK_POSTS.reduce((sum, post) => sum + post.metrics.likes, 0);
    const totalComments = MOCK_POSTS.reduce((sum, post) => sum + post.metrics.comments, 0);
    const totalShares = MOCK_POSTS.reduce((sum, post) => sum + post.metrics.shares, 0);
    const avgEngagement = MOCK_POSTS.reduce((sum, post) => sum + post.metrics.engagementRate, 0) / MOCK_POSTS.length;
    
    return {
      totalViews,
      totalLikes,
      totalComments,
      totalShares,
      avgEngagement,
      totalPosts: MOCK_POSTS.length,
      followers: 1247,
      followersGrowth: 12.5
    };
  }, []);

  // Top performing posts
  const topPosts = useMemo(() => {
    return [...MOCK_POSTS].sort((a, b) => b.metrics.views - a.metrics.views).slice(0, 5);
  }, []);

  // Content type performance
  const contentTypeData = useMemo(() => {
    const typeMetrics = MOCK_POSTS.reduce((acc, post) => {
      if (!acc[post.type]) {
        acc[post.type] = { views: 0, engagement: 0, count: 0 };
      }
      acc[post.type].views += post.metrics.views;
      acc[post.type].engagement += post.metrics.engagementRate;
      acc[post.type].count += 1;
      return acc;
    }, {} as Record<string, { views: number; engagement: number; count: number }>);

    return Object.entries(typeMetrics).map(([type, metrics]) => ({
      type,
      views: metrics.views,
      avgEngagement: metrics.engagement / metrics.count,
      count: metrics.count
    }));
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'video': return 'solar:videocamera-record-bold';
      case 'image': return 'solar:gallery-bold';
      case 'article': return 'solar:document-text-bold';
      case 'poll': return 'solar:chart-2-bold';
      case 'quote': return 'solar:quote-down-bold';
      default: return 'solar:document-bold';
    }
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return 'solar:arrow-up-linear';
    if (growth < 0) return 'solar:arrow-down-linear';
    return 'solar:minus-linear';
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-success';
    if (growth < 0) return 'text-danger';
    return 'text-foreground-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-foreground-500">Track your content performance and audience insights</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            selectedKeys={[selectedTimeRange]}
            onSelectionChange={(keys) => setSelectedTimeRange(Array.from(keys)[0] as string)}
            className="w-32"
            size="sm"
          >
            <SelectItem key="7d">Last 7 days</SelectItem>
            <SelectItem key="30d">Last 30 days</SelectItem>
            <SelectItem key="90d">Last 90 days</SelectItem>
            <SelectItem key="1y">Last year</SelectItem>
          </Select>
          <Button
            startContent={<Icon icon="solar:download-linear" className="h-4 w-4" />}
            variant="flat"
            size="sm"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Total Views</p>
                <p className="text-2xl font-bold text-foreground">{formatNumber(summaryMetrics.totalViews)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon={getGrowthIcon(15.2)} className={`h-3 w-3 ${getGrowthColor(15.2)}`} />
                  <span className={`text-xs ${getGrowthColor(15.2)}`}>+15.2%</span>
                </div>
              </div>
              <div className="bg-primary/10 rounded-full p-3">
                <Icon icon="solar:eye-bold" className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Engagement Rate</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.avgEngagement.toFixed(1)}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon={getGrowthIcon(8.7)} className={`h-3 w-3 ${getGrowthColor(8.7)}`} />
                  <span className={`text-xs ${getGrowthColor(8.7)}`}>+8.7%</span>
                </div>
              </div>
              <div className="bg-success/10 rounded-full p-3">
                <Icon icon="solar:heart-bold" className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Followers</p>
                <p className="text-2xl font-bold text-foreground">{formatNumber(summaryMetrics.followers)}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon={getGrowthIcon(summaryMetrics.followersGrowth)} className={`h-3 w-3 ${getGrowthColor(summaryMetrics.followersGrowth)}`} />
                  <span className={`text-xs ${getGrowthColor(summaryMetrics.followersGrowth)}`}>+{summaryMetrics.followersGrowth}%</span>
                </div>
              </div>
              <div className="bg-warning/10 rounded-full p-3">
                <Icon icon="solar:users-group-rounded-bold" className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-500">Total Posts</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalPosts}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Icon icon={getGrowthIcon(25)} className={`h-3 w-3 ${getGrowthColor(25)}`} />
                  <span className={`text-xs ${getGrowthColor(25)}`}>+25%</span>
                </div>
              </div>
              <div className="bg-secondary/10 rounded-full p-3">
                <Icon icon="solar:document-text-bold" className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Main Analytics */}
      <Tabs
        selectedKey={activeTab}
        onSelectionChange={(key) => setActiveTab(key as string)}
        variant="underlined"
        className="w-full"
      >
        <Tab key="overview" title="Overview">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mt-6">
            {/* Engagement Timeline */}
            <Card className="xl:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold">Engagement Over Time</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ENGAGEMENT_TIMELINE}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Area type="monotone" dataKey="views" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="likes" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="comments" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* Content Type Performance */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Content Performance</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="views"
                      label={({ type, views }) => `${type}: ${formatNumber(views)}`}
                    >
                      {contentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>

          {/* Top Posts */}
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold">Top Performing Posts</h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                {topPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-lg border border-default-200 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedPost(post.id)}
                  >
                    <div className="flex-shrink-0">
                      <div className="text-xl font-bold text-foreground-500 w-6">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Icon icon={getPostIcon(post.type)} className="h-5 w-5 text-primary" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{post.title}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-foreground-500">{post.publishedAt}</span>
                        {post.subcast && (
                          <Chip size="sm" variant="flat" className="text-xs">{post.subcast}</Chip>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{formatNumber(post.metrics.views)}</div>
                        <div className="text-foreground-500">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{post.metrics.engagementRate.toFixed(1)}%</div>
                        <div className="text-foreground-500">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-foreground">{formatNumber(post.metrics.likes)}</div>
                        <div className="text-foreground-500">Likes</div>
                      </div>
                    </div>

                    <Icon icon="solar:alt-arrow-right-linear" className="h-5 w-5 text-foreground-400" />
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </Tab>

        <Tab key="audience" title="Audience">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Demographics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Audience Demographics</h3>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Age Groups */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Age Distribution</h4>
                  <div className="space-y-2">
                    {MOCK_POSTS[0].demographics.ageGroups.map((group) => (
                      <div key={group.range} className="flex items-center justify-between">
                        <span className="text-sm text-foreground-600">{group.range}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={group.percentage}
                            className="w-20"
                            size="sm"
                            color="primary"
                          />
                          <span className="text-sm font-medium w-8">{group.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Device Types */}
                <div>
                  <h4 className="text-sm font-medium mb-3">Device Usage</h4>
                  <div className="space-y-2">
                    {MOCK_POSTS[0].demographics.deviceTypes.map((device) => (
                      <div key={device.type} className="flex items-center justify-between">
                        <span className="text-sm text-foreground-600">{device.type}</span>
                        <div className="flex items-center gap-2">
                          <Progress
                            value={device.percentage}
                            className="w-20"
                            size="sm"
                            color="secondary"
                          />
                          <span className="text-sm font-medium w-8">{device.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Geographic Distribution */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Geographic Distribution</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  {MOCK_POSTS[0].demographics.topCountries.map((country, index) => (
                    <div key={country.name} className="flex items-center gap-3">
                      <div className="text-sm font-medium text-foreground-500 w-4">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">{country.name}</span>
                          <span className="text-sm text-foreground-500">{country.percentage}%</span>
                        </div>
                        <Progress
                          value={country.percentage}
                          maxValue={50}
                          size="sm"
                          color="success"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Engagement Patterns */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <h3 className="text-lg font-semibold">Engagement Patterns</h3>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={ENGAGEMENT_TIMELINE}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="likes" fill="#EF4444" />
                    <Bar dataKey="comments" fill="#10B981" />
                    <Bar dataKey="shares" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </div>
        </Tab>

        <Tab key="content" title="Content Performance">
          <div className="space-y-6 mt-6">
            {/* Content Type Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {contentTypeData.map((type, index) => (
                <Card key={type.type}>
                  <CardBody className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <Icon icon={getPostIcon(type.type)} className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold capitalize">{type.type}</h3>
                        <p className="text-sm text-foreground-500">{type.count} posts</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground-600">Total Views</span>
                        <span className="text-sm font-medium">{formatNumber(type.views)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-foreground-600">Avg. Engagement</span>
                        <span className="text-sm font-medium">{type.avgEngagement.toFixed(1)}%</span>
                      </div>
                      <Progress
                        value={type.avgEngagement}
                        maxValue={15}
                        size="sm"
                        color="primary"
                        className="mt-2"
                      />
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Detailed Post Analytics */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold">Post Performance Details</h3>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-default-200">
                        <th className="text-left py-3 px-4 font-medium">Post</th>
                        <th className="text-left py-3 px-4 font-medium">Type</th>
                        <th className="text-left py-3 px-4 font-medium">Published</th>
                        <th className="text-left py-3 px-4 font-medium">Views</th>
                        <th className="text-left py-3 px-4 font-medium">Engagement</th>
                        <th className="text-left py-3 px-4 font-medium">Performance</th>
                        <th className="text-left py-3 px-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_POSTS.map((post) => (
                        <tr key={post.id} className="border-b border-default-100 hover:bg-default-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 rounded p-1">
                                <Icon icon={getPostIcon(post.type)} className="h-4 w-4 text-primary" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium text-foreground truncate max-w-xs">{post.title}</p>
                                {post.subcast && (
                                  <p className="text-xs text-foreground-500">{post.subcast}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Chip size="sm" variant="flat" className="capitalize">
                              {post.type}
                            </Chip>
                          </td>
                          <td className="py-4 px-4 text-sm text-foreground-600">
                            {post.publishedAt}
                          </td>
                          <td className="py-4 px-4 text-sm font-medium">
                            {formatNumber(post.metrics.views)}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-xs text-foreground-500">
                                <Icon icon="solar:heart-linear" className="h-3 w-3" />
                                {formatNumber(post.metrics.likes)}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-foreground-500">
                                <Icon icon="solar:chat-round-linear" className="h-3 w-3" />
                                {post.metrics.comments}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-foreground-500">
                                <Icon icon="solar:share-linear" className="h-3 w-3" />
                                {post.metrics.shares}
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                post.performance.viralityScore > 7 ? 'bg-success' :
                                post.performance.viralityScore > 5 ? 'bg-warning' : 'bg-default-400'
                              }`} />
                              <span className="text-sm font-medium">
                                {post.performance.viralityScore.toFixed(1)}/10
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              onPress={() => setSelectedPost(post.id)}
                            >
                              <Icon icon="solar:eye-linear" className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          </div>
        </Tab>
      </Tabs>
    </div>
  );
}
