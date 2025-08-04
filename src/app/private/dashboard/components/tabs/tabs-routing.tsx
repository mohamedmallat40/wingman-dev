'use client';

import React from 'react';

import { Chip } from '@heroui/chip';
import { ScrollShadow } from '@heroui/react';
import { Tab, Tabs } from '@heroui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TabsRouting = () => {
  const pathname = usePathname();
  return (
    <ScrollShadow
      hideScrollBar
      className='bg-default-100 -mx-2 mt-4 flex w-full justify-between gap-8 rounded-lg'
      orientation='horizontal'
    >
      <Tabs
        aria-label='Navigation Tabs'
        selectedKey={pathname}
        classNames={{
          cursor: 'bg-white shadow-none text-foreground rounded-lg p-4',
          tabList: 'flex w-full items-center justify-between gap-4 overflow-x-auto px-2 '
        }}
        className='flex w-full items-center justify-between gap-4 overflow-x-auto px-2'
        radius='full'
        variant='light'
      >
        <Tab
          key='/private/dashboard'
          title={
            <Link href='/private/dashboard'>
              <div className='flex items-center gap-2'>
                <p>My Challenges</p>
                <Chip size='sm'>9</Chip>
              </div>
            </Link>
          }
        />
        <Tab
          key='/private/dashboard/solutions'
          title={
            <Link href='/private/dashboard/solutions' key='/private/dashboard/solutions'>
              <div className='flex items-center gap-2'>
                <p>Solution Session</p>
                <Chip size='sm'>9</Chip>
              </div>
            </Link>
          }
        />
        <Tab
          key='/private/talent-pool'
          title={
            <Link href='/private/talent-pool'>
              <div className='flex items-center gap-2'>
                <p>Talent Pool</p>
                <Chip size='sm'>12</Chip>
              </div>
            </Link>
          }
        />
        <Tab
          key='/private/dashboard/documents'
          title={
            <Link href='/private/dashboard/documents'>
              <div className='flex items-center gap-2'>
                <p>Documents</p>
                <Chip size='sm'>5</Chip>
              </div>
            </Link>
          }
        />
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
  );
};

export default TabsRouting;
