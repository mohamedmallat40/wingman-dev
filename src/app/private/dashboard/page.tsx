'use client';

import React from 'react';

import { Avatar, Button, Card, CardBody, CardHeader, Chip, Progress } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import DashboardLayout from '@/components/layouts/dashboard-layout';

import QuickActions from './components/quick-actions/quick-actions';

const getStatsData = (t: any) => [
  {
    titleKey: 'stats.activeProjects',
    title: t('stats.activeProjects'),
    value: '8',
    change: '+12%',
    trend: 'up',
    icon: 'solar:folder-bold',
    color: 'primary'
  },
  {
    titleKey: 'stats.freelancersFound',
    title: t('stats.freelancersFound'),
    value: '24',
    change: '+8%',
    trend: 'up',
    icon: 'solar:users-group-rounded-bold',
    color: 'success'
  },
  {
    titleKey: 'stats.averageRating',
    title: t('stats.averageRating'),
    value: '4.8',
    change: '+0.2',
    trend: 'up',
    icon: 'solar:star-bold',
    color: 'warning'
  },
  {
    titleKey: 'stats.completedProjects',
    title: t('stats.completedProjects'),
    value: '156',
    change: '+5%',
    trend: 'up',
    icon: 'solar:check-circle-bold',
    color: 'secondary'
  }
];

const recentProjects = [
  {
    id: 1,
    title: 'E-commerce Platform Redesign',
    freelancer: 'Sarah van der Berg',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    status: 'In Progress',
    progress: 75,
    dueDate: '2024-02-15',
    budget: '€15,000'
  },
  {
    id: 2,
    title: 'Mobile App Development',
    freelancer: 'Mark de Vries',
    avatar: 'https://i.pravatar.cc/150?u=mark',
    status: 'Review',
    progress: 90,
    dueDate: '2024-02-20',
    budget: '€22,000'
  },
  {
    id: 3,
    title: 'SEO Optimization Campaign',
    freelancer: 'Lisa Johnson',
    avatar: 'https://i.pravatar.cc/150?u=lisa',
    status: 'Starting',
    progress: 25,
    dueDate: '2024-03-01',
    budget: '€8,500'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'proposal',
    title: 'Nieuwe offerte ontvangen',
    description: 'Voor UI/UX Design project',
    time: '2 uur geleden',
    icon: 'solar:file-text-bold',
    color: 'primary'
  },
  {
    id: 2,
    type: 'milestone',
    title: 'Mijlpaal bereikt',
    description: 'E-commerce project 75% voltooid',
    time: '4 uur geleden',
    icon: 'solar:flag-bold',
    color: 'success'
  },
  {
    id: 3,
    type: 'message',
    title: 'Nieuw bericht',
    description: 'Van uw Success Manager',
    time: '1 dag geleden',
    icon: 'solar:chat-round-call-bold',
    color: 'secondary'
  }
];

const myChallenges = [
  {
    id: 1,
    title: 'Array Manipulation Master',
    difficulty: 'Medium',
    progress: 60,
    status: 'In Progress',
    category: 'Algorithms',
    timeSpent: '2h 30m'
  },
  {
    id: 2,
    title: 'Binary Tree Traversal',
    difficulty: 'Hard',
    progress: 100,
    status: 'Completed',
    category: 'Data Structures',
    timeSpent: '4h 15m'
  },
  {
    id: 3,
    title: 'String Parsing Challenge',
    difficulty: 'Easy',
    progress: 25,
    status: 'Started',
    category: 'Strings',
    timeSpent: '45m'
  }
];

const colorVariants = {
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  secondary: { bg: 'bg-secondary/10', text: 'text-secondary' }
};

