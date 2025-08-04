'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Tab, Tabs } from '@heroui/tabs';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

// Pricing plans data structure
const pricingPlans = [
  {
    name: 'Starter',
    monthlyPrice: 99,
    yearlyPrice: 950,
    description: 'Perfect for small businesses getting started',
    icon: 'solar:rocket-outline',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    borderColor: 'border-blue-500/20',
    features: [
      { text: 'Up to 3 project postings', icon: 'solar:document-add-outline' },
      { text: 'Access to vetted freelancers', icon: 'solar:users-group-rounded-outline' },
      { text: 'Basic matching algorithm', icon: 'solar:target-outline' },
      { text: 'Email support', icon: 'solar:letter-outline' },
      { text: 'Project management tools', icon: 'solar:folder-outline' }
    ],
    popular: false
  },
  {
    name: 'Professional',
    monthlyPrice: 199,
    yearlyPrice: 1910,
    description: 'Ideal for growing companies with regular projects',
    icon: 'solar:crown-outline',
    gradient: 'from-primary/15 to-secondary/15',
    borderColor: 'border-primary/30',
    features: [
      { text: 'Unlimited project postings', icon: 'solar:infinity-outline' },
      { text: 'Priority access to top talent', icon: 'solar:star-outline' },
      { text: 'Advanced matching & AI recommendations', icon: 'solar:magic-stick-3-outline' },
      { text: 'Dedicated Success Manager', icon: 'solar:user-hands-outline' },
      { text: 'Advanced analytics & reporting', icon: 'solar:chart-outline' },
      { text: 'Custom contract templates', icon: 'solar:document-text-outline' },
      { text: '24/7 priority support', icon: 'solar:headphones-round-sound-outline' }
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    monthlyPrice: null,
    yearlyPrice: null,
    description: 'Custom solutions for large organizations',
    icon: 'solar:buildings-outline',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-500/20',
    features: [
      { text: 'Everything in Professional', icon: 'solar:check-square-outline' },
      { text: 'Custom integrations', icon: 'solar:programming-outline' },
      { text: 'White-label solutions', icon: 'solar:pallete-2-outline' },
      { text: 'Dedicated account manager', icon: 'solar:shield-user-outline' },
      { text: 'SLA guarantees', icon: 'solar:shield-check-outline' },
      { text: 'Custom onboarding', icon: 'solar:presentation-graph-outline' },
      { text: 'Volume discounts', icon: 'solar:tag-price-outline' }
    ],
    popular: false
  }
];

export default function Pricing() {
  const router = useRouter();
  const t = useTranslations('landing.pricing');
  const [selectedPricingTab, setSelectedPricingTab] = React.useState('monthly');

  return (
    <section id='pricing' className='relative z-10 mx-auto max-w-7xl px-6 py-20'>
      <motion.header
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='mb-16 text-center'
      >
        <h2 className='text-foreground mb-4 text-3xl font-bold tracking-[0.02em] lg:text-4xl'>
          {t('title')}
        </h2>
        <p className='text-default-600 mx-auto mb-8 max-w-2xl text-lg'>{t('subtitle')}</p>

        {/* Pricing Toggle */}
        <Tabs
          selectedKey={selectedPricingTab}
          onSelectionChange={(key) => setSelectedPricingTab(key as string)}
          className='justify-center'
          classNames={{
            tabList: 'bg-white/30 dark:bg-background/30 backdrop-blur-sm p-1 rounded-[12px]',
            tab: 'px-6 py-3 text-sm font-medium',
            cursor: 'bg-white/80 dark:bg-background/80 shadow-sm rounded-[8px]'
          }}
        >
          <Tab key='monthly' title={t('monthly')} />
          <Tab
            key='yearly'
            title={
              <div className='flex items-center gap-2'>
                {t('yearly')}
                <Chip size='sm' color='success' variant='flat'>
                  {t('yearlyDiscount')}
                </Chip>
              </div>
            }
          />
        </Tabs>
      </motion.header>

      <div className='grid items-stretch gap-8 md:grid-cols-3'>
        {pricingPlans.map((plan, index) => {
          const isYearly = selectedPricingTab === 'yearly';
          const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

          return (
            <motion.article
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className='group relative flex'
            >
              {plan.popular && (
                <div className='absolute -top-4 left-1/2 z-10 -translate-x-1/2 transform'>
                  <Chip color='primary' variant='solid' className='px-4 font-semibold'>
                    {t('mostPopular')}
                  </Chip>
                </div>
              )}
              <Card
                className={`bg-gradient-to-br backdrop-blur-xl ${plan.gradient} flex w-full flex-col rounded-[20px] border-2 shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0px_16px_40px_rgba(0,0,0,0.12)] ${plan.borderColor} ${
                  plan.popular ? 'scale-105 shadow-[0px_20px_50px_rgba(59,130,246,0.15)]' : ''
                }`}
              >
                <CardBody className='flex h-full flex-col p-8'>
                  {/* Header Section */}
                  <header className='mb-8 text-center'>
                    <div className='mb-4 flex justify-center'>
                      <div
                        className={`h-16 w-16 rounded-[20px] bg-gradient-to-br ${plan.gradient} border ${plan.borderColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon icon={plan.icon} className='text-primary h-8 w-8' />
                      </div>
                    </div>
                    <h3 className='text-foreground mb-3 text-2xl font-bold'>{plan.name}</h3>
                    <p className='text-default-600 mb-6 leading-relaxed'>{plan.description}</p>
                    {price ? (
                      <div className='mb-6'>
                        <div className='flex items-baseline justify-center gap-2'>
                          <span className='text-foreground text-5xl font-bold'>€{price}</span>
                          <span className='text-default-500 text-lg'>
                            {isYearly ? t('perYear') : t('perMonth')}
                          </span>
                        </div>
                        {isYearly && plan.monthlyPrice && (
                          <p className='text-success mt-2 text-sm font-medium'>
                            Save €{plan.monthlyPrice * 12 - plan.yearlyPrice}
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className='mb-6'>
                        <span className='text-foreground text-4xl font-bold'>Custom</span>
                        <p className='text-default-500 mt-2 text-sm'>Contact us for pricing</p>
                      </div>
                    )}
                  </header>

                  {/* Features Section - Flexible */}
                  <div className='flex-1'>
                    <ul className='space-y-4'>
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className='flex items-start gap-3'>
                          <div className='bg-success/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full'>
                            <Icon icon={feature.icon} className='text-success h-4 w-4' />
                          </div>
                          <span className='text-default-700 leading-relaxed'>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button - Fixed at bottom */}
                  <div className='mt-8'>
                    <Button
                      color={plan.popular ? 'primary' : 'default'}
                      variant={plan.popular ? 'solid' : 'bordered'}
                      className={`h-14 w-full rounded-[12px] font-semibold transition-all duration-300 ${
                        plan.popular
                          ? 'shadow-[0px_8px_20px_rgba(59,130,246,0.15)] hover:shadow-[0px_12px_24px_rgba(59,130,246,0.25)]'
                          : 'border-default-300 hover:border-primary/50 hover:bg-primary/5'
                      }`}
                      onPress={() => router.push('/register')}
                      startContent={
                        plan.popular ? (
                          <Icon icon='solar:star-bold' className='h-5 w-5' />
                        ) : (
                          <Icon icon='solar:rocket-outline' className='h-5 w-5' />
                        )
                      }
                    >
                      {price ? t('getStarted') : t('contactSales')}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
