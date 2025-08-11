'use client';

import { Card, CardBody } from '@heroui/card';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Metrics() {
  const t = useTranslations('landing.stats');

  // Dynamic metric data with translations
  const metricsData = [
    {
      value: t('stat1Value'),
      label: t('stat1Label'),
      icon: 'solar:clock-circle-outline',
      color: 'text-primary'
    },
    {
      value: t('stat2Value'),
      label: t('stat2Label'),
      icon: 'solar:heart-outline',
      color: 'text-success'
    },
    {
      value: t('stat3Value'),
      label: t('stat3Label'),
      icon: 'solar:target-outline',
      color: 'text-warning'
    },
    {
      value: t('stat4Value'),
      label: t('stat4Label'),
      icon: 'solar:users-group-rounded-outline',
      color: 'text-primary'
    }
  ];

  return (
    <section id='services' className='relative z-10 mx-auto max-w-7xl px-2 sm:px-4 xl:px-6 py-8'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='grid w-full grid-cols-2 gap-6 lg:grid-cols-4'
      >
        {metricsData.map((metric, index) => (
          <motion.article
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.6 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className='group'
          >
            <Card className='dark:bg-background/20 border-default-200/50 rounded-[20px] border bg-white/20 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'>
              <CardBody className='p-8 text-center'>
                <motion.div
                  className={`mx-auto mb-4 h-12 w-12 ${metric.color.replace('text-', 'bg-')}/10 flex items-center justify-center rounded-[16px] transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon icon={metric.icon} className={`h-6 w-6 ${metric.color}`} />
                </motion.div>
                <div className={`mb-3 text-4xl font-bold ${metric.color} lg:text-5xl`}>
                  {metric.value}
                </div>
                <div className='text-default-600 text-sm font-medium lg:text-base'>
                  {metric.label}
                </div>
              </CardBody>
            </Card>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}