const DashboardPage = () => {
  const t = useTranslations('dashboard');
  const statsData = getStatsData(t);

  return (
    <DashboardLayout
      pageTitle={t('pageTitle')}
      pageDescription={t('pageDescription')}
      pageIcon='solar:home-smile-angle-linear'
      breadcrumbs={[
        { label: 'Home', href: '/private/dashboard', icon: 'solar:home-linear' },
        { label: 'Dashboard' }
      ]}
      headerActions={
        <div className='flex items-center gap-2'>
          <Button
            variant='flat'
            size='sm'
            startContent={<Icon icon='solar:refresh-linear' className='h-4 w-4' />}
          >
            {t('refreshButton')}
          </Button>
          <Button
            color='primary'
            size='sm'
            startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
          >
            {t('newProjectButton')}
          </Button>
        </div>
      }
    >
      <div className='mx-auto w-full space-y-8 px-4 py-6 sm:px-6 lg:px-8 xl:max-w-[85%] 2xl:max-w-[75%]'>
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className='mb-8'
        >
          <h2 className='text-foreground mb-6 text-2xl font-bold tracking-[0.02em]'>
            {t('quickActions')}
          </h2>
          <QuickActions />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className='mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4'
        >
          {statsData.map((stat, index) => {
            const variant = colorVariants[stat.color as keyof typeof colorVariants];

            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Card className='dark:bg-background/90 border-default-200/50 rounded-[20px] border bg-white/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'>
                  <CardBody className='p-6'>
                    <div className='mb-4 flex items-center justify-between'>
                      <div
                        className={`h-12 w-12 ${variant.bg} flex items-center justify-center rounded-[16px]`}
                      >
                        <Icon icon={stat.icon} className={`h-6 w-6 ${variant.text}`} />
                      </div>
                      <Chip
                        size='sm'
                        color={stat.trend === 'up' ? 'success' : 'danger'}
                        variant='flat'
                        startContent={
                          <Icon
                            icon={
                              stat.trend === 'up'
                                ? 'solar:arrow-up-linear'
                                : 'solar:arrow-down-linear'
                            }
                            className='h-3 w-3'
                          />
                        }
                      >
                        {stat.change}
                      </Chip>
                    </div>
                    <div className='text-foreground mb-1 text-2xl font-bold'>{stat.value}</div>
                    <div className='text-default-600 text-sm'>{stat.title}</div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className='grid gap-8 lg:grid-cols-3'>
          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className='lg:col-span-2'
          >
            <Card className='dark:bg-background/90 border-default-200/50 h-full rounded-[20px] border bg-white/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl'>
              <CardHeader className='p-6 pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <h3 className='text-foreground text-xl font-bold tracking-[0.02em]'>
                    {t('recentProjects.title')}
                  </h3>
                  <Button
                    variant='light'
                    color='primary'
                    size='sm'
                    endContent={<Icon icon='solar:alt-arrow-right-linear' className='h-4 w-4' />}
                  >
                    {t('recentProjects.viewAll')}
                  </Button>
                </div>
              </CardHeader>
              <CardBody className='p-6 pt-0'>
                <div className='space-y-4'>
                  {recentProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                      className='border-default-200/50 hover:border-primary/20 hover:bg-primary/5 cursor-pointer rounded-[16px] border p-4 transition-all duration-300'
                    >
                      <div className='mb-3 flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <Avatar src={project.avatar} size='sm' />
                          <div>
                            <h4 className='text-foreground text-sm font-semibold'>
                              {project.title}
                            </h4>
                            <p className='text-default-500 text-xs'>{project.freelancer}</p>
                          </div>
                        </div>
                        <Chip
                          size='sm'
                          color={
                            project.status === 'In Progress'
                              ? 'primary'
                              : project.status === 'Review'
                                ? 'warning'
                                : 'default'
                          }
                          variant='flat'
                        >
                          {project.status}
                        </Chip>
                      </div>
                      <div className='mb-3'>
                        <div className='text-default-600 mb-1 flex justify-between text-xs'>
                          <span>{t('recentProjects.progress')}</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress
                          value={project.progress}
                          color={
                            project.progress > 80
                              ? 'success'
                              : project.progress > 50
                                ? 'warning'
                                : 'primary'
                          }
                          size='sm'
                          className='max-w-full'
                        />
                      </div>
                      <div className='text-default-500 flex justify-between text-xs'>
                        <span>
                          {t('recentProjects.due')}: {project.dueDate}
                        </span>
                        <span className='text-foreground font-semibold'>{project.budget}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Card className='dark:bg-background/90 border-default-200/50 h-full rounded-[20px] border bg-white/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl'>
              <CardHeader className='p-6 pb-4'>
                <h3 className='text-foreground text-xl font-bold tracking-[0.02em]'>
                  {t('recentActivity.title')}
                </h3>
              </CardHeader>
              <CardBody className='p-6 pt-0'>
                <div className='space-y-4'>
                  {recentActivity.map((activity, index) => {
                    const variant = colorVariants[activity.color as keyof typeof colorVariants];

                    return (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                        className='hover:bg-default-50 dark:hover:bg-default-100/10 flex items-start gap-3 rounded-[16px] p-3 transition-colors duration-200'
                      >
                        <div
                          className={`h-10 w-10 ${variant.bg} flex flex-shrink-0 items-center justify-center rounded-[12px]`}
                        >
                          <Icon icon={activity.icon} className={`h-5 w-5 ${variant.text}`} />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <h4 className='text-foreground mb-1 text-sm font-semibold'>
                            {activity.title}
                          </h4>
                          <p className='text-default-600 mb-1 text-xs'>{activity.description}</p>
                          <p className='text-default-400 text-xs'>{activity.time}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>

        {/* My Challenges Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className='mt-8'
        >
          <Card className='dark:bg-background/90 border-default-200/50 rounded-[20px] border bg-white/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl'>
            <CardHeader className='p-6 pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-warning/10 flex h-10 w-10 items-center justify-center rounded-[12px]'>
                    <Icon icon='solar:cup-star-bold' className='text-warning h-5 w-5' />
                  </div>
                  <h3 className='text-foreground text-xl font-bold tracking-[0.02em]'>
                    {t('myChallenges.title')}
                  </h3>
                </div>
                <Button
                  variant='light'
                  color='primary'
                  size='sm'
                  endContent={<Icon icon='solar:alt-arrow-right-linear' className='h-4 w-4' />}
                  onPress={() => (window.location.href = '/private/my-challenges')}
                >
                  {t('myChallenges.viewAll')}
                </Button>
              </div>
            </CardHeader>
            <CardBody className='p-6 pt-0'>
              <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                {myChallenges.map((challenge, index) => (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                    className='border-default-200/50 hover:border-primary/20 hover:bg-primary/5 cursor-pointer rounded-[16px] border p-4 transition-all duration-300'
                  >
                    <div className='mb-3 flex items-center justify-between'>
                      <Chip
                        size='sm'
                        color={
                          challenge.difficulty === 'Easy'
                            ? 'success'
                            : challenge.difficulty === 'Medium'
                              ? 'warning'
                              : 'danger'
                        }
                        variant='flat'
                      >
                        {t(`myChallenges.difficulty.${challenge.difficulty.toLowerCase()}`)}
                      </Chip>
                      <Chip
                        size='sm'
                        color={
                          challenge.status === 'Completed'
                            ? 'success'
                            : challenge.status === 'In Progress'
                              ? 'primary'
                              : 'default'
                        }
                        variant='flat'
                      >
                        {t(
                          `myChallenges.status.${challenge.status === 'In Progress' ? 'inProgress' : challenge.status.toLowerCase()}`
                        )}
                      </Chip>
                    </div>
                    <h4 className='text-foreground mb-2 text-sm font-semibold'>
                      {challenge.title}
                    </h4>
                    <p className='text-default-500 mb-3 text-xs'>
                      {challenge.category} • {challenge.timeSpent}
                    </p>
                    <div className='mb-2'>
                      <div className='text-default-600 mb-1 flex justify-between text-xs'>
                        <span>{t('myChallenges.progress')}</span>
                        <span>{challenge.progress}%</span>
                      </div>
                      <Progress
                        value={challenge.progress}
                        color={
                          challenge.progress === 100
                            ? 'success'
                            : challenge.progress > 50
                              ? 'warning'
                              : 'primary'
                        }
                        size='sm'
                        className='max-w-full'
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
