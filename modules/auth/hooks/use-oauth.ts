'use client';

import { useState } from 'react';

import { addToast } from '@heroui/react';
import { handleOAuth } from '@root/modules/auth/services/auth.service';
import useUserStore from '@root/modules/auth/store/use-user-store';
import { type IUserProfile } from '@root/modules/profile/types';
import { useRouter } from 'next/navigation';

interface OAuthResponse {
  success: boolean;
  data?: {
    user: IUserProfile;
    token: string;
  };
  error?: string;
}

const useOAuth = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | undefined>();

  const authenticate = async (provider: 'google' | 'linkedin') => {
    setLoadingProvider(provider);
    try {
      const data = await handleOAuth(provider);
      const response = data as OAuthResponse;
      // Store token if provided
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
      }

      // Set user data
      if (response.data?.user) {
        setUser(response.data.user);
      }

      addToast({
        title: 'Success',
        description: `Successfully logged in with ${provider}!`,
        color: 'success',
        timeout: 3000
      });

      router.push('/');
    } catch (error: unknown) {
      console.error(`${provider} login failed:`, error);
      const message =
        error instanceof Error ? error.message : `Failed to authenticate with ${provider}`;
      addToast({
        title: `${provider} Authentication Failed`,
        description: message,
        color: 'danger',
        timeout: 4000
      });
    } finally {
      setLoadingProvider(undefined);
    }
  };

  const loginWithGoogle = () => authenticate('google');
  const loginWithLinkedIn = () => authenticate('linkedin');

  return {
    loginWithGoogle,
    loginWithLinkedIn,
    isGoogleLoading: loadingProvider === 'google',
    isLinkedInLoading: loadingProvider === 'linkedin',
    isLoading: loadingProvider,
    activeProvider: loadingProvider
  };
};

export default useOAuth;
