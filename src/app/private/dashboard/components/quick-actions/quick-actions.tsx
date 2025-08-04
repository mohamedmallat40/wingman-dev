'use client';

import { FC } from 'react';

import { Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

const getQuickActions = (t: any) => [
  {
    key: 'find-talent',
    title: t('quickActionItems.findTalent.title'),
    description: t('quickActionItems.findTalent.description'),
    icon: 'solar:users-group-rounded-bold',
    color: 'primary',
    href: '/private/talent-pool'
  },
  {
    key: 'my-challenges',
    title: t('quickActionItems.myChallenges.title'),
    description: t('quickActionItems.myChallenges.description'),
    icon: 'solar:cup-star-bold',
    color: 'warning',
    href: '/private/my-challenges'
  },
  {
    key: 'post-project',
    title: t('quickActionItems.postProject.title'),
    description: t('quickActionItems.postProject.description'),
    icon: 'solar:document-add-bold',
    color: 'success',
    href: '/private/projects/new'
  },
  {
    key: 'view-documents',
    title: t('quickActionItems.documents.title'),
    description: t('quickActionItems.documents.description'),
    icon: 'solar:file-text-bold',
    color: 'secondary',
    href: '/private/documents'
  }
];

const colorVariants = {
  primary: {
    bg: 'bg-primary/10',
    text: 'text-primary',
    hover: 'group-hover:bg-primary/20'
  },
  success: {
    bg: 'bg-success/10',
    text: 'text-success',
    hover: 'group-hover:bg-success/20'
  },
  warning: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    hover: 'group-hover:bg-warning/20'
  },
  secondary: {
    bg: 'bg-secondary/10',
    text: 'text-secondary',
    hover: 'group-hover:bg-secondary/20'
  }
};

const QuickActions: FC = () => {
  const router = useRouter();
  const t = useTranslations('dashboard');
  const quickActions = getQuickActions(t);

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-4'>
      {quickActions.map((action, index) => {
        const variant = colorVariants[action.color as keyof typeof colorVariants];

        return (
          <motion.div
            key={action.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className='group'
          >
            <Card
              className='dark:bg-background/90 border-default-200/50 h-full cursor-pointer rounded-[20px] border bg-white/90 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'
              isPressable
              onPress={() => router.push(action.href)}
            >
              <CardBody className='p-6'>
                <motion.div
                  className={`mb-4 h-14 w-14 ${variant.bg} ${variant.hover} flex items-center justify-center rounded-[18px] transition-colors duration-300`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon icon={action.icon} className={`h-7 w-7 ${variant.text}`} />
                </motion.div>

                <h3 className='text-foreground mb-2 text-lg font-bold tracking-[0.02em]'>
                  {action.title}
                </h3>

                <p className='text-default-600 mb-4 text-sm leading-relaxed'>
                  {action.description}
                </p>

                <div className='mt-auto flex w-full items-center justify-between'>
                  <span className='text-foreground text-sm font-medium tracking-[0.02em]'>
                    {t('quickActionItems.goTo')}
                  </span>
                  <Icon
                    icon='solar:alt-arrow-right-linear'
                    className='text-default-400 group-hover:text-primary h-4 w-4 transition-colors'
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default QuickActions;
