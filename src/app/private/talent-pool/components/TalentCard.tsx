'use client';

import React from 'react';

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { type TalentCardProps } from '../types';
import {
  getAvailabilityConfig,
  getWorkTypeConfig,
  formatRate,
  getCountryFlag,
  mapUserType,
  getUserInitials,
  truncateText,
  stripHtml
} from '../utils/talent-utils';


const TalentCard: React.FC<TalentCardProps> = ({ user, onViewProfile, onConnect }) => {
  const t = useTranslations();
  const {
    id,
    firstName,
    lastName,
    profileImage,
    profession,
    region,
    city,
    skills,
    statusAviability,
    isConnected,
    aboutMe,
    experienceYears,
    workType,
    workingTime,
    amount,
    currency,
    paymentType,
    reviewCount,
    averageRating
  } = user;

  const availabilityConfig = getAvailabilityConfig(statusAviability);
  const workTypeConfig = getWorkTypeConfig(workType || '');
  const displaySkills = skills.slice(0, 4);
  const hasMoreSkills = skills.length > 4;
  const rate = formatRate(amount || 0, currency || 'EUR', paymentType || 'DAILY_BASED', t);
  const hasReviews = reviewCount && parseInt(reviewCount) > 0;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className='h-full w-full'
    >
      <Card className='shadow-soft hover:shadow-medium border-default-200 from-background via-background/95 to-background group relative h-full w-full overflow-hidden border bg-gradient-to-br transition-all duration-300'>
        <div className='bg-primary/5 group-hover:bg-primary/10 absolute top-0 right-0 h-24 w-24 translate-x-1/2 -translate-y-1/2 transform rounded-full blur-xl filter transition-colors duration-300'></div>
        <div className='bg-secondary/5 group-hover:bg-secondary/10 absolute bottom-0 left-0 h-24 w-24 -translate-x-1/2 translate-y-1/2 transform rounded-full blur-xl filter transition-colors duration-300'></div>

        <CardHeader className='relative pb-0'>
          <div className='flex w-full items-start gap-4'>
            <div className='relative'>
              {profileImage && profileImage.trim() ? (
                <div className='ring-primary/10 shadow-medium from-primary-200 to-secondary-200 h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br ring-2'>
                  <img
                    src={`https://app.extraexpertise.be/api/upload/${profileImage}`}
                    alt={`${firstName} ${lastName}`}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-bold text-primary-800">${getUserInitials(firstName, lastName)}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className='ring-primary/10 shadow-medium from-primary-200 to-secondary-200 text-primary-800 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold ring-2'>
                  {getUserInitials(firstName, lastName)}
                </div>
              )}
              <div className='absolute -right-1 -bottom-1'>
                <div
                  className={`border-background shadow-medium flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    availabilityConfig.color === 'success'
                      ? 'bg-success'
                      : availabilityConfig.color === 'warning'
                        ? 'bg-warning'
                        : availabilityConfig.color === 'danger'
                          ? 'bg-danger'
                          : 'bg-success'
                  }`}
                >
                  <Icon icon={availabilityConfig.icon} className='h-3 w-3 text-white' />
                </div>
              </div>
            </div>

            <div className='flex min-w-0 flex-grow flex-col gap-1'>
              <div className='flex items-start justify-between'>
                <div className='min-w-0 flex-grow'>
                  <h2 className='text-foreground truncate text-xl font-bold tracking-tight'>
                    {firstName} {lastName}
                  </h2>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='text-medium text-foreground-600 truncate font-medium'>
                      {profession &&
                      !['FULL_TIME_FREELANCER', 'PART_TIME_FREELANCER', 'STUDENT', 'FREELANCER', 'AGENCY'].includes(
                        profession
                      )
                        ? profession
                        : mapUserType(profession || user.kind || 'FREELANCER', t)}
                    </p>
                  </div>
                </div>

                <div className='ml-2 flex items-center gap-1'>
                  <Tooltip content={t('talentPool.cards.viewProfile')} placement='bottom'>
                    <Button
                      isIconOnly
                      variant='light'
                      size='sm'
                      className='text-foreground-500 hover:text-foreground transition-transform hover:scale-105'
                      onPress={() => onViewProfile?.(id)}
                    >
                      <Icon icon='solar:eye-linear' className='h-4 w-4' />
                    </Button>
                  </Tooltip>

                  <Tooltip content={t('talentPool.cards.moreOptions')} placement='bottom'>
                    <Button
                      isIconOnly
                      variant='light'
                      size='sm'
                      className='text-foreground-400 hover:text-foreground'
                    >
                      <Icon icon='solar:menu-dots-linear' className='h-4 w-4' />
                    </Button>
                  </Tooltip>
                </div>
              </div>

              <div className='mt-1 flex flex-col gap-1'>
                {region && (
                  <div className='flex items-center gap-1.5'>
                    <Icon
                      icon='solar:map-point-linear'
                      className='text-foreground-400 h-3.5 w-3.5'
                    />
                    <span className='text-small text-foreground-500 font-medium flex items-center gap-2'>
                      {city}
                      {region && (
                        <img 
                          src={`https://flagcdn.com/16x12/${region.toLowerCase()}.png`}
                          alt={`${region} flag`}
                          className='h-3 w-4 rounded-sm shadow-sm'
                          onError={(e) => {
                            // Fallback to badge if flag image fails
                            const target = e.currentTarget;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector('.country-badge')) {
                              const badge = document.createElement('div');
                              badge.className = 'country-badge inline-flex h-3 w-6 items-center justify-center rounded-sm bg-gradient-to-br from-primary-100 to-primary-200 text-xs font-bold text-primary-800 shadow-sm';
                              badge.textContent = region.toUpperCase();
                              badge.title = region;
                              parent.appendChild(badge);
                            }
                          }}
                        />
                      )}
                    </span>
                  </div>
                )}
              </div>

              <div className='mt-2 flex items-center justify-between'>
                <div className='flex flex-wrap items-center gap-2'>
                  {workType && (
                    <Chip
                      startContent={
                        <Icon icon={workTypeConfig.icon} className='h-3 w-3' />
                      }
                      variant='flat'
                      color={workTypeConfig.color}
                      size='sm'
                      className='text-tiny font-medium'
                    >
                      {t(workTypeConfig.labelKey)}
                    </Chip>
                  )}
                  {workingTime && (
                    <Chip
                      startContent={<Icon icon='solar:clock-circle-linear' className='h-3 w-3' />}
                      variant='flat'
                      color='primary'
                      size='sm'
                      className='text-tiny font-bold'
                    >
                      {workingTime.replace('_', ' ').toLowerCase()}
                    </Chip>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardBody className='relative z-10 gap-4 px-6 pt-2 pb-6'>
          {/* About Section - Always visible for consistency */}
          <div className='bg-background/80 rounded-large shadow-small border-default-200/50 border p-4 backdrop-blur-sm'>
            <h3 className='text-medium text-foreground mb-2 flex items-center gap-2 font-semibold'>
              <Icon icon='solar:user-speak-linear' className='text-primary h-4 w-4' />
              {t('talentPool.cards.about')}
            </h3>
            {aboutMe ? (
              <p className='text-small text-foreground-700 line-clamp-5 leading-relaxed'>
                {stripHtml(aboutMe)}
              </p>
            ) : (
              <div className='py-4 text-center'>
                <p className='text-small text-foreground-500'>{t('talentPool.cards.noAboutAvailable')}</p>
              </div>
            )}
          </div>

          {/* Skills Section */}
          <div className='bg-background/80 rounded-large shadow-small border-default-200/50 border p-4 backdrop-blur-sm'>
            <h3 className='text-medium text-foreground mb-3 flex items-center gap-2 font-semibold'>
              <Icon icon='solar:verified-check-linear' className='text-primary h-4 w-4' />
              {t('talentPool.cards.topSkills')}
            </h3>
            {displaySkills.length > 0 ? (
              <div className='flex flex-wrap gap-2'>
                {displaySkills.map((skill, index) => (
                  <Chip
                    key={`${skill.key}-${index}`}
                    size='sm'
                    color={skill.type === 'SOFT' ? 'secondary' : 'primary'}
                    variant={skill.type === 'SOFT' ? 'flat' : 'flat'}
                    className='max-w-full cursor-pointer font-medium transition-transform hover:scale-105'
                  >
                    <span className='block max-w-[120px] truncate'>
                      {truncateText(skill.key, 70)}
                    </span>
                  </Chip>
                ))}
                {hasMoreSkills && (
                  <Chip
                    variant='bordered'
                    size='sm'
                    className='text-foreground-500 border-dashed font-medium'
                  >
                    +{skills.length - 4} {t('talentPool.cards.moreSkills')}
                  </Chip>
                )}
              </div>
            ) : (
              <div className='py-4 text-center'>
                <p className='text-small text-foreground-500'>{t('talentPool.cards.noSkillsListed')}</p>
              </div>
            )}
          </div>

          {/* Stats Section */}
          <div className='grid grid-cols-3 gap-3'>
            <div className='bg-background/80 rounded-large shadow-small border-default-200/50 border p-3 text-center backdrop-blur-sm'>
              <div className='mb-2 flex justify-center'>
                <div className='bg-primary/10 rounded-full p-2'>
                  <Icon icon='solar:calendar-linear' className='text-primary h-4 w-4' />
                </div>
              </div>
              <p className='text-tiny text-foreground-500 font-medium'>{t('talentPool.cards.experience')}</p>
              <p className='text-small text-foreground font-bold'>{experienceYears || 0} {t('talentPool.cards.yearsExperience')}</p>
            </div>

            <div className='bg-background/80 rounded-large shadow-small border-default-200/50 border p-3 text-center backdrop-blur-sm'>
              <div className='mb-2 flex justify-center'>
                <div className='bg-success/10 rounded-full p-2'>
                  <Icon icon='solar:dollar-minimalistic-linear' className='text-success h-4 w-4' />
                </div>
              </div>
              <p className='text-tiny text-foreground-500 font-medium'>{t('talentPool.cards.rate')}</p>
              <p className='text-small text-foreground font-bold'>{rate}</p>
            </div>

            <div className='bg-background/80 rounded-large shadow-small border-default-200/50 border p-3 text-center backdrop-blur-sm'>
              <div className='mb-2 flex justify-center'>
                <div className='bg-secondary/10 rounded-full p-2'>
                  <Icon icon='solar:verified-check-linear' className='text-secondary h-4 w-4' />
                </div>
              </div>
              <p className='text-tiny text-foreground-500 font-medium'>{t('talentPool.cards.skills')}</p>
              <p className='text-small text-foreground font-bold'>{skills?.length || 0} {t('talentPool.cards.skillsCount')}</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default TalentCard;
