'use client';

import { useState } from 'react';

import { addToast } from '@heroui/react';
import { handleOAuth } from '@root/modules/auth/services/auth.service';
import useUserStore from '@root/modules/auth/store/use-user-store';
import { type IUserProfile } from '@root/modules/profile/types';
import { useRouter } from 'next/navigation';

interface OAuthResponse {
  success: boolean;
  user: IUserProfile;
  token: string;
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
      if (data.token) {
        localStorage.setItem('token', data.token);
      }
      if (data.user) {
        setUser(data.user);

        // Check if user registration is complete
        if (data.user.isCompleted) {
          // User is fully registered, redirect to dashboard
          addToast({
            title: 'Welcome back!',
            description: 'Successfully logged in. Redirecting to dashboard...',
            color: 'success',
            timeout: 3000
          });

          router.push('/private/dashboard');
          return { isCompleted: true, user: data.user };
        } else {
          // User needs to complete registration
          addToast({
            title: 'Welcome!',
            description: 'Please complete your registration to continue.',
            color: 'success',
            timeout: 3000
          });
          return { isCompleted: false, user: data.user };
        }
      }

      addToast({
        title: 'Success',
        description: `Successfully authenticated with ${provider}!`,
        color: 'success',
        timeout: 3000
      });

      return { isCompleted: false, user: null };
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
