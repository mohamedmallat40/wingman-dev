import { FC } from 'react';

import { Avatar } from '@heroui/avatar';
import { Skeleton } from '@heroui/skeleton';
import { Icon } from '@iconify/react';

import PageTitle from '@/components/page-title/page-title';
import SectionContainer from '@/components/section-container/section-container';

interface IHeaderPageProperties {
  title: string;
  description: string;
  children?: React.ReactNode;
}
const HeaderPage: FC<IHeaderPageProperties> = ({ title, description, children }) => {
  return (
    <SectionContainer>
      <header className='mt-4 mb-6 flex w-full flex-wrap items-center justify-between gap-2 rounded-lg bg-transparent md:items-center'>
        <div className='flex flex-col'>
          <h1 className='text-lg font-bold lg:text-3xl'>{title}</h1>
          <p className='text-default-400 lg:text-medium text-xs'>{description}</p>
        </div>
        <div className='flex items-center justify-between gap-8 rounded-lg border px-6 py-3 shadow-sm'>
          {/* Left: Avatar + Text */}
          <div className='flex items-center gap-4'>
            <Skeleton className='rounded-full'>
              <Avatar isBordered size='sm' src='https://i.pravatar.cc/150?u=a04258a2462d826712d' />
            </Skeleton>
            <Skeleton className='rounded-lg'>
              <div className='flex max-w-full flex-col'>
                <p className='text-small text-foreground font-medium'>Lode Schoors</p>
                <p className='text-tiny text-default-400 font-medium'>Success manager</p>
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
          </div>{' '}
          {/* Right: Icon with slow double-ring pulse (border only) */}
        </div>
      </header>
    </SectionContainer>
  );
};

export default HeaderPage;
