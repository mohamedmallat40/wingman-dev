'use client';

import { useEffect } from 'react';

import type { SubmitHandler } from 'react-hook-form';

import { useDisclosure } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { login } from '@root/modules/auth/services/auth.service';
import useUserStore from '@root/modules/auth/store/use-user-store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { loginSchema } from '../schema/login-schema';

interface IFormInput {
  email: string;
  password: string;
}
const useLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched'
  });
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { setUser } = useUserStore();
  const router = useRouter();
  const {
    mutate,
    isPending: isLoading,
    isSuccess,
    data
  } = useMutation({
    mutationFn: login
  });

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      onClose();
      localStorage.setItem('token', String(data.data?.token));
      router.push('/private/dashboard');
      setUser(data.data?.user);
    }
  }, [isSuccess, onClose]);
  return {
    modal: {
      isOpen,
      onOpen,
      onOpenChange
    },
    form: {
      register,
      handleSubmit,
      onSubmit,
      errors
    },
    mutation: {
      isLoading,
      isSuccess
    }
  };
};

export default useLogin;
