'use client';

import { Checkbox, Link } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface TermsCheckboxProperties {
  checked: boolean;
  onChange: (checked: boolean) => void;
  isLoading?: boolean;
}

export default function TermsCheckbox({ checked, onChange }: Readonly<TermsCheckboxProperties>) {
  const t = useTranslations('registration');

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-default-50 dark:bg-default-100/20 rounded-[16px] p-6'
    >
      <Checkbox
        isSelected={checked}
        onValueChange={onChange}
        color='primary'
        size='lg'
        classNames={{
          wrapper: 'before:border-default-300 rounded-[8px]',
          icon: 'text-white'
        }}
      >
        <div className='flex items-start gap-3'>
          <Icon
            icon='solar:shield-check-bold'
            className='text-primary mt-0.5 h-5 w-5 flex-shrink-0'
          />
          <span className='text-foreground text-sm leading-relaxed tracking-[0.02em]'>
            {t('agreeToTermsPrefix')}{' '}
            <Link href='#' size='sm' className='text-primary hover:text-primary/80 font-medium'>
              {t('termsOfService')}
            </Link>{' '}
            {t('and')}{' '}
            <Link href='#' size='sm' className='text-primary hover:text-primary/80 font-medium'>
              {t('privacyPolicy')}
            </Link>
          </span>
        </div>
      </Checkbox>
    </motion.div>
  );
}
