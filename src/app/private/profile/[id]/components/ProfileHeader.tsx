'use client';

import React from 'react';

import { Avatar, Badge, Button, Card, CardBody, CardHeader, Divider } from '@heroui/react';
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
} from '@/app/private/talent-pool/utils/talent-utils';
import { getImageUrl } from '@/lib/utils/utilities';

import { type ConnectionStatus, type ProfileUser } from '../types';

interface ProfileHeaderProps {
  user: ProfileUser;
  connectionStatus: ConnectionStatus;
  isOwnProfile: boolean;
  onConnect: () => void;
  onAccept: () => void;
  onRefuse: () => void;
  onBack: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  connectionStatus,
  isOwnProfile,
  onConnect,
  onAccept,
  onRefuse,
  onBack
}) => {
  const t = useTranslations();
  const router = useRouter();

  const fullName = `${user.firstName} ${user.lastName}`;
  const availabilityConfig = getAvailabilityConfig(user.statusAvailability);
  const workTypeConfig = getWorkTypeConfig(user.workType || '');
  const rate = formatRate(
    user.amount || 0,
    user.currency || 'EUR',
    user.paymentType || 'DAILY_BASED',
    t
  );

  const handleEditGeneral = () => {
    router.push('/private/settings?tab=general');
  };

  return (
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
            {t('common.back')}
          </Button>

          {/* Edit button for own profile */}
          {isOwnProfile && (
            <Button
              variant='flat'
              color='primary'
              size='sm'
              startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
              onPress={handleEditGeneral}
              className='rounded-full'
            >
              Edit Profile
            </Button>
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
                      onPress={handleEditGeneral}
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
                            onPress={handleEditGeneral}
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
                      {isOwnProfile && (
                        <Button
                          isIconOnly
                          variant='light'
                          size='sm'
                          className='text-foreground-400 hover:text-primary -mr-1 h-4 w-4'
                          onPress={handleEditGeneral}
                        >
                          <Icon icon='solar:pen-linear' className='h-3 w-3' />
                        </Button>
                      )}
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
                        <Icon icon='solar:clock-circle-linear' className='text-primary h-4 w-4' />~
                        {user.experienceYears} {t('talentPool.cards.yearsExperience')}
                        {isOwnProfile && (
                          <Button
                            isIconOnly
                            variant='light'
                            size='sm'
                            className='text-foreground-400 hover:text-primary h-4 w-4'
                            onPress={handleEditGeneral}
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
                            onPress={handleEditGeneral}
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
                      color='primary'
                      size='lg'
                      startContent={<Icon icon='solar:settings-linear' className='h-4 w-4' />}
                      onPress={() => router.push('/private/settings')}
                      className='w-full rounded-full'
                    >
                      Edit Profile
                    </Button>

                    <Button
                      variant='flat'
                      color='secondary'
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
                          startContent={<Icon icon='solar:chat-round-linear' className='h-4 w-4' />}
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

                {user.linkedinProfile && (
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
  );
};

export default ProfileHeader;
