'use client';

import { useEffect } from 'react';

import { addToast } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { register as registerService } from '@root/modules/auth/services/auth.service';
import useUserStore from '@root/modules/auth/store/use-user-store';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { type RegistrationData } from '@/lib/types/auth';

import { registerSchema } from '../schema/register-schema';

interface IFormInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  kind: 'FREELANCER' | 'COMPANY' | 'AGENCY';
  addressDetails: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
    countryCode?: string;
    houseNumber?: string;
    VATNumber?: string;
    companyName?: string;
    type?: 'BILLING' | 'SHIPPING';
  };
}

const formatErrorMessage = (message: unknown): string => {
  if (typeof message === 'string' && message.trim()) {
    return message.charAt(0).toUpperCase() + message.slice(1).toLowerCase().replaceAll('_', ' ');
  }
  return 'Registration failed. Please try again.';
};

const useRegister = () => {
  const { setUser } = useUserStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<IFormInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched'
  });

  const {
    mutate,
    isPending: isLoading,
    isSuccess,
    data
  } = useMutation({
    mutationFn: registerService,
    onSuccess: (responseData: {
      data: { status: number; token?: string; user?: unknown; message: string };
    }) => {
      console.log('Registration successful:', responseData.data);
      if (responseData.data.status >= 200 && responseData.data.status < 300) {
        router.push('/');
        addToast({
          title: 'Success',
          description: 'Account created successfully!',
          color: 'success',
          timeout: 3000
        });
      } else {
        const formattedMessage = formatErrorMessage(responseData.data.message);

        addToast({
          title: 'Registration Failed',
          description: formattedMessage,
          color: 'danger',
          timeout: 3000
        });
        router.push('/');
      }
    },
    onError: (error: Error) => {
      console.log('Registration failed:', error);
      addToast({
        title: 'Registration Failed',
        description: error.message,
        color: 'danger'
      });
    }
  });

  const registerUser = (data: RegistrationData) => {
    mutate(data);
  };

  useEffect(() => {
    if (isSuccess) {
      // Store token if provided
      if (data.data.token) {
        localStorage.setItem('token', data.data.token);
      }

      // Set user data
      if (data.data.user) {
        setUser(data.data.user);
      }
    }
  }, [isSuccess, data, setUser, router]);

  return {
    form: {
      register,
      handleSubmit,
      registerUser,
      errors
    },
    mutation: {
      isLoading,
      isSuccess
    }
  };
};

export default useRegister;
