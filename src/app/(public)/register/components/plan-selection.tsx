'use client';

import type { Plan } from '@/lib/types/auth';

import { Card, CardBody, Chip, Radio, RadioGroup } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface PlanSelectionProperties {
  selectedPlan?: Plan;
  onPlanChange: (plan: Plan) => void;
  plans: Plan[];
}

export default function PlanSelection({
  selectedPlan,
  onPlanChange,
  plans
}: Readonly<PlanSelectionProperties>) {
  const t = useTranslations('registration');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='space-y-6'
    >
      <RadioGroup
        value={selectedPlan?.id ?? ''}
        onValueChange={(value: string) => {
          const plan = plans.find((p: Plan) => p.id === value);
          if (plan) onPlanChange(plan);
        }}
        classNames={{
          wrapper: 'grid grid-cols-1 lg:grid-cols-2 gap-6'
        }}
      >
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className='relative z-10 hover:z-20'
          >
            <Radio
              value={plan.id}
              classNames={{
                base: 'group inline-flex m-0 bg-transparent items-start justify-start flex-row-reverse cursor-pointer rounded-[24px] border-2 border-default-200 p-0 hover:border-primary hover:bg-primary/5 hover:shadow-xl hover:scale-105 data-[selected=true]:border-primary data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-primary/15 data-[selected=true]:to-primary/5 data-[selected=true]:shadow-2xl data-[selected=true]:scale-105 transition-all duration-300 ease-out',
                control: 'hidden',
                wrapper: 'hidden',
                labelWrapper: 'm-0 w-full'
              }}
            >
              <Card className='h-full w-full border-none bg-transparent shadow-none'>
                <CardBody className='flex h-full flex-col p-6'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex-1'>
                      <h3 className='text-foreground mb-1 text-lg font-bold tracking-[0.02em]'>
                        {plan.name}
                      </h3>
                      <p className='text-default-600 text-sm'>{plan.subTitle}</p>
                    </div>
                    <div className='text-right'>
                      <Chip
                        color={plan.price === 0 ? 'success' : 'primary'}
                        variant='flat'
                        size='sm'
                        className='mb-2 text-xs font-medium'
                      >
                        {plan.price === 0 ? t('free') : t('popular')}
                      </Chip>
                      <div className='text-primary text-2xl font-bold'>
                        €{plan.price}
                        {plan.price > 0 && (
                          <span className='text-default-500 text-sm font-normal'>
                            /{t('month')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className='text-default-700 mb-4 text-sm leading-relaxed'>
                    {plan.description}
                  </p>

                  <div className='flex-1 space-y-2'>
                    {plan.features.slice(0, 4).map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className='text-default-700 flex items-start gap-2 text-sm'
                      >
                        <Icon
                          icon='solar:check-circle-bold-duotone'
                          className='text-success mt-0.5 h-4 w-4 flex-shrink-0'
                        />
                        <span className='leading-relaxed'>{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 4 && (
                      <div className='text-primary flex items-start gap-2 text-sm font-medium'>
                        <Icon icon='solar:add-circle-bold' className='mt-0.5 h-4 w-4' />
                        <span>
                          +{plan.features.length - 4} {t('moreFeatures')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className='border-default-200 mt-4 border-t pt-3'>
                    <div className='text-primary flex items-center justify-center gap-2 text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                      <span>{t('selectThisPlan')}</span>
                      <Icon icon='solar:alt-arrow-right-linear' className='h-4 w-4' />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Radio>
          </motion.div>
        ))}
      </RadioGroup>
    </motion.div>
  );
}
