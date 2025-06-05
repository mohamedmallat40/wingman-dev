'use client';

import React, { FC } from 'react';

import {
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
  ScrollShadow,
  Skeleton,
  Tab,
  Tabs,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';
import PageTitle from '@/components/page-title/page-title';
import HeaderPage from '@/components/header-page/header-page';

const HeaderContainer: FC = () => (

  <div className='w-full max-w-full px-4 lg:px-8 bg-default-100 '>

    <HeaderPage title='Dashboard' description='   Connect with top experts to solve your digital challenges or share your expertise with
            others.' >
      <div className='flex items-center gap-4'>
        <Skeleton className='rounded-full'>
          <Avatar isBordered size='sm' src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
        </Skeleton>
        <Skeleton className='rounded-lg'>
          <div className='flex max-w-full flex-col'>
            <p className='text-small font-medium text-foreground'>Lode Schoors</p>
            <p className='text-tiny font-medium text-default-400'>Success manager</p>
          </div>
        </Skeleton>

      </div>
      <div className='relative flex h-10 w-10 items-center justify-center'>
        {/* First ring */}
        <span className='absolute inline-flex h-full w-full animate-[ping_3s_linear_infinite] rounded-full border border-green-500 opacity-60'></span>

        {/* Second ring with delay */}
        <span className='absolute inline-flex h-full w-full animate-[ping_3s_linear_infinite] rounded-full border border-green-500 opacity-60 [animation-delay:1.5s]'></span>

        {/* Message Icon */}
        <Icon className='relative z-10 text-green-600' icon='hugeicons:message-02' width={28} />
      </div>
    </HeaderPage>
    <ScrollShadow
      hideScrollBar
      className='-mx-2 flex w-full justify-between gap-8'
      orientation='horizontal'
    >
      <Tabs
        aria-label='Navigation Tabs'
        classNames={{
          cursor: 'bg-default-200 shadow-none'
        }}
        radius='full'
        variant='light'
      >
        <Tab key='my-challenges' title='My Challenges' />
        <Tab
          key='solution-sessions'
          title={
            <div className='flex items-center gap-2'>
              <p>Solution Session</p>
              <Chip size='sm'>9</Chip>
            </div>
          }
        />
        <Tab key='community' title='Community' />
        <Tab key='contracts' title='Contracts' />
        <Tab key='reputation' title='Reputation' />
      </Tabs>
      {/* <div className='flex items-center gap-4'>
          <AvatarGroup max={3} size='sm' total={10}>
            <Tooltip content='John' placement='bottom'>
              <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026024d' />
            </Tooltip>
            <Tooltip content='Mark' placement='bottom'>
              <Avatar src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
            </Tooltip>
            <Tooltip content='Jane' placement='bottom'>
              <Avatar src='https://i.pravatar.cc/150?u=a042581f4e29026704d' />
            </Tooltip>
          </AvatarGroup>
          <Divider className='h-6' orientation='vertical' />
          <Tooltip content='New deployment' placement='bottom'>
            <Button isIconOnly radius='full' size='sm' variant='faded'>
              <Icon className='text-default-500' icon='lucide:plus' width={16} />
            </Button>
          </Tooltip>
        </div> */}
    </ScrollShadow>
  </div>
);

export default HeaderContainer;
