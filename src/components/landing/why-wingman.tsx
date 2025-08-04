'use client';

import { Card, CardBody } from '@heroui/card';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function WhyWingman() {
  const t = useTranslations('landing.features');

  const features = [
    {
      icon: 'solar:shield-check-outline',
      title: t('feature1Title'),
      description: t('feature1Description')
    },
    {
      icon: 'solar:lightning-outline',
      title: t('feature2Title'),
      description: t('feature2Description')
    },
    {
      icon: 'solar:crown-outline',
      title: t('feature3Title'),
      description: t('feature3Description')
    }
  ];

  return (
    <section id='about' className='relative z-10 mx-auto max-w-7xl px-6 py-20'>
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-16 text-center'
      >
        <h2 className='text-foreground mb-4 text-3xl font-bold tracking-[0.02em] lg:text-4xl'>
          {t('title')}
        </h2>
        <p className='text-default-600 mx-auto max-w-2xl text-lg'>{t('subtitle')}</p>
      </motion.header>

      <div className='grid gap-8 md:grid-cols-3'>
        {features.map((feature, index) => (
          <motion.article
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.3, duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className='group'
          >
            <Card className='dark:bg-background/20 border-default-200/50 h-full rounded-[20px] border bg-white/20 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'>
              <CardBody className='p-8'>
                <motion.div
                  className='bg-primary/10 group-hover:bg-primary/20 border-primary/10 mb-6 flex h-16 w-16 items-center justify-center rounded-[20px] border transition-colors duration-300'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Icon icon={feature.icon} className='text-primary h-8 w-8' />
                </motion.div>
                <h3 className='text-foreground mb-4 text-xl font-bold tracking-[0.02em]'>
                  {feature.title}
                </h3>
                <p className='text-default-600 leading-relaxed'>{feature.description}</p>
              </CardBody>
            </Card>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
