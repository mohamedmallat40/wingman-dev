import React, { FC } from 'react';

import { Input, InputProps } from '@heroui/input';
import { FieldError } from 'react-hook-form';

interface TextInputProps extends InputProps {
  error?: FieldError;
}
const TextInput: FC<TextInputProps> = ({ error, ...props }) => {
  return (
    <div className='w-full space-y-1'>
      <Input isInvalid={error?.message ? true : false} variant='bordered' {...props} />
      {error && <p className='text-sm text-red-600'>{error.message}</p>}
    </div>
  );
};

export default TextInput;
