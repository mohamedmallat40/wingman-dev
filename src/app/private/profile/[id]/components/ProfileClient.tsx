'use client';

import React, { useEffect, useState } from 'react';

import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import { addToast } from '@heroui/toast';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import wingManApi from '@/lib/axios';

import { type ProfileData } from '../types';
import ErrorState from './ErrorState';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';
import { profile } from 'console';

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
        servicesResponse,
        testimonialsResponse,
        connectionResponse
      ] = await Promise.allSettled([
        wingManApi.get(`users/${userId}`),
        wingManApi.get(`experience/byUser/${userId}`),
        wingManApi.get(`languages/byUser/${userId}`),
        wingManApi.get(`education/byUser/${userId}`),
        wingManApi.get(`notes/${userId}`),
        wingManApi.get(`services/user/${userId}`),
        wingManApi.get(`public-reviews/${userId}/active`),
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
        services: servicesResponse.status === 'fulfilled' ? servicesResponse.value.data : [],
        testimonials: testimonialsResponse.status === 'fulfilled' ? testimonialsResponse.value.data : [],
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
        experiences={profileData.experiences}
        education={profileData.education}
        languages={profileData.languages}
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
        projects={profileData.projects}
        services={profileData.services}
        testimonials={profileData.testimonials}
      />
    </div>
  );
};

