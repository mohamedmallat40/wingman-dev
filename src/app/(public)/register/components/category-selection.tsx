'use client';

import { Card, CardBody, Radio, RadioGroup } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { type Plan } from '@/lib/types/auth';

interface CategorySelectionProperties {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Plan[];
}

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'freelancer':
      return 'solar:user-bold-duotone';
    case 'company':
      return 'solar:buildings-bold-duotone';
    case 'agency':
      return 'solar:users-group-two-rounded-bold-duotone';
    default:
      return 'solar:user-bold-duotone';
  }
};

const getDefaultDescription = (category: string, t: any) => {
  switch (category.toLowerCase()) {
    case 'freelancer':
      return t('freelancerDescription');
    case 'company':
      return t('companyDescription');
    case 'agency':
      return t('agencyDescription');
    default:
      return t('defaultCategoryDescription');
  }
};

export default function CategorySelection({
  selectedCategory,
  onCategoryChange,
  categories
}: Readonly<CategorySelectionProperties>) {
  const t = useTranslations('registration');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='h-full'
    >
      <RadioGroup
        value={selectedCategory}
        onValueChange={onCategoryChange}
        classNames={{
          wrapper: 'grid grid-cols-1 lg:grid-cols-3 gap-8'
        }}
      >
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className='relative z-10 hover:z-20'
          >
            <Radio
              value={category.userCategory}
              classNames={{
                base: 'group inline-flex m-0 bg-transparent items-center justify-start flex-row-reverse w-full max-w-full cursor-pointer rounded-[20px] border-2 border-default-200 p-0 hover:border-primary hover:bg-primary/5 hover:shadow-lg hover:scale-105 data-[selected=true]:border-primary data-[selected=true]:bg-gradient-to-br data-[selected=true]:from-primary/10 data-[selected=true]:to-primary/5 data-[selected=true]:shadow-xl data-[selected=true]:scale-105 transition-all duration-300 ease-out',
                control: 'hidden',
                wrapper: 'hidden',
                labelWrapper: 'm-0 w-full'
              }}
            >
              <Card className='h-full min-h-[240px] w-full border-none bg-transparent shadow-none'>
                <CardBody className='flex h-full flex-col items-center justify-center gap-6 p-8 text-center'>
                  <div className='from-primary/20 to-primary/5 shadow-primary/10 group-hover:shadow-primary/20 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl'>
                    {category.image && process.env.NEXT_PUBLIC_API_BASE_URL ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, '')}/upload/${category.image}`}
                        className='text-primary'
                        width={32}
                        height={32}
                        alt={category.name}
                      />
                    ) : (
                      <Icon
                        icon={getCategoryIcon(category.userCategory)}
                        className='text-primary h-10 w-10'
                      />
                    )}
                  </div>
                  <div className='space-y-3'>
                    <h3 className='text-foreground mb-3 text-xl leading-tight font-bold tracking-[-0.02em]'>
                      {category.userCategory.charAt(0).toUpperCase() +
                        category.userCategory.slice(1).toLowerCase()}
                    </h3>
                    <p className='text-default-600 line-clamp-2 text-base leading-relaxed font-medium'>
                      {category.subTitle || getDefaultDescription(category.userCategory, t)}
                    </p>
                    <div className='text-primary mt-4 flex translate-y-1 transform items-center justify-center gap-2 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                      <span>{t('selectThisOption')}</span>
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
