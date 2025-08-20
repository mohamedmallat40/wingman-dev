'use client';

import { useState } from 'react';

import { addToast } from '@heroui/react';
import { handleOAuth } from '../services/auth.service';
import useUserStore from '../store/use-user-store';
import { type IUserProfile } from '../../profile/types';
import { useRouter } from 'next/navigation';

interface OAuthResponse {
  success: boolean;
  user: IUserProfile;
  token: string;
  chatToken: string;
  error?: string;
}

const useOAuth = () => {
  const { setUser } = useUserStore();
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<string | undefined>();

  const authenticate = async (provider: 'google' | 'linkedin') => {
    setLoadingProvider(provider);
    try {
      const data = (await handleOAuth(provider)) as OAuthResponse;
      // Store token if provided
      if (data.user) {
        if (data.token && data.user.isCompleted) {
          localStorage.setItem('token', data.token);
          setUser(data.user);

          addToast({
            title: 'Welcome back!',
            description: 'Successfully logged in. Redirecting to dashboard...',
            color: 'success',
            timeout: 3000
          });

          router.push('/private/dashboard');
          return {
            isCompleted: true,
            user: data.user,
            token: data.token,
            chatToken: data.chatToken
          };
        } else {
          addToast({
            title: 'Welcome!',
            description: 'Please complete your registration to continue.',
            color: 'success',
            timeout: 3000
          });

          return {
            isCompleted: false,
            user: data.user,
            token: data.token,
            chatToken: data.chatToken
          };
        }
      }

      addToast({
        title: 'Success',
        description: `Successfully authenticated with ${provider}!`,
        color: 'success',
        timeout: 3000
      });

      return { isCompleted: false, user: null, token: null, chatToken: null };
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
      throw error; // Re-throw to handle in component
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
