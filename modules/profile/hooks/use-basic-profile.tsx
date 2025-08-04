'use client';

import { profileOptions } from '@root/modules/profile/hooks/profile.server';
import { type IUserProfile } from '@root/modules/profile/types';
import { useQuery } from '@tanstack/react-query';

const useBasicProfile = () => {
  const { data, error, isLoading } = useQuery(profileOptions);

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const logout = () => {
    localStorage.removeItem('token');
    globalThis.location.href = '/';
  };

  return {
    profile: data?.data as IUserProfile,
    isLoading,
    error,
    logout
  };
};

export default useBasicProfile;
