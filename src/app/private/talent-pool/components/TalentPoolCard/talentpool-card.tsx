'use client';

import React from 'react';

import { Avatar, Badge, Button, Card, CardBody, Chip, Tooltip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import CountryFlag from '../CountryFlag/CountryFlag';

interface Talent {
  name: string;
  title: string;
  description: string;
  avatarSrc?: string;
  initials?: string;
  isTeam: boolean;
  tags: string[];
  endorsements: number;
  availability: 'available' | 'busy';
  availabilityUntil?: string;
  rating?: number;
  hourlyRate?: string;
  location?: string;
  countryCode?: string;
  completedProjects?: number;
  languages?: string[];
  timezone?: string;
}

interface TalentPoolCardProperties {
  talent: Talent;
  className?: string;
}

export const TalentPoolCard: React.FC<TalentPoolCardProperties> = ({ talent }) => {
  const {
    name,
    title,
    description,
    avatarSrc,
    initials,
    isTeam,
    tags,
    endorsements,
    availability,
    availabilityUntil,
    rating = 4.8,
    hourlyRate,
    location,
    countryCode,
    completedProjects = 0,
    languages = [],
    timezone
  } = talent;

  const isAvailable = availability === 'available';
  const displayTags = tags.slice(0, 3);
  const remainingTags = tags.length - 3;

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='h-full'
    >
      <Card className='group relative h-full w-full overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl dark:bg-slate-900/90'>
        {/* Gradient overlay for glassmorphism */}
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-purple-500/5' />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-500/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
        <CardBody className='relative z-10 flex h-full flex-col justify-between p-6'>
          {/* Header Section */}
          <div className='space-y-4'>
            {/* Profile Header */}
            <div className='relative'>
              <div className='flex items-start gap-4'>
                <div className='relative'>
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ duration: 0.2 }}>
                    <Avatar
                      src={avatarSrc}
                      name={initials ?? name}
                      size='lg'
                      className='shadow-lg ring-2 ring-white/50 backdrop-blur-sm dark:ring-slate-700/50'
                    />
                  </motion.div>
                  {/* Animated Online Status Indicator */}
                  <motion.div
                    className={`absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 border-white shadow-lg ${
                      isAvailable ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>

                <div className='min-w-0 flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <div className='min-w-0 flex-1'>
                      <motion.h3
                        className='truncate text-lg font-bold text-slate-900 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text group-hover:text-transparent dark:text-white'
                        whileHover={{ scale: 1.02 }}
                      >
                        {name}
                      </motion.h3>
                      <p className='truncate text-sm font-medium text-slate-600 dark:text-slate-300'>
                        {title}
                      </p>
                      {location && (
                        <motion.div
                          className='mt-2 flex items-center gap-1'
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {countryCode && <CountryFlag countryCode={countryCode} size='sm' />}
                          <Icon icon='lucide:map-pin' className='text-xs text-slate-400' />
                          <span className='text-xs text-slate-500 dark:text-slate-400'>
                            {location}
                          </span>
                          {timezone && <span className='text-xs text-slate-400'>• {timezone}</span>}
                        </motion.div>
                      )}
                    </div>

                    {isTeam && (
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Chip
                          color='primary'
                          variant='flat'
                          size='sm'
                          startContent={<Icon icon='lucide:users' className='text-sm' />}
                          className='border border-blue-500/20 bg-blue-500/10 font-semibold backdrop-blur-sm'
                        >
                          Team
                        </Chip>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className='flex items-center justify-between text-sm'>
              <div className='flex items-center gap-4'>
                <Tooltip content={`${rating}/5 average rating`}>
                  <div className='flex cursor-help items-center gap-1'>
                    <Icon icon='lucide:star' className='text-warning fill-current' />
                    <span className='text-foreground font-semibold'>{rating}</span>
                  </div>
                </Tooltip>

                <div className='flex items-center gap-1'>
                  <Icon icon='lucide:thumbs-up' className='text-success' />
                  <span className='text-default-600 font-medium'>{endorsements}</span>
                </div>

                {completedProjects > 0 && (
                  <div className='flex items-center gap-1'>
                    <Icon icon='lucide:briefcase' className='text-primary' />
                    <span className='text-default-600 font-medium'>{completedProjects}</span>
                  </div>
                )}
              </div>

              {hourlyRate && <div className='text-success text-lg font-bold'>{hourlyRate}</div>}
            </div>

            {/* Description */}
            <p className='text-default-700 line-clamp-3 text-sm leading-relaxed'>{description}</p>

            {/* Skills/Tags */}
            <div className='flex flex-wrap gap-1.5'>
              {displayTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant='flat'
                  color='default'
                  size='sm'
                  className='hover:bg-primary hover:text-primary-foreground cursor-pointer px-2 py-1 text-xs font-medium transition-colors'
                >
                  {tag}
                </Badge>
              ))}
              {remainingTags > 0 && (
                <Tooltip content={tags.slice(3).join(', ')}>
                  <Badge
                    variant='flat'
                    color='default'
                    size='sm'
                    className='cursor-help px-2 py-1 text-xs font-medium'
                  >
                    +{remainingTags} more
                  </Badge>
                </Tooltip>
              )}
            </div>

            {/* Languages */}
            {languages.length > 0 && (
              <div className='flex items-center gap-2'>
                <Icon icon='lucide:languages' className='text-default-400 text-xs' />
                <div className='flex flex-wrap gap-1'>
                  {languages.slice(0, 3).map((lang, index) => (
                    <span key={index} className='text-default-500 text-xs'>
                      {lang}
                      {index < Math.min(languages.length, 3) - 1 && ','}
                    </span>
                  ))}
                  {languages.length > 3 && (
                    <span className='text-default-400 text-xs'>+{languages.length - 3}</span>
                  )}
                </div>
              </div>
            )}

            {/* Availability Status */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-1'>
                <Badge
                  color={isAvailable ? 'success' : 'warning'}
                  variant='flat'
                  size='sm'
                  className='flex items-center gap-1 font-medium'
                >
                  <Icon
                    icon={isAvailable ? 'lucide:check-circle' : 'lucide:clock'}
                    className='text-xs'
                  />
                  {isAvailable ? 'Available now' : `Busy until ${availabilityUntil ?? 'TBD'}`}
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <motion.div
            className='mt-6 flex gap-3'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div className='flex-1' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                color='primary'
                className='w-full bg-gradient-to-r from-blue-600 to-purple-600 font-semibold shadow-lg transition-all duration-300 hover:shadow-xl'
                startContent={<Icon icon='lucide:message-circle' />}
                size='lg'
              >
                {isTeam ? 'Contact Team' : 'Message'}
              </Button>
            </motion.div>
            <motion.div className='flex-1' whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant='bordered'
                className='hover:border-primary hover:bg-primary/5 w-full border-slate-300 font-semibold backdrop-blur-sm transition-all duration-300 dark:border-slate-600'
                startContent={<Icon icon='lucide:user' />}
                size='lg'
              >
                View Profile
              </Button>
            </motion.div>
          </motion.div>
        </CardBody>
      </Card>
    </motion.div>
  );
};
