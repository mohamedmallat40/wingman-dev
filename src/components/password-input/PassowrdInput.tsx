import usePasswordVisibility from '@/components/password-input/usePasswordVisibility'
import { Input, InputProps } from '@heroui/input'
import { Icon } from '@iconify/react'
import React, { FC } from 'react'
import { FieldError } from 'react-hook-form'
interface PassowrdInput extends InputProps {
    error?: FieldError
}
const PassowrdInput: FC<PassowrdInput> = ({ error, ...props }) => {
    const { isVisible, toggleVisibility } = usePasswordVisibility()
    return (
        <div className="space-y-1 w-full">

            <Input
                
                endContent={
                    <button type='button' onClick={toggleVisibility}>
                        {isVisible ? (
                            <Icon
                                className='pointer-events-none text-2xl text-default-400'
                                icon='solar:eye-closed-linear'
                            />
                        ) : (
                            <Icon
                                className='pointer-events-none text-2xl text-default-400'
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
                {...props}

            />
            {error && <p className="text-sm text-red-600">{error.message}</p>}

        </div>)
}

export default PassowrdInput