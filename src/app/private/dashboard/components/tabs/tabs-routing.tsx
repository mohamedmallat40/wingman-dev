'use client'
import { Chip } from '@heroui/chip'
import { ScrollShadow } from '@heroui/react'
import { Tab,Tabs } from '@heroui/tabs'
import { usePathname } from 'next/navigation'
import React from 'react'

const TabsRouting = () => {
  const pathname = usePathname();
  return (
    <ScrollShadow
    hideScrollBar
    className='-mx-2 flex bg-default-100 mt-4 rounded-lg  justify-between gap-8 w-full'
    orientation='horizontal'
  >
    <Tabs
      aria-label='Navigation Tabs'
      selectedKey={pathname}
      classNames={{
        cursor: 'bg-white shadow-none text-foreground rounded-lg p-4',
        tabList: 'flex w-full items-center justify-between gap-4 overflow-x-auto px-2 ',
      }}
      className='flex w-full items-center justify-between gap-4 overflow-x-auto px-2 '
      radius='full'
      variant='light'
    >
      <Tab  href="/private/dashboard" key='/private/dashboard' title='My Challenges' />
      <Tab
       href="/private/dashboard/solutions"
        key='/private/dashboard/solutions'
        title={
          <div className='flex items-center gap-2'>
            <p>Solution Session</p>
            <Chip size='sm'>9</Chip>
          </div>
        }
      />
      <Tab  href="/private/dashboard/community" key='/private/dashboard/community' title='Community' />
      <Tab href="/private/dashboard/contracts" key='/private/dashboard/contracts' title='Contracts' />
      <Tab href="/private/dashboard/reputation" key='/private/dashboard/reputation' title='Reputation' />
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
  </ScrollShadow>  )
}

export default TabsRouting