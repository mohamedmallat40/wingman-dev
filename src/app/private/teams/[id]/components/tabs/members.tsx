import React from 'react';

import { Avatar, Button, Card, CardBody, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { getBaseUrl } from '@/lib/utils/utilities';

import { type Group } from '../../types';
import { AVAILABILITY_COLORS } from '../constants';

interface TeamMembersTabProperties {
  team: Group;
  onViewProfile: (userId: string) => void;
  onRefetch: () => void;
}

export const TeamMembersTab: React.FC<TeamMembersTabProperties> = ({
  team,
  onViewProfile,
  onRefetch
}) => {
  const getAvailabilityColor = (status: string) => {
    return AVAILABILITY_COLORS[status as keyof typeof AVAILABILITY_COLORS];
  };

  // Include owner in the members list
  const allMembers = [
    { ...team.owner, role: 'owner' as const },
    ...team.connections.map((conn) => ({ ...conn.target, role: 'member' as const }))
  ];

  const getRoleIcon = (role: 'owner' | 'member') => {
    return role === 'owner' ? 'solar:crown-linear' : 'solar:user-linear';
  };

  const getRoleColor = (role: 'owner' | 'member') => {
    return role === 'owner' ? 'warning' : 'default';
  };

  return (
    <div className='space-y-6'>
      {/* Members Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className='flex items-center justify-between'
      >
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Team Members</h3>
          <p className='text-sm text-gray-600'>
            {allMembers.length} member{allMembers.length === 1 ? '' : 's'} total
          </p>
        </div>

        {/* Add Member Button - Only show if current user is owner */}
        {/* <Button
          color="primary"
          variant="flat"
          size="sm"
          startContent={<Icon icon="solar:user-plus-linear" className="h-4 w-4" />}
        >
          Invite Member
        </Button> */}
      </motion.div>

      {/* Members Grid */}
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        {allMembers.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
          >
            <Card className='border border-gray-100 shadow-sm transition-shadow hover:shadow-md'>
              <CardBody className='p-6'>
                {/* Member Header */}
                <div className='mb-4 flex items-start justify-between'>
                  <div className='flex items-center gap-3'>
                    <Avatar
                      src={
                        member.profileImage
                          ? `${getBaseUrl()}/upload/${member.profileImage}`
                          : undefined
                      }
                      name={`${member.firstName} ${member.lastName}`}
                      size='md'
                      className='flex-shrink-0'
                    />
                    <div>
                      <div className='mb-1 flex items-center gap-2'>
                        <h4 className='font-semibold text-gray-900 dark:text-gray-100'>
                          {member.firstName} {member.lastName}
                        </h4>
                        <Chip
                          size='sm'
                          color={getRoleColor(member.role)}
                          variant='flat'
                          startContent={
                            <Icon icon={getRoleIcon(member.role)} className='h-3 w-3' />
                          }
                          className='capitalize'
                        >
                          {member.role}
                        </Chip>
                      </div>
                      <p className='text-sm text-gray-600'>{member.profession}</p>
                    </div>
                  </div>

                  <Chip
                    size='sm'
                    color={getAvailabilityColor(member.statusAviability)}
                    variant='flat'
                    className='capitalize'
                  >
                    {member.statusAviability}
                  </Chip>
                </div>

                {/* Member Details */}
                <div className='space-y-3'>
                  {/* Basic Info */}
                  <div className='flex flex-wrap gap-4 text-sm text-gray-600'>
                    {member.experienceYears && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:calendar-linear' className='h-4 w-4' />
                        <span>{member.experienceYears} years</span>
                      </div>
                    )}
                    {member.city && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:map-point-linear' className='h-4 w-4' />
                        <span>{member.city}</span>
                      </div>
                    )}
                    {member.workType && (
                      <div className='flex items-center gap-1'>
                        <Icon icon='solar:case-linear' className='h-4 w-4' />
                        <span className='capitalize'>{member.workType}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating & Rate */}
                  {member.averageRating && (
                    <div className='flex items-center justify-between text-sm'>
                      <div className='text-warning-600 flex items-center gap-1'>
                        <Icon icon='solar:star-bold' className='h-4 w-4' />
                        <span>{member.averageRating}</span>
                        <span className='text-gray-500'>({member.reviewCount} reviews)</span>
                      </div>
                      {member.hourlyRate && (
                        <div className='font-medium text-gray-900'>${member.hourlyRate}/hr</div>
                      )}
                    </div>
                  )}

                  {/* Skills Preview */}
                  {member.skills && member.skills.length > 0 && (
                    <div>
                      <div className='flex flex-wrap gap-1'>
                        {member.skills.slice(0, 3).map((skill) => (
                          <Chip key={skill.id} size='sm' variant='flat' className='text-xs'>
                            {skill.name}
                          </Chip>
                        ))}
                        {member.skills.length > 3 && (
                          <Chip size='sm' variant='flat' className='text-xs text-gray-500'>
                            +{member.skills.length - 3} more
                          </Chip>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-2 border-t border-gray-100 pt-2'>
                    <Button
                      color='primary'
                      variant='flat'
                      size='sm'
                      onPress={() => {
                        onViewProfile(member.id);
                      }}
                      startContent={<Icon icon='solar:eye-linear' className='h-4 w-4' />}
                      className='flex-1'
                    >
                      View Profile
                    </Button>

                    {member.role !== 'owner' && !member.isConnected && (
                      <Button
                        color='secondary'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
                      >
                        Connect
                      </Button>
                    )}

                    {member.isConnected && member.role !== 'owner' && (
                      <Button
                        color='success'
                        variant='flat'
                        size='sm'
                        startContent={<Icon icon='solar:check-linear' className='h-4 w-4' />}
                        isDisabled
                      >
                        Connected
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {allMembers.length === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='py-12 text-center'
        >
          <Icon
            icon='solar:users-group-rounded-linear'
            className='mx-auto mb-4 h-16 w-16 text-gray-300'
          />
          <h3 className='mb-2 text-lg font-medium text-gray-900'>No additional members yet</h3>
          <p className='mb-4 text-gray-600'>
            This team currently only has the owner. Invite more members to collaborate!
          </p>
          <Button
            color='primary'
            variant='flat'
            startContent={<Icon icon='solar:user-plus-linear' className='h-4 w-4' />}
          >
            Invite Members
          </Button>
        </motion.div>
      )}
    </div>
  );
};
