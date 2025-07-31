'use client';

import type { Plan } from '@/lib/types/auth';

import { Card, CardBody, Chip, Radio, RadioGroup } from '@heroui/react';
import { Icon } from '@iconify/react';

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
  return (
    <div className='space-y-3'>
      <div>
        <h2 className='mb-1 text-lg font-semibold text-gray-900 dark:text-white'>
          Choose Your Plan
        </h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Select the plan that fits your needs
        </p>
      </div>

      <RadioGroup
        value={selectedPlan?.id ?? ''}
        onValueChange={(value: string) => {
          const plan = plans.find((p: Plan) => p.id === value);
          if (plan) onPlanChange(plan);
        }}
        classNames={{
          wrapper: 'grid grid-cols-2 gap-2'
        }}
      >
        {plans.map((plan) => (
          <Radio
            key={plan.id}
            value={plan.id}
            classNames={{
              base: 'inline-flex m-0 bg-transparent items-start justify-start flex-row-reverse cursor-pointer rounded-lg border-2 border-default-200 p-0 hover:border-primary-500 data-[selected=true]:border-primary-500',
              control: 'hidden',
              wrapper: 'hidden',
              labelWrapper: 'm-0 w-full'
            }}
          >
            <Card className='w-full bg-transparent shadow-none'>
              <CardBody className='p-3'>
                <div className='mb-3 flex items-start justify-between'>
                  <div>
                    <h3 className='mb-1 text-base font-semibold text-gray-900 dark:text-white'>
                      {plan.name}
                    </h3>
                    <p className='mb-2 text-xs text-gray-600 dark:text-gray-400'>{plan.subTitle}</p>
                  </div>
                  <div className='flex items-center gap-1 text-right'>
                    <Chip
                      color={plan.price === 0 ? 'success' : 'danger'}
                      variant='flat'
                      size='sm'
                      className='mt-1'
                    >
                      {plan.price === 0 ? 'Free' : 'Popular'}
                    </Chip>

                    <div className='text-primary text-xl font-bold'>
                      €{plan.price}
                      {plan.price > 0 && (
                        <span className='text-sm font-normal text-gray-500'>/mo</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className='mb-3 line-clamp-2 text-xs text-gray-600 dark:text-gray-400'>
                  {plan.description}
                </p>

                <div className='space-y-1'>
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <div
                      key={index}
                      className='flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400'
                    >
                      <Icon
                        icon='solar:check-circle-outline'
                        className='text-success mt-0.5 flex-shrink-0'
                        width={14}
                      />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {plan.features.length > 3 && (
                  <p className='mt-2 text-xs text-gray-500 dark:text-gray-500'>
                    +{plan.features.length - 3} more features
                  </p>
                )}
              </CardBody>
            </Card>
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}
