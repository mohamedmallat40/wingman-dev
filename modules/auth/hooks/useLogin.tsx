'use client'
import { addToast, useDisclosure } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@root/modules/auth/schema/loginSchema';
import { login } from '@root/modules/auth/services/auth.service';
import useUserStore from '@root/modules/auth/store/useUserStore';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form';
interface IFormInput {
    email: string;
    password: string;
}
const useLogin = () => {
    const { register, handleSubmit,    formState: { errors },
} = useForm<IFormInput>({
        resolver:zodResolver(loginSchema),
        mode:'onTouched'
    });
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const {setUser}=useUserStore()
    const router=useRouter()
    const { mutate, isPending: isLoading, isSuccess,data } = useMutation({
        mutationFn: login,
    })
    const onSubmit: SubmitHandler<IFormInput> = (data) => mutate(data);

useEffect(() => {

        if (isSuccess) {
            onClose();
           localStorage.setItem('token', data?.data?.token);
            setUser(data?.data?.user);
            addToast({ title: 'Login successful', color: 'success' });
            router.push('/dashboard');
        }

}, [isSuccess, onClose])
    return {
        modal: {
            isOpen,
            onOpen,
            onOpenChange,

        },
        form: {
            register,
            handleSubmit,
            onSubmit,
            errors
        },
        mutation: {
            isLoading,
            isSuccess,
        },
    }

}

export default useLogin