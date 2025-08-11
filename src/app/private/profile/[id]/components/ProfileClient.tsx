'use client';

import React, { useEffect, useState } from 'react';

import { Card, CardBody, CardHeader, Skeleton, Spinner } from '@heroui/react';
import { addToast } from '@heroui/toast';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import wingManApi from '@/lib/axios';

import { type ProfileData } from '../types';
import ErrorState from './ErrorState';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

interface ProfileClientProps {
  userId: string;
}

const ProfileClient: React.FC<ProfileClientProps> = ({ userId }) => {
  const router = useRouter();
  const t = useTranslations();
  const { profile: currentUserProfile } = useBasicProfile();

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if this is the current user's profile
  const isOwnProfile = currentUserProfile?.id === userId;

  useEffect(() => {
    fetchProfileData();
  }, [userId]);

  const fetchProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        userResponse,
        experiencesResponse,
        languagesResponse,
        educationResponse,
        notesResponse,
        connectionResponse
      ] = await Promise.allSettled([
        wingManApi.get(`users/${userId}`),
        wingManApi.get(`experience/byUser/${userId}`),
        wingManApi.get(`languages/byUser/${userId}`),
        wingManApi.get(`education/byUser/${userId}`),
        wingManApi.get(`notes/${userId}`),
        // Only check connection status if not own profile
        isOwnProfile
          ? Promise.resolve({ data: null })
          : wingManApi.get(`invitations/check_user_connection/${userId}`)
      ]);

      // Check if user data failed (critical)
      if (userResponse.status === 'rejected') {
        throw new Error(t('talentPool.profile.error.userNotFound'));
      }

      const profileData: ProfileData = {
        user: userResponse.value.data,
        experiences:
          experiencesResponse.status === 'fulfilled' ? experiencesResponse.value.data : [],
        languages: languagesResponse.status === 'fulfilled' ? languagesResponse.value.data : [],
        education: educationResponse.status === 'fulfilled' ? educationResponse.value.data : [],
        notes: notesResponse.status === 'fulfilled' ? notesResponse.value.data : [],
        connectionStatus: isOwnProfile
          ? {
              isConnected: true, // Own profile is always "connected"
              isPending: false,
              canConnect: false,
              canAccept: false,
              invitationId: null
            }
          : connectionResponse.status === 'fulfilled'
            ? {
                isConnected: connectionResponse.value.data?.status === 'ACCEPTED',
                isPending: connectionResponse.value.data?.status === 'PENDING',
                canConnect:
                  !connectionResponse.value.data?.status ||
                  connectionResponse.value.data?.status === 'REJECTED',
                canAccept:
                  connectionResponse.value.data?.status === 'PENDING' &&
                  connectionResponse.value.data?.receiverId === currentUserProfile?.id,
                invitationId: connectionResponse.value.data?.id
              }
            : {
                isConnected: false,
                isPending: false,
                canConnect: true,
                canAccept: false,
                invitationId: null
              }
      };

      setProfileData(profileData);
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError(err instanceof Error ? err.message : t('talentPool.profile.error.failedToLoad'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    if (!profileData?.connectionStatus.canConnect || isOwnProfile) {
      return;
    }

    try {
      // Send invitation request
      await wingManApi.post(`invitations/${userId}`);

      addToast({
        title: 'Invitation sent successfully!',
        description: "Your connection request has been sent. You'll be notified when they respond.",
        color: 'success',
        timeout: 4000
      });

      // Refresh connection status
      const connectionResponse = await wingManApi.get(
        `invitations/check_user_connection/${userId}`
      );

      const newConnectionStatus = {
        isConnected: connectionResponse.data?.status === 'ACCEPTED',
        isPending: connectionResponse.data?.status === 'PENDING',
        canConnect:
          !connectionResponse.data?.status || connectionResponse.data?.status === 'REJECTED'
      };

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: newConnectionStatus
            }
          : null
      );
    } catch (err) {
      console.error('Error connecting to user:', err);
      addToast({
        title: 'Failed to send invitation',
        description: 'Something went wrong. Please try again later.',
        color: 'danger',
        timeout: 4000
      });
    }
  };

  const handleAccept = async () => {
    if (!profileData?.connectionStatus.invitationId || isOwnProfile) return;

    try {
      await wingManApi.patch(`invitations/accept/${profileData.connectionStatus.invitationId}`);

      addToast({
        title: 'Invitation accepted!',
        description: 'You are now connected and can chat with each other.',
        color: 'success',
        timeout: 4000
      });

      // Refresh connection status
      const connectionResponse = await wingManApi.get(
        `invitations/check_user_connection/${userId}`
      );

      const newConnectionStatus = {
        isConnected: connectionResponse.data?.status === 'ACCEPTED',
        isPending: connectionResponse.data?.status === 'PENDING',
        canConnect:
          !connectionResponse.data?.status || connectionResponse.data?.status === 'REJECTED',
        canAccept:
          connectionResponse.data?.status === 'PENDING' &&
          connectionResponse.data?.receiverId === currentUserProfile?.id,
        invitationId: connectionResponse.data?.id
      };

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: newConnectionStatus
            }
          : null
      );
    } catch (err) {
      addToast({
        title: 'Failed to accept invitation',
        description: 'Something went wrong. Please try again later.',
        color: 'danger',
        timeout: 4000
      });
    }
  };

  const handleRefuse = async () => {
    if (!profileData?.connectionStatus.invitationId || isOwnProfile) return;

    try {
      await wingManApi.patch(`invitations/declined/${profileData.connectionStatus.invitationId}`);

      addToast({
        title: 'Invitation declined',
        description: 'The invitation has been declined.',
        color: 'warning',
        duration: 4000
      });

      // Refresh connection status
      const connectionResponse = await wingManApi.get(
        `invitations/check_user_connection/${userId}`
      );

      const newConnectionStatus = {
        isConnected: connectionResponse.data?.status === 'ACCEPTED',
        isPending: connectionResponse.data?.status === 'PENDING',
        canConnect:
          !connectionResponse.data?.status || connectionResponse.data?.status === 'REJECTED',
        canAccept:
          connectionResponse.data?.status === 'PENDING' &&
          connectionResponse.data?.receiverId === currentUserProfile?.id,
        invitationId: connectionResponse.data?.id
      };

      setProfileData((prev) =>
        prev
          ? {
              ...prev,
              connectionStatus: newConnectionStatus
            }
          : null
      );
    } catch (err) {
      console.error('Error refusing invitation:', err);
      addToast({
        title: 'Failed to decline invitation',
        description: 'Something went wrong. Please try again later.',
        color: 'danger',
        duration: 4000
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !profileData) {
    return (
      <ErrorState
        error={error || t('talentPool.profile.error.profileNotFound')}
        onRetry={fetchProfileData}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className='from-background to-default-50 dark:to-default-900/20 min-h-screen bg-gradient-to-b'>
      <ProfileHeader
        user={profileData.user}
        connectionStatus={profileData.connectionStatus}
        isOwnProfile={isOwnProfile}
        onConnect={handleConnect}
        onAccept={handleAccept}
        onRefuse={handleRefuse}
        onBack={handleBack}
      />

      <ProfileContent
        user={profileData.user}
        experiences={profileData.experiences}
        languages={profileData.languages}
        education={profileData.education}
        notes={profileData.notes}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
};

// Loading skeleton component
const ProfileSkeleton: React.FC = () => {
  return (
    <div className='from-background to-default-50 dark:to-default-900/20 min-h-screen bg-gradient-to-b'>
      {/* Header Skeleton */}
      <div className='relative'>
        <div className='from-primary/10 via-secondary/5 to-primary/10 absolute inset-0 -z-10 bg-gradient-to-r' />
        <div className='container mx-auto px-4 pt-6 pb-8'>
          <div className='mb-6 flex items-center justify-between'>
            <Skeleton className='h-6 w-16 rounded-lg' />
            <div className='flex gap-2'>
              <Skeleton className='h-8 w-20 rounded-full' />
              <Skeleton className='h-8 w-24 rounded-full' />
            </div>
          </div>

          <Card className='border-default-200 overflow-hidden'>
            <div className='from-primary/20 to-secondary/20 relative h-32 bg-gradient-to-r' />
            <CardBody className='relative -mt-12 p-6'>
              <div className='flex flex-col gap-6 lg:flex-row lg:items-end'>
                <Skeleton className='h-24 w-24 rounded-full' />
                <div className='flex-1 space-y-4'>
                  <div className='space-y-2'>
                    <Skeleton className='h-8 w-64 rounded-lg' />
                    <Skeleton className='h-5 w-96 rounded-lg' />
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <Skeleton className='h-10 w-24 rounded-full' />
                    <Skeleton className='h-10 w-32 rounded-full' />
                    <Skeleton className='h-10 w-28 rounded-full' />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className='container mx-auto px-4 pb-16'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          <div className='space-y-6 lg:col-span-2'>
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-6 w-32 rounded-lg' />
                  <Skeleton className='h-4 w-48 rounded-lg' />
                </CardHeader>
                <CardBody className='space-y-4'>
                  <Skeleton className='h-4 w-full rounded-lg' />
                  <Skeleton className='h-4 w-3/4 rounded-lg' />
                  <Skeleton className='h-4 w-5/6 rounded-lg' />
                </CardBody>
              </Card>
            ))}
          </div>

          <div className='space-y-6'>
            {[1, 2].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className='h-6 w-24 rounded-lg' />
                </CardHeader>
                <CardBody className='space-y-3'>
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className='h-4 w-full rounded-lg' />
                  ))}
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
