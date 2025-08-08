import { type IUserProfile } from '@root/modules/profile/types';

import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';
import { type RegistrationData } from '@/lib/types/auth';
import { getBaseUrl } from '@/lib/utils/utilities';

interface OAuthResponse {
  success: boolean;
  data?: {
    user: IUserProfile;
    token: string;
  };
  error?: string;
}
// Existing auth functions
export const login = async (data: unknown) => {
  return wingManApi.post(API_ROUTES.auth.login, data);
};

export const register = async (data: RegistrationData) => {
  return wingManApi.post(API_ROUTES.auth.register, data);
};

export const getSubscriptions = async () => {
  const subscriptions = await wingManApi.get(API_ROUTES.auth.subscriptions);
  return subscriptions;
};

export const checkValidEUVAT = async (countryCode: string, vatNumber: string) => {
  return wingManApi.get(
    `${API_ROUTES.auth.checkValidEUVAT}?countryCode=${countryCode}&vatNumber=${vatNumber}`
  );
};

export const completeProfileService = async (data: RegistrationData, token: string) => {
  return wingManApi.post(API_ROUTES.auth.completeProfile, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const handleOAuth = (provider: 'google' | 'linkedin'): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const authUrl = `https://dev.extraexpertise.be/api/auth/${provider}`;
    const authWindow = window.open(
      authUrl,
      `${provider}AuthPopup`,
      'width=500,height=600,resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=no'
    );

    if (!authWindow) {
      reject(
        new Error('Failed to open authentication window. Please check your popup blocker settings.')
      );
      return;
    }

    const messageListener = (event: MessageEvent<OAuthResponse>) => {
      /*const baseUrl = getBaseUrl().endsWith('/api') ? getBaseUrl().slice(0, -4) : getBaseUrl();

      if (event.origin !== baseUrl) {
        console.error('Untrusted origin:', event.origin);
        window.removeEventListener('message', messageListener);
        return;
      } */

      const data = event.data;
      // Handle the OAuth response
      if (typeof data === 'object') {
        if (data.success) {
          resolve(data);
        } else {
          reject(new Error(data.error ?? `${provider} login failed`));
        }
      } else {
        reject(new Error(`Invalid response from ${provider} authentication`));
      }

      // Clean up
      window.removeEventListener('message', messageListener);
      if (!authWindow.closed) {
        authWindow.close();
      }
    };

    // Listen for messages from the popup
    window.addEventListener('message', messageListener);
    const checkClosed = setInterval(() => {
      if (authWindow.closed) {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        reject(new Error(`${provider} authentication was cancelled`));
      }
    }, 1000);
  });
};
