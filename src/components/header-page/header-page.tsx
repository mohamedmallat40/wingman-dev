import PageTitle from '@/components/page-title/page-title'
import { Avatar } from '@heroui/avatar'
import { Skeleton } from '@heroui/skeleton'
import { Icon } from '@iconify/react';
import { FC } from 'react';

interface IHeaderPageProps {
    title: string;
    description: string;
    children?: React.ReactNode;
}
const HeaderPage: FC<IHeaderPageProps> = ({ title, description, children }) => {
    return (
        <header className='mb-6 flex w-full items-center justify-between bg-default-100  py-[55px] px-16 mt-4 rounded-lg'>
            <div className='flex flex-col'>
                <h1 className='text-xl font-bold text-default-900 lg:text-3xl'>{title}</h1>
                <p className='text-small text-default-400 lg:text-medium'>
                    {description}
                </p>
            </div>
            <div className='flex items-center justify-between gap-8 rounded-lg border px-6 py-3 shadow-sm'>
                {/* Left: Avatar + Text */}

{children}
                {/* Right: Icon with slow double-ring pulse (border only) */}
              
            </div>
        </header>)
}

export default HeaderPage