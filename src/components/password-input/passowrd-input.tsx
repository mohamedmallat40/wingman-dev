import React from 'react';

import type { InputProps } from '@heroui/input';
import type { FC } from 'react';

import { Input } from '@heroui/input';
import { Icon } from '@iconify/react';
import { type FieldError } from 'react-hook-form';

import usePasswordVisibility from '@/components/password-input/usePasswordVisibility';

interface PassowrdInput extends InputProps {
  error?: FieldError;
}
const PassowrdInput: FC<PassowrdInput> = ({ error, ...properties }) => {
  const { isVisible, toggleVisibility } = usePasswordVisibility();
  return (
    <div className='w-full space-y-1'>
      <Input
        endContent={
          <button type='button' onClick={toggleVisibility}>
            {isVisible ? (
              <Icon
                className='text-default-400 pointer-events-none text-2xl'
                icon='solar:eye-closed-linear'
              />
            ) : (
              <Icon
                className='text-default-400 pointer-events-none text-2xl'
                icon='solar:eye-bold'
              />
            )}
          </button>
        }
        isInvalid={error?.message ? true : false}
        label='Password'
        placeholder='Enter your password'
        type={isVisible ? 'text' : 'password'}
        variant='bordered'
        {...properties}
      />
      {error && <p className='text-sm text-red-600'>{error.message}</p>}
    </div>
  );
};

export default PassowrdInput;
