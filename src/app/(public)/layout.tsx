'use client';

import React from 'react';

import type { PropsWithChildren } from 'react';

import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

import FadeInImage from '@/components/fade-in-image';
import PublicGuard from '@/components/providers/client/public-gaurd';

import BasicNavbar from './components/basic-navbar';
import Footer from './components/footer';

type TRootLayout = PropsWithChildren;

export default function PublicLayout({ children }: Readonly<TRootLayout>) {
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <PublicGuard>
      <div className='relative flex h-full w-full flex-col'>
        {/* Background Elements - Fixed position to cover entire viewport including navbar */}
        <div className='pointer-events-none fixed top-0 right-0 bottom-0 left-0 z-0 h-screen min-h-screen w-screen overflow-hidden'>
          {/* Base Background Layer */}
          <div className='from-background via-background to-background absolute -top-10 -right-10 -bottom-10 -left-10 h-[calc(100vh+80px)] w-[calc(100vw+80px)] bg-gradient-to-br' />

          {/* Primary Gradient Background */}
          <div className='from-primary/8 to-secondary/8 absolute -top-10 -right-10 -bottom-10 -left-10 h-[calc(100vh+80px)] w-[calc(100vw+80px)] bg-gradient-to-br via-transparent' />

          {/* Secondary Gradient Overlay */}
          <div className='via-primary/3 absolute -top-10 -right-10 -bottom-10 -left-10 h-[calc(100vh+80px)] w-[calc(100vw+80px)] bg-gradient-to-tr from-transparent to-transparent' />

          {/* Optimized Gradient Orbs - Reduced blur and smaller movement */}
          <motion.div
            className='bg-primary/8 absolute -top-10 -left-10 h-60 w-60 rounded-full blur-xl'
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className='bg-secondary/6 absolute top-1/3 -right-10 h-48 w-48 rounded-full blur-xl'
            animate={{ x: [0, -15, 0], y: [0, 25, 0] }}
            transition={{ duration: 50, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className='bg-primary/5 absolute -right-10 -bottom-10 h-72 w-72 rounded-full blur-xl'
            animate={{ x: [0, -25, 0], y: [0, 15, 0] }}
            transition={{ duration: 60, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className='bg-secondary/8 absolute bottom-1/3 -left-10 h-54 w-54 rounded-full blur-xl'
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 45, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Background Image */}
          <div className='absolute -top-10 -right-10 -bottom-10 -left-10 h-[calc(100vh+80px)] w-[calc(100vw+80px)]'>
            <div className='absolute inset-0 h-full w-full scale-[1.2] opacity-20 select-none'>
              <FadeInImage
                alt='Gradient background'
                src='https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png'
              />
            </div>
          </div>

          {/* Top Gradient Fade */}
          <div className='from-background/20 absolute top-0 left-0 h-32 w-full bg-gradient-to-b to-transparent' />

          {/* Bottom Gradient Fade */}
          <div className='from-background/10 absolute bottom-0 left-0 h-32 w-full bg-gradient-to-t to-transparent' />
        </div>

        {/* Show navbar on all public pages */}
        <BasicNavbar />
        <main className='relative z-10 w-full flex-1'>{children}</main>
        {/* Show footer only on landing page */}
        {isLandingPage && <Footer />}
      </div>
    </PublicGuard>
  );
}