// Loading skeleton component
const ProfileSkeleton: React.FC = () => {
  return (
    <div className='from-background to-default-50 dark:to-default-900/20 min-h-screen bg-gradient-to-b'>
      {/* ProfileHeader Skeleton - Exact Match */}
      <section className='from-background via-background to-default-50/30 relative overflow-hidden bg-gradient-to-br'>
        {/* Enhanced background */}
        <div className='from-primary/3 to-secondary/3 absolute inset-0 -z-10 bg-gradient-to-br via-transparent' />

        <div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          {/* Navigation */}
          <nav className='mb-6 flex items-center justify-between'>
            <Skeleton className='h-9 w-16 rounded-md' />
            <Skeleton className='h-9 w-44 rounded-full' />
          </nav>

          {/* Main Profile Card */}
          <Card className='border-primary/10 border shadow-sm'>
            <CardBody className='p-4 sm:p-6'>
              <div className='flex flex-col gap-6 lg:flex-row'>
                <div className='flex flex-1 gap-4'>
                  <div className='relative'>
                    <Skeleton className='h-36 w-36 rounded-xl sm:h-40 sm:w-40' />
                    <Skeleton className='absolute -right-2 -bottom-2 h-8 w-8 rounded-full' />
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <Skeleton className='h-8 w-64 rounded-lg' />
                          <Skeleton className='h-6 w-6 rounded-sm' />
                        </div>
                        <Skeleton className='h-5 w-80 rounded-lg' />
                      </div>
                    </div>

                    {/* Key Information badges */}
                    <div className='mt-3 flex flex-wrap items-center gap-2'>
                      <Skeleton className='h-7 w-24 rounded-lg' />
                      <Skeleton className='h-7 w-20 rounded-lg' />
                    </div>

                    {/* Details */}
                    <div className='mt-3 flex flex-wrap items-center gap-3'>
                      <Skeleton className='h-4 w-32 rounded-lg' />
                      <Skeleton className='h-4 w-28 rounded-lg' />
                      <Skeleton className='h-4 w-36 rounded-lg' />
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className='flex min-w-56 flex-col items-stretch gap-2'>
                  <Skeleton className='h-12 w-full rounded-full' />
                  <Skeleton className='h-12 w-full rounded-full' />
                  <div className='flex gap-2'>
                    <Skeleton className='h-12 flex-1 rounded-full' />
                    <Skeleton className='h-12 flex-1 rounded-full' />
                    <Skeleton className='h-12 flex-1 rounded-full' />
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* ProfileContent Skeleton - Exact Match */}
      <section className='container mx-auto px-6 pb-20'>
        <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
          {/* Main content */}
          <div className='space-y-8 lg:col-span-2'>
            {/* About Section */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-16 rounded-lg' />
                      <Skeleton className='h-4 w-40 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='px-8 pt-2'>
                <div className='space-y-3'>
                  <Skeleton className='h-4 w-full rounded-lg' />
                  <Skeleton className='h-4 w-5/6 rounded-lg' />
                  <Skeleton className='h-4 w-4/5 rounded-lg' />
                  <Skeleton className='h-4 w-3/4 rounded-lg' />
                </div>
              </CardBody>
            </Card>

            {/* Experience Section */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-24 rounded-lg' />
                      <Skeleton className='h-4 w-48 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='px-8 pt-2'>
                <div className='space-y-8'>
                  {[1, 2].map((i) => (
                    <div key={i} className='flex gap-6'>
                      <Skeleton className='h-5 w-5 rounded-sm flex-shrink-0 mt-2' />
                      <div className='flex-1 space-y-4'>
                        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                          <div className='space-y-2'>
                            <Skeleton className='h-5 w-48 rounded-lg' />
                            <Skeleton className='h-4 w-32 rounded-lg' />
                            <Skeleton className='h-3 w-28 rounded-lg' />
                          </div>
                          <Skeleton className='h-8 w-32 rounded-full' />
                        </div>
                        <div className='space-y-2'>
                          <Skeleton className='h-4 w-full rounded-lg' />
                          <Skeleton className='h-4 w-4/5 rounded-lg' />
                        </div>
                        <div className='flex flex-wrap gap-2'>
                          <Skeleton className='h-6 w-16 rounded-full' />
                          <Skeleton className='h-6 w-20 rounded-full' />
                          <Skeleton className='h-6 w-18 rounded-full' />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Education Section */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-6 w-20 rounded-lg' />
                      <Skeleton className='h-4 w-44 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='px-8 pt-2'>
                <div className='space-y-8'>
                  {[1, 2].map((i) => (
                    <div key={i} className='flex gap-6'>
                      <Skeleton className='h-5 w-5 rounded-sm flex-shrink-0 mt-2' />
                      <div className='flex-1'>
                        <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                          <div className='space-y-2'>
                            <Skeleton className='h-5 w-52 rounded-lg' />
                            <Skeleton className='h-4 w-36 rounded-lg' />
                            <Skeleton className='h-3 w-28 rounded-lg' />
                          </div>
                          <Skeleton className='h-8 w-28 rounded-full' />
                        </div>
                        <Skeleton className='h-4 w-4/5 mt-4 rounded-lg' />
                        <Skeleton className='h-6 w-20 mt-4 rounded-full' />
                      </div>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Sidebar */}
          <div className='space-y-8'>
            {/* Skills Card */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-12 rounded-lg' />
                      <Skeleton className='h-4 w-32 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='pt-2'>
                <div className='flex flex-wrap gap-3'>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className='h-6 w-16 rounded-full' />
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Languages Card */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-20 rounded-lg' />
                      <Skeleton className='h-4 w-40 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='px-8 pt-2'>
                <div className='space-y-3'>
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className='shadow-small border-none'>
                      <CardBody className='p-4'>
                        <div className='space-y-3'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                              <Skeleton className='h-6 w-8 rounded-sm' />
                              <div className='space-y-1'>
                                <Skeleton className='h-4 w-16 rounded-lg' />
                                <Skeleton className='h-3 w-12 rounded-lg' />
                              </div>
                            </div>
                            <Skeleton className='h-6 w-20 rounded-full' />
                          </div>
                          <div className='space-y-2'>
                            <div className='flex items-center justify-between'>
                              <Skeleton className='h-3 w-16 rounded-lg' />
                              <Skeleton className='h-3 w-8 rounded-lg' />
                            </div>
                            <Skeleton className='h-2 w-full rounded-full' />
                          </div>
                          <div className='flex flex-wrap gap-1'>
                            {[1, 2, 3, 4].map((j) => (
                              <Skeleton key={j} className='h-5 w-8 rounded-full' />
                            ))}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Social Accounts Card */}
            <Card className='border-default-200/50 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex w-full items-center justify-between'>
                  <div className='flex items-center gap-4'>
                    <Skeleton className='h-11 w-11 rounded-full' />
                    <div className='space-y-2'>
                      <Skeleton className='h-5 w-28 rounded-lg' />
                      <Skeleton className='h-4 w-44 rounded-lg' />
                    </div>
                  </div>
                  <Skeleton className='h-8 w-8 rounded-sm' />
                </div>
              </CardHeader>
              <CardBody className='px-8 pt-2'>
                <div className='grid grid-cols-2 gap-3'>
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className='h-20 w-full rounded-lg' />
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Profile Summary Card */}
            <Card className='border-primary/20 shadow-sm'>
              <CardBody className='p-8 text-center'>
                <Skeleton className='mx-auto mb-4 h-20 w-20 rounded-full' />
                <Skeleton className='mx-auto mb-3 h-5 w-32 rounded-lg' />
                <Skeleton className='mx-auto mb-4 h-8 w-24 rounded-full' />
                <Skeleton className='mx-auto mb-4 h-px w-full rounded-full' />
                <div className='space-y-2'>
                  <Skeleton className='mx-auto h-3 w-full rounded-lg' />
                  <Skeleton className='mx-auto h-3 w-4/5 rounded-lg' />
                  <Skeleton className='mx-auto h-3 w-3/4 rounded-lg' />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfileClient;
