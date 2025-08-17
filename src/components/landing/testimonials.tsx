'use client';

import { Card, CardBody } from '@heroui/card';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

// Testimonials data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechFlow B.V.',
    avatar: 'https://i.pravatar.cc/150?img=1',
    content:
      'Wingman helped us find the perfect e-commerce specialist within 48 hours. The quality of talent is exceptional.'
  },
  {
    name: 'Marc Dubois',
    role: 'CEO',
    company: 'InnovateNow',
    avatar: 'https://i.pravatar.cc/150?img=2',
    content:
      'The Success Manager approach is brilliant. We saved months of hiring time and found exactly what we needed.'
  },
  {
    name: 'Emma van Berg',
    role: 'Digital Manager',
    company: 'GrowthCorp',
    avatar: 'https://i.pravatar.cc/150?img=3',
    content:
      'Professional, reliable, and results-driven. Wingman delivered beyond our expectations.'
  }
];

export default function Testimonials() {
  const t = useTranslations('landing.testimonials');

  return (
    <section id='customers' className='relative z-10 mx-auto max-w-7xl px-2 py-20 sm:px-4 xl:px-6'>
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
        {testimonials.map((testimonial, index) => (
          <motion.article
            key={testimonial.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.8 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className='group'
          >
            <Card className='dark:bg-background/20 border-default-200/50 h-full rounded-[20px] border bg-white/20 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)]'>
              <CardBody className='p-8'>
                {/* Star Rating */}
                <div className='mb-4 flex items-center gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} icon='solar:star-bold' className='text-warning h-5 w-5' />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className='text-default-700 mb-6 leading-relaxed italic'>
                  "{testimonial.content}"
                </blockquote>

                {/* Client Info */}
                <footer className='flex items-center gap-4'>
                  <div className='relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full'>
                    <Image
                      src={testimonial.avatar}
                      alt={`${testimonial.name} profile photo`}
                      fill
                      className='object-cover'
                      sizes='48px'
                    />
                  </div>
                  <div>
                    <cite className='text-foreground font-semibold not-italic'>
                      {testimonial.name}
                    </cite>
                    <p className='text-default-500 text-sm'>{testimonial.role}</p>
                    <p className='text-primary text-sm font-medium'>{testimonial.company}</p>
                  </div>
                </footer>
              </CardBody>
            </Card>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
