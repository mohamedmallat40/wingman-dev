import React from 'react';

import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { mapUserType } from '@/app/private/talent-pool/components';
import { getBaseUrl } from '@/lib/utils/utilities';

import { type Group } from '../../types';
import { AVAILABILITY_COLORS, TEAM_COLORS } from '../constants';

interface TeamOverviewTabProperties {
  team: Group;
  onViewProfile: (userId: string) => void;
  onRefetch: () => void;
}

const getTeamColorClass = (color: string) => {
  return TEAM_COLORS[color as keyof typeof TEAM_COLORS];
};

const getAvailabilityColor = (status: string) => {
  return AVAILABILITY_COLORS[status as keyof typeof AVAILABILITY_COLORS];
};
export const TeamOverviewTab: React.FC<TeamOverviewTabProperties> = ({ team, onViewProfile }) => {
  const t = useTranslations();
  return (
    <div className='space-y-6'>
      {/* Team Overview Cards */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4'>
        {/* Total Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className='border border-gray-100 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
            <CardBody className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icon icon='solar:users-group-rounded-bold' className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    {team.members}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Members</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Total Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className='border border-gray-100 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
            <CardBody className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-secondary-100 text-secondary-600 dark:bg-secondary-900/30 dark:text-secondary-400 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icon icon='solar:settings-bold' className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    {team.tools.length}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Tools</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Total Connections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className='border border-gray-100 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
            <CardBody className='p-4'>
              <div className='flex items-center gap-3'>
                <div className='bg-success-100 text-success-600 dark:bg-success-900/30 dark:text-success-400 flex h-12 w-12 items-center justify-center rounded-lg'>
                  <Icon icon='solar:link-bold' className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                    {team.connections.length}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Connections</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Team Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className='border border-gray-100 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900'>
            <CardBody className='p-4'>
              <div className='flex items-center gap-3'>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-lg ${getTeamColorClass(team.color)}`}
                >
                  <Icon icon='solar:shield-check-bold' className='h-6 w-6' />
                </div>
                <div>
                  <p className='text-lg font-bold text-gray-900 capitalize dark:text-gray-100'>
                    {team.color}
                  </p>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>Status</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Team Owner Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Card className='border border-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-900'>
          <CardBody className='p-6'>
            <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
              <Icon icon='solar:crown-linear' className='text-warning-500 h-5 w-5' />
              Team Owner
            </h3>

            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <Avatar
                  src={
                    team.owner.profileImage
                      ? `${getBaseUrl()}/upload/${team.owner.profileImage}`
                      : undefined
                  }
                  name={`${team.owner.firstName} ${team.owner.lastName}`}
                  size='lg'
                  className='flex-shrink-0'
                />

                <div className='flex-1'>
                  <div className='mb-2 flex items-center gap-3'>
                    <h4 className='font-semibold text-gray-900 dark:text-gray-100'>
                      {team.owner.firstName} {team.owner.lastName}
                    </h4>
                    <Chip
                      size='sm'
                      color={getAvailabilityColor(team.owner.statusAviability)}
                      variant='flat'
                      className='capitalize'
                    >
                      {team.owner.statusAviability}
                    </Chip>
                  </div>

                  <p className='mb-2 text-gray-600 dark:text-gray-400'>
                    {mapUserType(team.owner.profession, t)}
                  </p>

                  <div className='flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400'>
                    {team.owner.experienceYears && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                        <span>{team.owner.experienceYears} years exp.</span>
                      </div>
                    )}
                    {team.owner.city && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:map-point-linear' className='h-4 w-4' />
                        <span>{team.owner.city}</span>
                      </div>
                    )}
                    {team.owner.workType && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:case-linear' className='h-4 w-4' />
                        <span className='capitalize'>{team.owner.workType}</span>
                      </div>
                    )}
                    {team.owner.averageRating && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:star-bold' className='text-warning-500 h-4 w-4' />
                        <span>
                          {team.owner.averageRating} ({team.owner.reviewCount} reviews)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                color='primary'
                variant='flat'
                size='sm'
                onPress={() => {
                  onViewProfile(team.owner.id);
                }}
                startContent={<Icon icon='solar:eye-linear' className='h-4 w-4' />}
              >
                View Profile
              </Button>
            </div>

            {team.owner.aboutMe && (
              <div className='mt-4 border-t border-gray-100 pt-4 dark:border-gray-800'>
                <p className='text-sm leading-relaxed text-gray-700 dark:text-gray-300'>
                  {team.owner.aboutMe}
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>

      {/* Top Tools Preview */}
      {/*   <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Card className='border border-gray-100 shadow-sm dark:border-gray-800 dark:bg-gray-900'>
          <CardBody className='p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
                <Icon icon='solar:settings-linear' className='h-5 w-5' />
                Top Tools
              </h3>
              {team.tools.length > 3 && (
                <Button
                  variant='light'
                  size='sm'
                  color='primary'
                  endContent={<Icon icon='solar:arrow-right-linear' className='h-4 w-4' />}
                >
                  View All
                </Button>
              )}
            </div>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3'>
              {team.tools.slice(0, 3).map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: 0.1 * index }}
                  className='hover:border-primary-200 dark:hover:border-primary-700 cursor-pointer rounded-lg border border-gray-100 p-4 transition-all hover:shadow-sm dark:border-gray-800'
                  onClick={() => window.open(tool.link, '_blank')}
                >
                  <div className='flex items-center gap-3'>
                    <div className='from-primary-100 to-secondary-100 dark:from-primary-900/30 dark:to-secondary-900/30 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br'>
                      <Icon
                        icon='solar:settings-linear'
                        className='text-primary-600 dark:text-primary-400 h-5 w-5'
                      />
                    </div>
                    <div className='flex-1'>
                      <div className='mb-1 flex items-center gap-2'>
                        <h4 className='font-medium text-gray-900 dark:text-gray-100'>
                          {tool.name}
                        </h4>
                        <Chip size='sm' variant='flat' className='text-xs'>
                          {tool.tag}
                        </Chip>
                      </div>
                      <p className='line-clamp-2 text-sm text-gray-600 dark:text-gray-400'>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {team.tools.length === 0 && (
              <div className='py-8 text-center'>
                <Icon
                  icon='solar:settings-linear'
                  className='mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-600'
                />
                <p className='text-gray-500 dark:text-gray-400'>No tools added yet</p>
              </div>
            )}
          </CardBody>
        </Card>
      </motion.div>
             */}
    </div>
  );
};
