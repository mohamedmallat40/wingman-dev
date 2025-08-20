'use client';

import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
// import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { SmartButton } from '@/components/ui/smart-button';

export default function Hero() {
  const router = useRouter();
  // const t = useTranslations('landing.hero');

  return (
    <section className='relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center gap-12 px-2 pt-32 pb-20 sm:px-4 xl:px-6 xl:pt-40 xl:pb-32'>
      {/* Main Headline */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className='text-center'
        style={{ willChange: 'transform' }}
      >
        <h1 className='mb-6 text-4xl leading-tight font-bold tracking-[0.02em] sm:text-5xl lg:text-6xl xl:text-7xl'>
          Find vetted{' '}
          <span className='from-primary to-primary-600 bg-gradient-to-r bg-clip-text text-transparent'>
            digital experts
          </span>{' '}
          in 48 hours
        </h1>
      </motion.header>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className='text-default-600 max-w-4xl text-center text-lg leading-relaxed lg:text-xl'
        style={{ willChange: 'transform' }}
      >
        Connect with 650+ pre-screened digital experts across the Benelux. From e-commerce
        specialists to marketing automation experts - find your perfect match with dedicated Success
        Manager support.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className='flex flex-col items-center justify-center gap-4 sm:flex-row'
        style={{ willChange: 'transform' }}
      >
        <Button
          color='primary'
          className='h-14 min-w-[240px] rounded-[16px] px-8 text-lg font-semibold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-shadow duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
          startContent={<Icon icon='solar:calendar-outline' className='h-5 w-5' />}
          onPress={() => router.push('#contact')}
        >
          Book free strategy session
        </Button>
        <SmartButton
          variant='bordered'
          color='primary'
          className='border-primary/20 hover:border-primary hover:bg-primary/5 h-14 min-w-[240px] rounded-[16px] px-8 text-lg font-medium tracking-[0.02em] transition-colors duration-300'
          endContent={<Icon icon='solar:alt-arrow-right-outline' className='h-5 w-5' />}
          href='/private/talent-pool'
          requiresAuth={true}
        >
          View talent pool
        </SmartButton>
      </motion.div>
    </section>
  );
}
