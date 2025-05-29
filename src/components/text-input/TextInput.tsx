import { Input, InputProps } from '@heroui/input'
import React, { FC } from 'react'
import { FieldError } from 'react-hook-form'
interface TextInputProps extends InputProps {
    error?: FieldError
}
const TextInput: FC<TextInputProps> = ({ error, ...props }) => {
    return (
        <div className="space-y-1 w-full">
            <Input
                isInvalid={error?.message ? true : false}

                variant='bordered'
                {...props}
            />
            {error && <p className="text-sm text-red-600">{error.message}</p>}

        </div>
    )
}

export default TextInput