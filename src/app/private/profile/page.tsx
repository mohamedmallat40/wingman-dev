'use client';

import { useEffect } from 'react';

import { Spinner } from '@heroui/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { redirect } from 'next/navigation';

export default function ProfilePage() {
  const { profile: currentUserProfile, isLoading } = useBasicProfile();

  useEffect(() => {
    // Redirect to dynamic profile page with user ID once we have it
    if (currentUserProfile?.id) {
      redirect(`/private/profile/${currentUserProfile.id}`);
    }
  }, [currentUserProfile]);

  // Show loading while getting current user info
  if (isLoading || !currentUserProfile) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  // This should not be reached due to the redirect, but just in case
  return null;
}
