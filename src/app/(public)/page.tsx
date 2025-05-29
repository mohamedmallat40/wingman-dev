import FadeInImage from '@/components/fade-in-image';
import { Button } from '@heroui/button'
import { Icon } from '@iconify/react';
import { useTranslations } from 'next-intl';
import React from 'react'

const page = () => {
    const t = useTranslations('HomePage');

    return (
        <>
    <section className='z-20 flex flex-col items-center justify-center gap-[18px] sm:gap-6'>
       <h1 className='text-'>
        Samen bereik je meer.

       </h1>
          <div className='text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]'>
           
            <div className='bg-hero-section-title bg-clip-text text-transparent'>
              Easiest way to <br /> power global teams.
            </div>
          </div>
          <p className='text-center font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]'>
            Acme makes running global teams simple. HR, Payroll, International Employment,
            contractor management and more.
          </p>
          <div className='flex flex-col items-center justify-center gap-6 sm:flex-row'>
            <Button
              className='h-10 w-[163px]  px-[16px] py-[10px] text-small leading-5'
              radius='full'
              color="primary"
            >
              Get Started
            </Button>
            <Button
              className='h-10 w-[163px] border-1 border-default-100 px-[16px] py-[10px] text-small font-medium leading-5'
              endContent={
                <span className='pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100'>
                  <Icon
                    className='text-default-500 [&>path]:stroke-[1.5]'
                    icon='solar:arrow-right-linear'
                    width={16}
                  />
                </span>
              }
              radius='full'
              variant='bordered'
            >
              See our planss
              {t('title')}
            </Button>
          </div>
        </section>
        <div className='pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125'>
          {/**
           * If using in a nextjs project, use next/image instead of <img> in <FadeInImage>.
           * Also pass the following additional props to <FadeInImage>.
           *
           * ```tsx
           * <FadeInImage
           *   fill
           *   priority
           *   // existing code...
           * />
           * ```
           */}
          <FadeInImage
            alt='Gradient background'
            src='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png'
          />
        </div>
        </>)
}

export default page