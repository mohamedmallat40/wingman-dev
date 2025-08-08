'use client';

import React from 'react';

import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';

import { type TeamCardProps } from '../types';

const GroupCard: React.FC<TeamCardProps> = ({ group, onViewTeam, onJoinTeam }) => {
  const { id, groupName, color, members, tools, owner, connections } = group;

  const displayTools = tools.slice(0, 4);
  const hasMoreTools = tools.length > 4;
  const connectionsCount = connections?.length || 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      className='h-full w-full'
    >
      <Card className='relative h-full w-full max-w-[600px] overflow-hidden border-0 bg-gradient-to-br from-background via-background/95 to-background shadow-lg transition-all duration-300 hover:shadow-2xl'>
        <div className='bg-primary-100/30 absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 transform rounded-full blur-2xl filter'></div>
        <div className='absolute bottom-0 left-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 transform rounded-full bg-secondary-100/30 blur-2xl filter'></div>
        <CardHeader className='relative flex flex-col items-start gap-4 px-6 pt-6 pb-6'>
          <div className='flex w-full items-center justify-between'>
            <div className='relative'>
              <div
                className='ring-primary-100 flex h-20 w-20 items-center justify-center rounded-full text-xl font-bold text-white shadow-lg ring-4 ring-offset-2'
                style={{
                  backgroundColor: color || '#6366f1'
                }}
              >
                {groupName.charAt(0).toUpperCase()}
              </div>
              <div className='bg-primary-500 absolute -right-2 -bottom-2 rounded-full border-2 border-background px-2 py-1'>
                <div className='flex items-center gap-1'>
                  <Icon icon='solar:users-group-rounded-bold' className='h-3 w-3 text-white' />
                  <span className='text-xs font-bold text-white'>{members}</span>
                </div>
              </div>
            </div>

            <div className='flex gap-2'>
              <Button
                className='bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                radius='full'
                size='sm'
                startContent={<Icon icon='solar:login-bold' className='h-4 w-4' />}
                onPress={() => onJoinTeam?.(id)}
              >
                Join Team
              </Button>

              <Button
                className='border-primary-200 text-primary-600 hover:bg-primary-50'
                radius='full'
                size='sm'
                variant='bordered'
                isIconOnly
                onPress={() => onViewTeam?.(id)}
              >
                <Icon icon='solar:eye-bold' className='h-4 w-4' />
              </Button>
            </div>
          </div>

          <div className='flex w-full flex-col gap-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-xl font-bold text-foreground'>{groupName}</h2>
              <div className='flex items-center gap-1 rounded-full bg-default-100 px-2 py-1'>
                <Icon icon='solar:users-group-rounded-linear' className='h-3 w-3 text-default-600' />
                <span className='text-xs font-medium text-default-600'>
                  {members} member{members !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <p className='text-small text-default-500 font-medium'>
              Team •{' '}
              {connectionsCount > 0 ? `${connectionsCount} connections` : 'No connections yet'}
            </p>
          </div>
        </CardHeader>

        <CardBody className='relative z-10 gap-4 px-6 pt-0 pb-6'>
          {/* Team Owner Section */}
          <div className='rounded-xl border border-default-200 bg-background/60 p-4 shadow-sm backdrop-blur-sm'>
            <h3 className='text-medium mb-3 flex items-center gap-2 font-semibold'>
              <Icon icon='solar:crown-linear' className='text-primary h-4 w-4' />
              Team Owner
            </h3>
            <div className='flex items-center gap-3'>
              <Avatar
                src={
                  owner.profileImage
                    ? `https://app.extraexpertise.be/api/upload/${owner.profileImage}`
                    : undefined
                }
                className='ring-primary-100 h-12 w-12 ring-4 ring-offset-2'
                name={`${owner.firstName} ${owner.lastName}`}
              />
              <div className='flex flex-col'>
                <p className='text-medium font-bold text-foreground'>
                  {owner.firstName} {owner.lastName}
                </p>
                <p className='text-small text-default-500'>{owner.profession || 'Team Lead'}</p>
              </div>
            </div>
          </div>

          {/* Tools Section */}
          {displayTools.length > 0 && (
            <div className='rounded-xl border border-default-200 bg-background/60 p-4 shadow-sm backdrop-blur-sm'>
              <h3 className='text-medium mb-3 flex items-center gap-2 font-semibold'>
                <Icon icon='solar:document-text-linear' className='text-primary h-4 w-4' />
                Tools & Technologies
              </h3>
              <div className='flex flex-wrap gap-2'>
                {displayTools.map((tool, index) => (
                  <Chip
                    key={`${tool.name}-${index}`}
                    variant='flat'
                    size='sm'
                    className='cursor-pointer transition-transform hover:scale-105'
                    color='primary'
                  >
                    {tool.name}
                  </Chip>
                ))}
                {hasMoreTools && (
                  <Chip variant='bordered' size='sm' className='border-dashed'>
                    +{tools.length - 4} more
                  </Chip>
                )}
              </div>
            </div>
          )}

          <Divider className='my-2' />

          {/* Stats Section */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center'>
                <Icon icon='solar:users-group-rounded-linear' className='text-primary h-4 w-4' />
              </div>
              <p className='text-small text-default-700 font-bold'>{members}</p>
              <p className='text-tiny text-default-400'>Members</p>
            </div>

            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center'>
                <Icon icon='solar:document-text-linear' className='text-primary h-4 w-4' />
              </div>
              <p className='text-small text-default-700 font-bold'>{tools.length}</p>
              <p className='text-tiny text-default-400'>Tools</p>
            </div>

            <div className='text-center'>
              <div className='mb-1 flex items-center justify-center'>
                <Icon icon='solar:link-linear' className='text-primary h-4 w-4' />
              </div>
              <p className='text-small text-default-700 font-bold'>{connectionsCount}</p>
              <p className='text-tiny text-default-400'>Connections</p>
            </div>
          </div>

          {/* Join Action Section */}
          <div className='from-primary-50 to-secondary-50 border-primary-200 rounded-xl border bg-gradient-to-r p-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <Icon icon='solar:users-group-rounded-linear' className='text-primary h-4 w-4' />
                <span className='text-medium text-primary font-bold'>Join Team</span>
              </div>
              <div className='text-right'>
                <p className='text-small text-primary'>Collaborate & grow together</p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default GroupCard;
