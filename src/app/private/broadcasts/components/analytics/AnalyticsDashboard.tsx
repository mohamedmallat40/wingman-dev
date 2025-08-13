'use client';

import React, { useState } from 'react';

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Chip,
  Divider,
  Progress
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';

import { useUserAnalytics, usePostAnalytics } from '../../hooks';
import { useBroadcastAnalytics } from '../../store/useBroadcastStore';
import { formatEngagementCount } from '../../utils/broadcast-utils';

interface AnalyticsDashboardProps {
  className?: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  className = ''
}) => {
  const t = useTranslations('broadcasts');
  const [timeRange, setTimeRange] = useState('30d');
  const { data: analyticsData, isLoading } = useUserAnalytics(timeRange);
  const { userMetrics } = useBroadcastAnalytics();

  const timeRangeOptions = [
    { key: '7d', label: 'Last 7 days' },
    { key: '30d', label: 'Last 30 days' },
    { key: '90d', label: 'Last 3 months' },
    { key: '1y', label: 'Last year' }
  ];

  const engagementMetrics = [
    {
      key: 'views',
      label: 'Total Views',
      value: userMetrics.totalViews,
      icon: 'solar:eye-linear',
      color: 'primary' as const,
      change: analyticsData?.views?.change || 0
    },
    {
      key: 'likes',
      label: 'Total Likes',
      value: userMetrics.totalLikes,
      icon: 'solar:heart-linear',
      color: 'success' as const,
      change: analyticsData?.likes?.change || 0
    },
    {
      key: 'shares',
      label: 'Total Shares',
      value: userMetrics.totalShares,
      icon: 'solar:share-linear',
      color: 'secondary' as const,
      change: analyticsData?.shares?.change || 0
    },
    {
      key: 'followers',
      label: 'Followers',
      value: userMetrics.followers,
      icon: 'solar:users-group-rounded-linear',
      color: 'warning' as const,
      change: analyticsData?.followers?.change || 0
    }
  ];

  const topPosts = analyticsData?.topPosts || [];

  const getChangeColor = (change: number) => {
    if (change > 0) return 'success';
    if (change < 0) return 'danger';
    return 'default';
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return 'solar:arrow-up-linear';
    if (change < 0) return 'solar:arrow-down-linear';
    return 'solar:minus-linear';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Analytics Dashboard</h2>
          <p className='text-foreground-500'>
            Track your broadcast performance and engagement
          </p>
        </div>
        
        <Select
          selectedKeys={[timeRange]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as string;
            setTimeRange(selected);
          }}
          className='w-48'
          startContent={<Icon icon='solar:calendar-linear' className='h-4 w-4' />}
        >
          {timeRangeOptions.map((option) => (
            <SelectItem key={option.key}>
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Overview Metrics */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {engagementMetrics.map((metric) => (
          <Card key={metric.key}>
            <CardBody className='p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className={`bg-${metric.color}/10 flex h-10 w-10 items-center justify-center rounded-lg`}>
                    <Icon icon={metric.icon} className={`text-${metric.color} h-5 w-5`} />
                  </div>
                  <div>
                    <p className='text-sm text-foreground-500'>{metric.label}</p>
                    <p className='text-2xl font-bold'>{formatEngagementCount(metric.value)}</p>
                  </div>
                </div>
                
                <Chip
                  color={getChangeColor(metric.change)}
                  variant='flat'
                  startContent={
                    <Icon icon={getChangeIcon(metric.change)} className='h-3 w-3' />
                  }
                  size='sm'
                >
                  {Math.abs(metric.change)}%
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Engagement Rate */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Icon icon='solar:chart-2-linear' className='h-5 w-5' />
            <h3 className='text-lg font-semibold'>Engagement Rate</h3>
          </div>
        </CardHeader>
        <CardBody>
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm font-medium'>Overall Engagement</span>
              <span className='text-lg font-bold'>{userMetrics.engagement.toFixed(1)}%</span>
            </div>
            <Progress
              value={userMetrics.engagement}
              maxValue={100}
              color='success'
              size='md'
              showValueLabel={false}
            />
            <p className='text-xs text-foreground-500'>
              Engagement rate is calculated based on likes, comments, and shares relative to views
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Icon icon='solar:fire-linear' className='h-5 w-5' />
            <h3 className='text-lg font-semibold'>Top Performing Posts</h3>
          </div>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className='space-y-3'>
              {[...Array(3)].map((_, i) => (
                <div key={i} className='animate-pulse'>
                  <div className='bg-default-200 h-4 w-full rounded' />
                </div>
              ))}
            </div>
          ) : topPosts.length > 0 ? (
            <div className='space-y-4'>
              {topPosts.map((post: any, index: number) => (
                <div key={post.id} className='flex items-center gap-4'>
                  <div className='bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold'>
                    {index + 1}
                  </div>
                  
                  <div className='flex-1'>
                    <p className='font-medium line-clamp-1'>{post.title}</p>
                    <div className='flex items-center gap-4 text-xs text-foreground-500'>
                      <span className='flex items-center gap-1'>
                        <Icon icon='solar:eye-linear' className='h-3 w-3' />
                        {formatEngagementCount(post.views)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Icon icon='solar:heart-linear' className='h-3 w-3' />
                        {formatEngagementCount(post.likes)}
                      </span>
                      <span className='flex items-center gap-1'>
                        <Icon icon='solar:chat-round-linear' className='h-3 w-3' />
                        {formatEngagementCount(post.comments)}
                      </span>
                    </div>
                  </div>
                  
                  <Chip
                    color='success'
                    variant='flat'
                    size='sm'
                  >
                    {post.engagementRate.toFixed(1)}%
                  </Chip>
                </div>
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center py-8 text-center'>
              <Icon icon='solar:chart-linear' className='text-foreground-300 mb-4 h-12 w-12' />
              <p className='text-foreground-500'>No data available for selected time range</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Content Distribution */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        {/* Post Types Distribution */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Icon icon='solar:pie-chart-linear' className='h-5 w-5' />
              <h3 className='text-lg font-semibold'>Content Types</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className='space-y-3'>
              {analyticsData?.postTypes?.map((type: any) => (
                <div key={type.type} className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Icon icon={type.icon} className='h-4 w-4' />
                    <span className='text-sm font-medium'>{type.label}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Progress
                      value={type.percentage}
                      maxValue={100}
                      size='sm'
                      className='w-20'
                      color='primary'
                    />
                    <span className='text-xs text-foreground-500 w-10 text-right'>
                      {type.percentage}%
                    </span>
                  </div>
                </div>
              )) || []}
            </div>
          </CardBody>
        </Card>

        {/* Posting Activity */}
        <Card>
          <CardHeader>
            <div className='flex items-center gap-2'>
              <Icon icon='solar:calendar-linear' className='h-5 w-5' />
              <h3 className='text-lg font-semibold'>Posting Activity</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className='space-y-4'>
              <div className='flex items-center justify-between'>
                <span className='text-sm font-medium'>Total Posts</span>
                <span className='text-lg font-bold'>{userMetrics.totalPosts}</span>
              </div>
              
              <div className='space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Average per day</span>
                  <span>{(analyticsData?.avgPostsPerDay || 0).toFixed(1)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Best performing day</span>
                  <span>{analyticsData?.bestDay || 'N/A'}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span>Best posting time</span>
                  <span>{analyticsData?.bestTime || 'N/A'}</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;