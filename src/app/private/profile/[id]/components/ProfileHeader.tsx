'use client';

import React, { useState } from 'react';

import { Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { getCountryFlag, getCountryName } from '@/app/private/talent-pool/utils/country-flags';
import {
  formatRate,
  getAvailabilityConfig,
  getUserInitials,
  getWorkTypeConfig,
  mapUserType,
  mapWorkingTime
} from '@/app/private/talent-pool/utils/talent-utilities';
import type { AvailabilityStatus, WorkType, Currency, PaymentType } from '@/app/private/talent-pool/types';
import { getImageUrl } from '@/lib/utils/utilities';

import {
  type ConnectionStatus,
  type Education,
  type Experience,
  type Language,
  type ProfileUser
} from '../types';
import {
  calculateProfileCompletion,
  getCompletionColor,
  getCompletionMessage
} from '../utils/profileCompletion';
import CVUploadDrawer from './CVUploadDrawer';
import EditPersonalDataModal from './modals/edit-personal-data';

interface ProfileHeaderProps {
  user: ProfileUser;
  connectionStatus: ConnectionStatus;
  isOwnProfile: boolean;
  experiences?: Experience[];
  education?: Education[];
  languages?: Language[];
  onConnect: () => void;
  onAccept: () => void;
  onRefuse: () => void;
  onBack: () => void;
  onProfileUpdate?: () => void; // Added callback for profile updates
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  connectionStatus,
  isOwnProfile,
  experiences = [],
  education = [],
  languages = [],
  onConnect,
  onAccept,
  onRefuse,
  onBack,
  onProfileUpdate
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isCVUploadOpen, setIsCVUploadOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Added state for edit modal

  const fullName = `${user.firstName} ${user.lastName}`;
  const availabilityConfig = getAvailabilityConfig(user!.statusAviability as AvailabilityStatus);
  const workTypeConfig = getWorkTypeConfig((user.workType ?? 'REMOTE') as WorkType);
  const rate = formatRate(
    user.amount || 0,
    (user.currency || 'EUR') as Currency,
    (user.paymentType || 'DAILY_BASED') as PaymentType,
    t
  );

  const handleEditProfile = () => {
    setIsEditModalOpen(true); // Open edit modal instead of CV upload
  };

  const handleCVUpload = () => {
    setIsCVUploadOpen(true); // Separate function for CV upload
  };

  const handleCVDataParsed = (data: any) => {
    // Here you would typically refresh the profile data or update the UI
    // to reflect the newly imported information
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  const handleProfileUpdateSuccess = () => {
    // Called when profile is successfully updated
    if (onProfileUpdate) {
      onProfileUpdate();
    }
  };

  // Calculate profile completion
  const completionPercentage = calculateProfileCompletion({
    user,
    experiences,
    education,
    languages
  });
  const completionColor = getCompletionColor(completionPercentage);
  const completionMessage = getCompletionMessage(completionPercentage);

  return (
    <>
      <section className='from-background via-background to-default-50/30 relative overflow-hidden bg-gradient-to-br'>
        {/* Enhanced background */}
        <div className='from-primary/3 to-secondary/3 absolute inset-0 -z-10 bg-gradient-to-br via-transparent' />

        <div className='container mx-auto px-4 py-6 sm:px-6 lg:px-8'>
          {/* Navigation */}
          <nav className='mb-6 flex items-center justify-between'>
            <Button
              variant='light'
              size='sm'
              startContent={<Icon icon='solar:arrow-left-linear' className='h-4 w-4' />}
              onPress={onBack}
              className='text-foreground-500 hover:text-primary rounded-md transition-colors'
            >
              <span className='hidden sm:inline'>{t('common.back')}</span>
            </Button>

            {/* Profile Completion Chip */}
            {isOwnProfile && (
              <div className='flex items-center gap-2'>
                <Chip
                  color={completionColor}
                  variant='flat'
                  size='sm'
                  className='font-semibold'
                  startContent={<Icon icon='solar:chart-outline' className='h-3 w-3' />}
                >
                  {completionPercentage}% Complete
                </Chip>
                <p className='text-default-500 hidden text-xs sm:inline'>
                  Complete your profile for better reach
                </p>
              </div>
            )}
          </nav>

          {/* Main Profile Card */}
          <Card className='border-primary/10 border shadow-sm transition-shadow hover:shadow-md'>
            <CardBody className='p-4 sm:p-6'>
              <div className='flex flex-col gap-6 lg:flex-row'>
                <div className='flex flex-1 gap-4'>
                  <div className='relative'>
                    {user.profileImage && user.profileImage.trim() ? (
                      <div className='ring-primary/20 from-primary-200 to-secondary-200 h-36 w-36 overflow-hidden rounded-xl bg-gradient-to-br shadow-lg ring-2 sm:h-40 sm:w-40'>
                        <img
                          src={getImageUrl(user.profileImage)}
                          alt={`${user.firstName} ${user.lastName}`}
                          className='h-full w-full object-cover'
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            const parent = e.currentTarget.parentElement;
                            if (parent) {
                              parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-800 sm:text-6xl">${getUserInitials(user.firstName, user.lastName)}</div>`;
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className='ring-primary/20 from-primary-200 to-secondary-200 text-primary-800 flex h-36 w-36 items-center justify-center rounded-xl bg-gradient-to-br text-5xl font-bold shadow-lg ring-2 sm:h-40 sm:w-40 sm:text-6xl'>
                        {getUserInitials(user.firstName, user.lastName)}
                      </div>
                    )}

                    {/* Edit avatar button for own profile */}
                    {isOwnProfile && (
                      <Button
                        isIconOnly
                        variant='flat'
                        color='primary'
                        size='sm'
                        className='absolute -right-2 -bottom-2 rounded-full shadow-lg'
                        onPress={handleEditProfile}
                      >
                        <Icon icon='solar:pen-linear' className='h-3 w-3' />
                      </Button>
                    )}
                  </div>

                  <div className='flex-1'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h1 className='text-foreground flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl'>
                          {fullName}
                          {isOwnProfile && (
                            <Button
                              isIconOnly
                              variant='light'
                              size='sm'
                              className='text-foreground-400 hover:text-primary'
                              onPress={handleEditProfile}
                            >
                              <Icon icon='solar:pen-linear' className='h-4 w-4' />
                            </Button>
                          )}
                        </h1>
                        <p className='text-foreground-500 mt-1'>
                          {mapUserType(user.profession || user.kind || 'FREELANCER', t)} ·{' '}
                          {user.workType ? t(workTypeConfig.labelKey) : 'Remote'} ·{' '}
                          {user.workingTime ? mapWorkingTime(user.workingTime, t) : ''}
                        </p>
                      </div>
                    </div>

                    {/* Key Information - Freelancer & Availability */}
                    <div className='mt-3 flex flex-wrap items-center gap-2'>
                      {/* Freelancer Type */}
                      <div className='border-primary/20 bg-primary/10 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5'>
                        <Icon icon='solar:user-id-linear' className='text-primary h-3.5 w-3.5' />
                        <span className='text-primary-700 dark:text-primary-600 text-sm font-medium'>
                          {mapUserType(user.kind, t)}
                        </span>
                      </div>

                      {/* Availability Status */}
                      <div
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 ${
                          availabilityConfig.color === 'success'
                            ? 'border-success/20 bg-success/10'
                            : availabilityConfig.color === 'warning'
                              ? 'border-warning/20 bg-warning/10'
                              : availabilityConfig.color === 'danger'
                                ? 'border-danger/20 bg-danger/10'
                                : 'border-success/20 bg-success/10'
                        }`}
                      >
                        <Icon
                          icon={availabilityConfig.icon}
                          className={`h-3.5 w-3.5 ${
                            availabilityConfig.color === 'success'
                              ? 'text-success'
                              : availabilityConfig.color === 'warning'
                                ? 'text-warning'
                                : availabilityConfig.color === 'danger'
                                  ? 'text-danger'
                                  : 'text-success'
                          }`}
                        />
                        <span
                          className={`text-sm font-medium ${
                            availabilityConfig.color === 'success'
                              ? 'text-success-700 dark:text-success-600'
                              : availabilityConfig.color === 'warning'
                                ? 'text-warning-700 dark:text-warning-600'
                                : availabilityConfig.color === 'danger'
                                  ? 'text-danger-700 dark:text-danger-600'
                                  : 'text-success-700 dark:text-success-600'
                          }`}
                        >
                          {t(availabilityConfig.labelKey)}
                        </span>
                      </div>
                    </div>

                    <div className='text-foreground-500 mt-3 flex flex-wrap items-center gap-3 text-sm'>
                      {user.email && (
                        <span className='inline-flex items-center gap-1'>
                          <Icon icon='solar:verified-check-bold' className='text-primary h-4 w-4' />
                          {t('talentPool.profile.emailVerified')}
                        </span>
                      )}
                      {user.experienceYears && (
                        <span className='inline-flex items-center gap-1'>
                          <Icon icon='solar:clock-circle-linear' className='text-primary h-4 w-4' />
                          ~{user.experienceYears} {t('talentPool.cards.yearsExperience')}
                          {isOwnProfile && (
                            <Button
                              isIconOnly
                              variant='light'
                              size='sm'
                              className='text-foreground-400 hover:text-primary h-4 w-4'
                              onPress={handleEditProfile}
                            >
                              <Icon icon='solar:pen-linear' className='h-2.5 w-2.5' />
                            </Button>
                          )}
                        </span>
                      )}
                      {(user.city || user.region) && (
                        <span className='inline-flex items-center gap-2'>
                          <Icon icon='solar:map-point-linear' className='text-primary h-4 w-4' />
                          <span className='flex items-center gap-1.5'>
                            {user.city}
                            {user.region && (
                              <>
                                {user.city && <span>,</span>}
                                <img
                                  src={getCountryFlag(user.region!)}
                                  alt={`${getCountryName(user.region!)} flag`}
                                  className='h-3 w-4 rounded-sm shadow-sm'
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const parent = target.parentElement;
                                    if (parent && !parent.querySelector('.country-text')) {
                                      const textSpan = document.createElement('span');
                                      textSpan.className =
                                        'country-text text-xs font-medium text-foreground-600';
                                      textSpan.textContent = user.region!.toUpperCase();
                                      textSpan.title = getCountryName(user.region!);
                                      parent.appendChild(textSpan);
                                    }
                                  }}
                                />
                              </>
                            )}
                          </span>
                          {isOwnProfile && (
                            <Button
                              isIconOnly
                              variant='light'
                              size='sm'
                              className='text-foreground-400 hover:text-primary h-4 w-4'
                              onPress={handleEditProfile}
                            >
                              <Icon icon='solar:pen-linear' className='h-2.5 w-2.5' />
                            </Button>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className='flex min-w-56 flex-col items-stretch gap-2'>
                  {isOwnProfile ? (
                    // Own profile actions
                    <div className='space-y-2'>
                      <Button
                        variant='flat'
                        color='secondary'
                        size='lg'
                        startContent={<Icon icon='solar:document-add-linear' className='h-4 w-4' />}
                        onPress={handleCVUpload}
                        className='w-full rounded-full'
                      >
                        Upload CV & Auto-Fill
                      </Button>

                      <Button
                        variant='flat'
                        color='default'
                        size='lg'
                        startContent={<Icon icon='solar:eye-linear' className='h-4 w-4' />}
                        onPress={() => router.push('/private/profile')}
                        className='w-full rounded-full'
                      >
                        Preview Profile
                      </Button>
                    </div>
                  ) : (
                    // Other user's profile actions
                    <>
                      {connectionStatus.isConnected ? (
                        <div className='bg-success/10 border-success/20 inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3'>
                          <Icon icon='solar:check-circle-bold' className='text-success h-4 w-4' />
                          <span className='text-success-700 font-medium'>
                            {t('talentPool.cards.actions.connected')}
                          </span>
                        </div>
                      ) : connectionStatus.canAccept ? (
                        <div className='flex gap-2'>
                          <Button
                            color='success'
                            size='lg'
                            startContent={
                              <Icon icon='solar:check-circle-linear' className='h-4 w-4' />
                            }
                            onPress={onAccept}
                            className='flex-1 rounded-full'
                          >
                            Accept
                          </Button>
                          <Button
                            variant='flat'
                            color='danger'
                            size='lg'
                            startContent={
                              <Icon icon='solar:close-circle-linear' className='h-4 w-4' />
                            }
                            onPress={onRefuse}
                            className='flex-1 rounded-full'
                          >
                            Decline
                          </Button>
                        </div>
                      ) : connectionStatus.isPending ? (
                        <div className='bg-warning/10 border-warning/20 inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3'>
                          <Icon icon='solar:clock-circle-linear' className='text-warning h-4 w-4' />
                          <span className='text-warning-700 font-medium'>
                            {t('talentPool.profile.connectionPending')}
                          </span>
                        </div>
                      ) : (
                        <Button
                          color='primary'
                          size='lg'
                          startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
                          onPress={onConnect}
                          className='rounded-full'
                        >
                          {t('talentPool.cards.actions.connect')}
                        </Button>
                      )}

                      <div className='flex gap-2'>
                        {connectionStatus.isConnected && user.email && (
                          <Button
                            variant='flat'
                            color='success'
                            size='lg'
                            startContent={
                              <Icon icon='solar:chat-round-linear' className='h-4 w-4' />
                            }
                            as='a'
                            href={`mailto:${user.email}`}
                            className='flex-1 rounded-full'
                          >
                            Chat
                          </Button>
                        )}
                        {user.phoneNumber && (
                          <Button
                            variant='flat'
                            color='warning'
                            size='lg'
                            startContent={<Icon icon='solar:phone-linear' className='h-4 w-4' />}
                            as='a'
                            href={`tel:${user.phoneNumber}`}
                            className='flex-1 rounded-full'
                          >
                            Call
                          </Button>
                        )}
                      </div>
                    </>
                  )}

                  {/* Social Accounts */}
                  {user.socialAccounts &&
                    user.socialAccounts.filter((account) => account.isPublic).length > 0 && (
                      <div className='flex flex-wrap gap-2'>
                        {user.socialAccounts
                          .filter((account) => account.isPublic)
                          .slice(0, 4)
                          .map((account, index) => {
                            const platformDetails = {
                              linkedin: {
                                icon: 'solar:linkedin-linear',
                                color: 'text-blue-600',
                                buttonColor: 'primary'
                              },
                              github: {
                                icon: 'solar:code-square-linear',
                                color: 'text-gray-800',
                                buttonColor: 'default'
                              },
                              twitter: {
                                icon: 'solar:twitter-linear',
                                color: 'text-blue-400',
                                buttonColor: 'primary'
                              },
                              instagram: {
                                icon: 'solar:instagram-linear',
                                color: 'text-pink-600',
                                buttonColor: 'secondary'
                              },
                              facebook: {
                                icon: 'solar:facebook-linear',
                                color: 'text-blue-700',
                                buttonColor: 'primary'
                              },
                              youtube: {
                                icon: 'solar:youtube-linear',
                                color: 'text-red-600',
                                buttonColor: 'danger'
                              },
                              tiktok: {
                                icon: 'solar:music-note-linear',
                                color: 'text-black',
                                buttonColor: 'default'
                              },
                              behance: {
                                icon: 'solar:palette-linear',
                                color: 'text-blue-500',
                                buttonColor: 'primary'
                              },
                              dribbble: {
                                icon: 'solar:basketball-linear',
                                color: 'text-pink-500',
                                buttonColor: 'secondary'
                              },
                              medium: {
                                icon: 'solar:pen-new-square-linear',
                                color: 'text-green-600',
                                buttonColor: 'success'
                              },
                              portfolio: {
                                icon: 'solar:folder-open-linear',
                                color: 'text-purple-600',
                                buttonColor: 'secondary'
                              },
                              other: {
                                icon: 'solar:link-linear',
                                color: 'text-default-600',
                                buttonColor: 'default'
                              }
                            };

                            const details =
                              platformDetails[account.platform as keyof typeof platformDetails] ||
                              platformDetails.other;

                            return (
                              <Button
                                key={account.id || index}
                                variant='flat'
                                color={details.buttonColor as any}
                                size='lg'
                                startContent={<Icon icon={details.icon} className='h-4 w-4' />}
                                as='a'
                                href={account.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='rounded-full'
                              >
                                {account.displayName ||
                                  account.platform.charAt(0).toUpperCase() +
                                    account.platform.slice(1)}
                              </Button>
                            );
                          })}
                        {user.socialAccounts.filter((account) => account.isPublic).length > 4 && (
                          <Button
                            variant='flat'
                            color='default'
                            size='lg'
                            startContent={
                              <Icon icon='solar:add-circle-linear' className='h-4 w-4' />
                            }
                            className='rounded-full'
                          >
                            +{user.socialAccounts.filter((account) => account.isPublic).length - 4}{' '}
                            more
                          </Button>
                        )}
                      </div>
                    )}

                  {/* Fallback LinkedIn button if no social accounts */}
                  {(!user.socialAccounts || user.socialAccounts.length === 0) &&
                    user.linkedinProfile && (
                      <Button
                        variant='flat'
                        color='secondary'
                        size='lg'
                        startContent={<Icon icon='solar:link-linear' className='h-4 w-4' />}
                        as='a'
                        href={user.linkedinProfile}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='rounded-full'
                      >
                        {t('talentPool.profile.linkedin')}
                      </Button>
                    )}
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </section>

      {/* CV Upload Drawer */}
      <CVUploadDrawer
        isOpen={isCVUploadOpen}
        onOpenChange={setIsCVUploadOpen}
        onDataParsed={handleCVDataParsed}
      />

      {/* Edit Personal Data Modal */}
      <EditPersonalDataModal
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        user={user}
        onSuccess={handleProfileUpdateSuccess}
      />
    </>
  );
};

export default ProfileHeader;
