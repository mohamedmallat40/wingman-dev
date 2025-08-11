'use client';

import React, { useState } from 'react';

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress
} from '@heroui/react';
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import CVUploadDrawer from './CVUploadDrawer';

import { getImageUrl } from '@/lib/utils/utilities';

import { getSkillIcon } from '@/app/private/talent-pool/utils/skill-icons';
import { getUserInitials, mapUserType, stripHtml, truncateText } from '@/app/private/talent-pool/utils/talent-utils';
import {
  type Education,
  type Experience,
  type Language,
  type ProfileUser,
  type UserNote
} from '../types';

interface ProfileContentProps {
  user: ProfileUser;
  experiences: Experience[];
  languages: Language[];
  education: Education[];
  notes: UserNote[];
  isOwnProfile: boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  user,
  experiences,
  languages,
  education,
  notes,
  isOwnProfile
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isCVUploadOpen, setIsCVUploadOpen] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  const fullName = `${user.firstName} ${user.lastName}`;

  const handleEditAbout = () => {
    router.push('/private/settings?tab=general');
  };

  const handleEditExperience = () => {
    router.push('/private/settings?tab=experience');
  };

  const handleEditEducation = () => {
    router.push('/private/settings?tab=education');
  };

  const handleEditSkills = () => {
    router.push('/private/settings?tab=general');
  };

  return (
    <section className='container mx-auto px-6 pb-20'>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Main content */}
        <div className='space-y-8 lg:col-span-2'>
          {/* About */}
          <Card id='about' className='border-default-200/50 scroll-mt-24 shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 rounded-full p-3'>
                    <Icon icon='solar:user-speak-linear' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-xl font-semibold'>
                      {t('talentPool.profile.sections.about')}
                    </h2>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.aboutDescription')}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    className='text-foreground-400 hover:text-primary'
                    onPress={handleEditAbout}
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {user.aboutMe ? (
                <div
                  className='prose prose-slate dark:prose-invert text-foreground-700 max-w-none leading-relaxed'
                  dangerouslySetInnerHTML={{ __html: stripHtml(user.aboutMe) }}
                />
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:document-text-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>{t('talentPool.cards.noAboutAvailable')}</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:pen-linear' className='h-4 w-4' />}
                        onPress={handleEditAbout}
                      >
                        Add About Me
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Experience */}
          <Card id='experience' className='border-default-200/50 scroll-mt-24 shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-primary/10 rounded-full p-3'>
                    <Icon icon='solar:case-linear' className='text-primary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-xl font-semibold'>
                      {t('talentPool.profile.sections.experience')}
                    </h2>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.experienceDescription')}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    className='text-foreground-400 hover:text-primary'
                    onPress={handleEditExperience}
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {experiences.length > 0 ? (
                <div className='space-y-8'>
                  {[...experiences]
                    .sort(
                      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    )
                    .map((exp, index) => (
                      <div key={exp.id || index} className='relative'>
                        {index < experiences.length - 1 && (
                          <div className='from-primary/20 absolute top-14 bottom-0 left-6 w-px bg-gradient-to-b to-transparent' />
                        )}

                        <div className='flex gap-6'>
                          <div className='flex-shrink-0'>
                            <Icon
                              icon='solar:calendar-minimalistic-linear'
                              className='text-primary mt-2 h-5 w-5'
                            />
                          </div>

                          <div className='flex-1 space-y-4'>
                            <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                              <div className='space-y-2'>
                                <div className='flex items-center gap-2'>
                                  <h3 className='text-foreground text-lg font-bold'>
                                    {exp.position}
                                  </h3>
                                  {isOwnProfile && (
                                    <Button
                                      isIconOnly
                                      variant='light'
                                      size='sm'
                                      className='text-foreground-400 hover:text-primary h-6 w-6'
                                      onPress={handleEditExperience}
                                    >
                                      <Icon icon='solar:pen-linear' className='h-3 w-3' />
                                    </Button>
                                  )}
                                </div>
                                <p className='text-foreground-700 font-medium'>{exp.company}</p>
                                {exp.location && (
                                  <p className='text-small text-foreground-500 flex items-center gap-1.5'>
                                    <Icon icon='solar:map-point-linear' className='h-3 w-3' />
                                    {exp.location}
                                  </p>
                                )}
                              </div>
                              <div className='text-small text-foreground-500 bg-default-100 flex items-center gap-2 rounded-full px-3 py-2'>
                                <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                                <span>
                                  {formatDate(exp.startDate)} —{' '}
                                  {exp.endDate
                                    ? formatDate(exp.endDate)
                                    : t('talentPool.profile.present')}
                                </span>
                              </div>
                            </div>

                            {exp.description && (
                              <p className='text-foreground-600 leading-relaxed'>
                                {exp.description}
                              </p>
                            )}

                            {exp.skills && exp.skills.length > 0 && (
                              <div className='mt-4 flex flex-wrap gap-2'>
                                {exp.skills.map((skill, skillIndex) => (
                                  <Chip
                                    key={skillIndex}
                                    size='sm'
                                    variant='flat'
                                    color='primary'
                                    className='text-tiny font-medium'
                                  >
                                    {skill}
                                  </Chip>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:case-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>{t('talentPool.profile.noExperience')}</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleEditExperience}
                      >
                        Add Experience
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Education */}
          <Card id='education' className='border-default-200/50 scroll-mt-24 shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-secondary/10 rounded-full p-3'>
                    <Icon icon='solar:diploma-linear' className='text-secondary h-5 w-5' />
                  </div>
                  <div>
                    <h2 className='text-foreground text-xl font-semibold'>
                      {t('talentPool.profile.sections.education')}
                    </h2>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.educationDescription')}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    className='text-foreground-400 hover:text-primary'
                    onPress={handleEditEducation}
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {education.length > 0 ? (
                <div className='space-y-8'>
                  {[...education]
                    .sort(
                      (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
                    )
                    .map((edu, index) => (
                      <div key={edu.id || index} className='flex gap-6'>
                        <div className='flex-shrink-0'>
                          <Icon icon='solar:book-linear' className='text-secondary mt-2 h-5 w-5' />
                        </div>

                        <div className='flex-1'>
                          <div className='flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between'>
                            <div className='space-y-2'>
                              <div className='flex items-center gap-2'>
                                <h3 className='text-foreground text-lg font-semibold'>
                                  {edu.university}
                                </h3>
                                {isOwnProfile && (
                                  <Button
                                    isIconOnly
                                    variant='light'
                                    size='sm'
                                    className='text-foreground-400 hover:text-primary h-6 w-6'
                                    onPress={handleEditEducation}
                                  >
                                    <Icon icon='solar:pen-linear' className='h-3 w-3' />
                                  </Button>
                                )}
                              </div>
                              <p className='text-foreground-700 font-medium'>{edu.degree}</p>
                              {edu.field && (
                                <p className='text-small text-foreground-500'>{edu.field}</p>
                              )}
                            </div>
                            <div className='text-small text-foreground-500 bg-default-100 flex items-center gap-2 rounded-full px-3 py-2'>
                              <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                              <span>
                                {formatDate(edu.startDate)} —{' '}
                                {edu.endDate
                                  ? formatDate(edu.endDate)
                                  : t('talentPool.profile.present')}
                              </span>
                            </div>
                          </div>

                          {edu.description && (
                            <p className='text-foreground-600 mt-4 leading-relaxed'>
                              {edu.description}
                            </p>
                          )}

                          {edu.grade && (
                            <div className='mt-4'>
                              <Chip size='sm' variant='flat' color='success'>
                                {t('talentPool.profile.grade')}: {edu.grade}
                              </Chip>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:diploma-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>{t('talentPool.profile.noEducation')}</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleEditEducation}
                      >
                        Add Education
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className='space-y-8'>
          {/* Skills */}
          <Card id='skills' className='border-default-200/50 scroll-mt-24 shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-success/10 rounded-full p-3'>
                    <Icon icon='solar:verified-check-linear' className='text-success h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {t('talentPool.profile.sections.skills')}
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.skillsDescription')}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    className='text-foreground-400 hover:text-primary'
                    onPress={handleEditSkills}
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className='pt-2'>
              {user.skills && user.skills.length > 0 ? (
                <div className='flex flex-wrap gap-3'>
                  {user.skills.map((skill, index) => {
                    const colors = ['primary', 'secondary', 'success', 'warning'] as const;
                    const chipColor = colors[index % colors.length] as 'primary' | 'secondary' | 'success' | 'warning';

                    return (
                      <Chip
                        key={`${skill.key}-${index}`}
                        size='sm'
                        color={chipColor}
                        variant='flat'
                        className='font-medium'
                        startContent={<Icon icon={getSkillIcon(skill.key)} className='h-3 w-3' />}
                      >
                        {skill.key.trim()}
                      </Chip>
                    );
                  })}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:verified-check-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>{t('talentPool.cards.noSkillsListed')}</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={handleEditSkills}
                      >
                        Add Skills
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Languages */}
          <Card id='languages' className='border-default-200/50 scroll-mt-24 shadow-sm'>
            <CardHeader className='pb-4'>
              <div className='flex w-full items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <div className='bg-warning/10 rounded-full p-3'>
                    <Icon icon='solar:globe-linear' className='text-warning h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {t('talentPool.profile.sections.languages')}
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.languagesDescription')}
                    </p>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <Button
                    isIconOnly
                    variant='light'
                    size='sm'
                    className='text-foreground-400 hover:text-primary'
                    onPress={() => router.push('/private/settings')}
                  >
                    <Icon icon='solar:pen-linear' className='h-4 w-4' />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardBody className='px-8 pt-2'>
              {languages.length > 0 ? (
                <div className='space-y-3'>
                  {languages.map((lang, index) => (
                    <Card
                      key={lang.id || index}
                      className='shadow-small from-default-50/50 to-default-100/50 border-none bg-gradient-to-br'
                    >
                      <CardBody className='p-4'>
                        <div className='mb-3 flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <div className='border-default-200 h-4 w-6 overflow-hidden rounded-sm border shadow-sm'>
                              <img
                                src={`https://flagcdn.com/24x18/${
                                  lang.key === 'EN' ? 'gb'
                                  : lang.key === 'FR' ? 'fr'
                                  : lang.key === 'NL' ? 'nl'
                                  : lang.key === 'DE' ? 'de'
                                  : lang.key === 'ES' ? 'es'
                                  : lang.key === 'IT' ? 'it'
                                  : 'un'
                                }.png`}
                                alt={`${lang.key} flag`}
                                className='h-full w-full object-cover'
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-default-200 flex items-center justify-center text-xs font-bold text-default-600">${lang.key}</div>`;
                                  }
                                }}
                              />
                            </div>
                            <h4 className='text-foreground font-semibold'>
                              {lang.key === 'EN' ? 'English'
                               : lang.key === 'FR' ? 'French'
                               : lang.key === 'NL' ? 'Dutch'
                               : lang.key === 'DE' ? 'German'
                               : lang.key === 'ES' ? 'Spanish'
                               : lang.key === 'IT' ? 'Italian'
                               : lang.name || lang.key}
                            </h4>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Chip
                              size='sm'
                              color={
                                lang.level === 'NATIVE' ? 'success'
                                : lang.level === 'PROFESSIONAL' ? 'primary'
                                : lang.level === 'INTERMEDIATE' ? 'warning'
                                : lang.level === 'BEGINNER' ? 'secondary'
                                : 'default'
                              }
                              variant='flat'
                              className='text-tiny font-bold'
                            >
                              {lang.level}
                            </Chip>
                            {isOwnProfile && (
                              <Button
                                isIconOnly
                                variant='light'
                                size='sm'
                                className='text-foreground-400 hover:text-primary h-6 w-6'
                                onPress={() => router.push('/private/settings')}
                              >
                                <Icon icon='solar:pen-linear' className='h-3 w-3' />
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className='flex items-center justify-center py-12 text-center'>
                  <div>
                    <Icon
                      icon='solar:globe-linear'
                      className='text-default-300 mx-auto mb-4 h-12 w-12'
                    />
                    <p className='text-foreground-500 mb-4'>{t('talentPool.profile.noLanguages')}</p>
                    {isOwnProfile && (
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                        onPress={() => router.push('/private/settings')}
                      >
                        Add Languages
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>

          {/* Contact - Only show for other users */}
          {!isOwnProfile && (
            <Card id='contact' className='border-default-200/50 scroll-mt-24 shadow-sm'>
              <CardHeader className='pb-4'>
                <div className='flex items-center gap-4'>
                  <div className='bg-danger/10 rounded-full p-3'>
                    <Icon icon='solar:letter-linear' className='text-danger h-5 w-5' />
                  </div>
                  <div>
                    <h3 className='text-foreground text-lg font-semibold'>
                      {t('talentPool.profile.sections.contact')}
                    </h3>
                    <p className='text-small text-foreground-500 mt-1'>
                      {t('talentPool.profile.workWithUser', { name: user.firstName })}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardBody className='pt-2'>
                <div className='space-y-4'>
                  {user.email && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:letter-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={`mailto:${user.email}`}
                      >
                        {user.email}
                      </a>
                    </div>
                  )}

                  {user.phoneNumber && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:phone-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={`tel:${user.phoneNumber}`}
                      >
                        {user.phoneNumber}
                      </a>
                    </div>
                  )}

                  {user.linkedinProfile && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:link-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={user.linkedinProfile}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('talentPool.profile.linkedinProfile')}
                      </a>
                    </div>
                  )}

                  {user.profileWebsite && (
                    <div className='bg-default-50 flex items-center gap-3 rounded-lg p-3'>
                      <Icon icon='solar:globe-linear' className='text-foreground-500 h-4 w-4' />
                      <a
                        className='text-primary font-medium hover:underline'
                        href={user.profileWebsite}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {t('talentPool.profile.website')}
                      </a>
                    </div>
                  )}
                </div>

                <Divider className='my-6' />

                <div className='flex flex-col gap-3'>
                  {user.email && (
                    <Button
                      color='primary'
                      size='lg'
                      startContent={<Icon icon='solar:letter-linear' className='h-4 w-4' />}
                      as='a'
                      href={`mailto:${user.email}`}
                      className='w-full'
                    >
                      {t('talentPool.profile.letsTalk')}
                    </Button>
                  )}

                  {user.resume && (
                    <Button
                      variant='bordered'
                      size='lg'
                      startContent={<Icon icon='solar:download-linear' className='h-4 w-4' />}
                      as='a'
                      href={getImageUrl(user.resume)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='hover:border-primary w-full transition-colors duration-200'
                    >
                      {t('talentPool.profile.downloadCV')}
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Profile summary card */}
          <Card className='border-primary/20 from-primary/5 to-secondary/5 bg-gradient-to-br shadow-sm'>
            <CardBody className='p-8 text-center'>
              <div className='mx-auto mb-4 h-20 w-20'>
                {user.profileImage && user.profileImage.trim() ? (
                  <div className='ring-primary/20 shadow-lg from-primary-200 to-secondary-200 h-full w-full overflow-hidden rounded-full bg-gradient-to-br ring-4'>
                    <img
                      src={getImageUrl(user.profileImage)}
                      alt={`${user.firstName} ${user.lastName}`}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-xl font-bold text-primary-800">${getUserInitials(user.firstName, user.lastName)}</div>`;
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className='ring-primary/20 shadow-lg from-primary-200 to-secondary-200 text-primary-800 flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold ring-4'>
                    {getUserInitials(user.firstName, user.lastName)}
                  </div>
                )}
              </div>

              <h4 className='text-foreground mb-3 text-lg font-bold'>{fullName}</h4>

              <p className='text-small text-foreground-700 bg-primary/10 mb-4 rounded-full px-4 py-2'>
                {mapUserType(user.profession || user.kind || 'FREELANCER', t)}
              </p>

              <div className='via-primary/30 mb-4 h-px bg-gradient-to-r from-transparent to-transparent' />

              <p className='text-tiny text-foreground-500 leading-relaxed'>
                {user.aboutMe
                  ? truncateText(stripHtml(user.aboutMe), 120)
                  : t('talentPool.profile.noSummaryAvailable')}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfileContent;
