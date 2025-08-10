'use client';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function CTA() {
  const router = useRouter();
  const t = useTranslations('landing.cta');

  return (
    <section id='contact' className='relative z-10 mx-auto max-w-7xl px-2 sm:px-4 xl:px-6 py-20'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center'
      >
        <Card className='from-primary/10 via-primary/5 border-primary/20 rounded-[24px] border bg-gradient-to-br to-transparent shadow-[0px_16px_40px_rgba(59,130,246,0.12)] backdrop-blur-xl'>
          <CardBody className='p-12'>
            <header className='mb-8'>
              <h2 className='text-foreground mb-4 text-3xl font-bold tracking-[0.02em] lg:text-4xl'>
                {t('title')}
              </h2>
              <p className='text-default-600 mx-auto max-w-2xl text-lg'>{t('subtitle')}</p>
            </header>

            <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
              <Button
                color='primary'
                size='lg'
                className='h-14 min-w-[200px] rounded-[16px] px-8 text-lg font-semibold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.2)]'
                startContent={<Icon icon='solar:rocket-2-outline' className='h-5 w-5' />}
                onPress={() => router.push('/register')}
              >
                {t('primaryButton')}
              </Button>
              <Button
                variant='bordered'
                color='primary'
                size='lg'
                className='border-primary/20 hover:border-primary hover:bg-primary/5 h-14 min-w-[200px] rounded-[16px] px-8 text-lg font-medium tracking-[0.02em] transition-all duration-300'
                endContent={<Icon icon='solar:phone-outline' className='h-5 w-5' />}
                onPress={() => router.push('#contact')}
              >
                {t('secondaryButton')}
              </Button>
            </div>
          </CardBody>
        </Card>
      </motion.div>
    </section>
  );
}
