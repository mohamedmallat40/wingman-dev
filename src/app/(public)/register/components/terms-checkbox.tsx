'use client';

import { Checkbox, Link } from '@heroui/react';

interface TermsCheckboxProperties {
  checked: boolean;
  onChange: (checked: boolean) => void;
  isLoading?: boolean;
}

export default function TermsCheckbox({ checked, onChange }: Readonly<TermsCheckboxProperties>) {
  return (
    <div className='space-y-4'>
      <Checkbox
        isSelected={checked}
        onValueChange={onChange}
        color='primary'
        size='md'
        classNames={{
          wrapper: 'before:border-default-300'
        }}
      >
        <span className='text-sm text-gray-600 dark:text-gray-400'>
          I read and agree to the{' '}
          <Link href='#' size='sm' className='text-primary'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='#' size='sm' className='text-primary'>
            Privacy Policy
          </Link>
        </span>
      </Checkbox>
    </div>
  );
}
