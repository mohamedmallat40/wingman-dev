'use client';

import React from 'react';

import type { Tool } from '../../types';

import { Avatar, Button, Card, CardBody, CardHeader, Chip, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';
import useUserStore from '@root/modules/auth/store/use-user-store';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

import { getImageUrl } from '@/lib/utils/utilities';

import { type Group } from '../../types';
import { mapUserType } from '../../utils/talent-utilities';

interface GroupCardProperties {
  group: Group;
  onViewTeam: (teamId: string) => void;
  activeTab: string;
}

const GroupCard: React.FC<GroupCardProperties> = ({ group, onViewTeam, activeTab }) => {
  const t = useTranslations();
  const { id, groupName, color, members, tools, owner, connections, type } = group;
  const { user } = useUserStore();

  const displayTools = tools.slice(0, 4);
  const hasMoreTools = tools.length > 4;
  const connectionsCount = connections.length || 0;

  // Determine team type chip properties
  const getTeamTypeChip = () => {
    const isSharedWithMe =
      user?.id && owner.id !== user.id && connections.some((conn) => conn.id === user.id);

    let chipColor: 'primary' | 'danger' | 'warning' | 'success' = 'primary';
    let chipText = '';

    if (isSharedWithMe) {
      chipColor = 'warning';
      chipText = t('talentPool.tabs.sharedWithMe');
    } else if (type === 'public') {
      chipText = t('talentPool.tabs.publicGroups');
    }

    return (
      <Chip size='sm' color={chipColor} variant='flat' className='mb-4'>
        {chipText}
      </Chip>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className='h-full w-full'
    >
      <Card className='border-default-200 bg-background/60 hover:border-default-300 dark:bg-background/80 h-full w-full max-w-[600px] border backdrop-blur-sm transition-all duration-200 hover:shadow-md'>
        <CardHeader className='flex flex-col items-start gap-4 p-6'>
          {/* Type Chip - Only show on 'all' tab */}
          {activeTab === 'all' && (
            <div className='flex w-full justify-end'>{getTeamTypeChip()}</div>
          )}

          {/* Header with Avatar and Action Button */}
          <div className='flex w-full items-start justify-between'>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <div
                  className='flex h-14 w-14 items-center justify-center rounded-xl text-lg font-semibold text-white shadow-sm'
                  style={{ backgroundColor: color || '#6366f1' }}
                >
                  {groupName.charAt(0).toUpperCase()}
                </div>
                <div className='bg-primary absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-sm'>
                  <span className='text-xs font-medium'>{members}</span>
                </div>
              </div>

              <div>
                <h2 className='text-foreground text-xl font-semibold'>{groupName}</h2>
                <p className='text-default-500 mt-1 text-sm'>
                  {members} {t('talentPool.cards.membersCount')} • {connectionsCount}{' '}
                  {connectionsCount === 1 ? 'connection' : 'connections'}
                </p>
              </div>
            </div>

            <Button
              className='text-default-600 hover:text-foreground'
              radius='lg'
              size='sm'
              variant='light'
              isIconOnly
              onPress={() => {
                onViewTeam(id);
              }}
            >
              <Icon icon='solar:eye-bold' className='h-4 w-4' />
            </Button>
          </div>
        </CardHeader>

        <CardBody className='gap-4 px-6 pt-0 pb-6'>
          {/* Owner Section */}
          <div className='border-default-200/50 bg-default-50/50 flex items-center gap-3 rounded-lg border p-3'>
            <Avatar
              src={owner?.profileImage ? getImageUrl(owner?.profileImage) : undefined}
              className='h-8 w-8'
              name={`${owner?.firstName} ${owner?.lastName}`}
            />
            <div className='min-w-0 flex-1'>
              <p className='text-foreground truncate text-sm font-medium'>
                {owner?.firstName} {owner?.lastName}
              </p>
              <p className='text-default-500 truncate text-xs'>
                {mapUserType(owner?.profession, t)}
              </p>
            </div>
            <Icon icon='solar:crown-linear' className='text-primary h-4 w-4 flex-shrink-0' />
          </div>

          {/* Tools Section */}
          {displayTools.length > 0 && (
            <div>
              <div className='mb-2 flex items-center gap-2'>
                <Icon icon='solar:document-text-linear' className='text-default-600 h-4 w-4' />
                <span className='text-foreground text-sm font-medium'>{t('talentPool.cards.tools')}</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {displayTools.map((tool: Tool, index: number) => (
                  <Chip
                    key={`${tool.name}-${index}`}
                    variant='flat'
                    size='sm'
                    className='bg-default-100 text-default-700 hover:bg-default-200 transition-colors'
                  >
                    {tool.name}
                  </Chip>
                ))}
                {hasMoreTools && (
                  <Chip
                    variant='bordered'
                    size='sm'
                    className='border-default-300 text-default-500 border-dashed'
                  >
                    +{tools.length - 4}
                  </Chip>
                )}
              </div>
            </div>
          )}

          <Divider className='my-2' />

          {/* Stats Grid */}
          <div className='grid grid-cols-3 gap-4'>
            <div className='text-center'>
              <div className='text-default-600 flex items-center justify-center gap-1'>
                <Icon icon='solar:users-group-rounded-linear' className='h-3 w-3' />
                <span className='text-sm font-medium'>{members}</span>
              </div>
              <p className='text-default-400 mt-1 text-xs'>{t('talentPool.cards.members')}</p>
            </div>

            <div className='text-center'>
              <div className='text-default-600 flex items-center justify-center gap-1'>
                <Icon icon='solar:document-text-linear' className='h-3 w-3' />
                <span className='text-sm font-medium'>{tools.length}</span>
              </div>
              <p className='text-default-400 mt-1 text-xs'>{t('talentPool.cards.tools')}</p>
            </div>

            <div className='text-center'>
              <div className='text-default-600 flex items-center justify-center gap-1'>
                <Icon icon='solar:link-linear' className='h-3 w-3' />
                <span className='text-sm font-medium'>{connectionsCount}</span>
              </div>
              <p className='text-default-400 mt-1 text-xs'>Connections</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
};

export default GroupCard;
