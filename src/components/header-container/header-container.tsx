'use client';

import React, { FC } from 'react';

import {
  Avatar,
  AvatarGroup,
  Chip,
  Divider,
  ScrollShadow,
  Tab,
  Tabs,
  Tooltip
} from '@heroui/react';
import { Icon } from '@iconify/react';

const HeaderContainer: FC = () => (
  <main className='mt-6 flex w-full flex-col items-center bg-default-100 px-[20px] py-[16px]'>
    <div className='w-full max-w-[1024px] px-4 lg:px-8'>
      <header className='mb-6 flex w-full items-center justify-between'>
        <div className='flex flex-col'>
          <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>Dashboard</h1>
          <p className='text-small text-default-400 lg:text-medium'>
            Connect with top experts to solve your digital challenges or share your expertise with
            others.
          </p>
        </div>
        <div className='flex items-center justify-between gap-8 rounded-lg border px-6 py-3 shadow-sm'>
          {/* Left: Avatar + Text */}
          <div className='flex items-center gap-4'>
            <Avatar isBordered size='sm' src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
            <div className='flex max-w-full flex-col'>
              <p className='text-small font-medium text-foreground'>Lode Schoors</p>
              <p className='text-tiny font-medium text-default-400'>Success manager</p>
            </div>
          </div>

          {/* Right: Icon with slow double-ring pulse (border only) */}
          <div className='relative flex h-10 w-10 items-center justify-center'>
            {/* First ring */}
            <span className='absolute inline-flex h-full w-full animate-[ping_3s_linear_infinite] rounded-full border border-green-500 opacity-60'></span>

            {/* Second ring with delay */}
            <span className='absolute inline-flex h-full w-full animate-[ping_3s_linear_infinite] rounded-full border border-green-500 opacity-60 [animation-delay:1.5s]'></span>

            {/* Message Icon */}
            <Icon className='relative z-10 text-green-600' icon='hugeicons:message-02' width={28} />
          </div>
        </div>
      </header>
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
  </main>
);

export default HeaderContainer;
