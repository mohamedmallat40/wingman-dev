'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { Link } from '@heroui/link';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle
} from '@heroui/navbar';
import { cn } from '@heroui/theme';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

import Login, { LoginModal } from '@/app/(public)/components/login';
import { WingmanIcon } from '@/components/icons/wingman';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import ThemeToggle from '@/components/ui/theme-toggle';

const menuItems = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Customers', href: '#customers' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Contact', href: '#contact' }
];

const BasicNavbar = ({ classNames = {}, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  // Smart navigation function for anchor links
  const handleNavigation = (href: string) => {
    // If it's an anchor link (starts with #)
    if (href.startsWith('#')) {
      // If we're on the landing page, scroll to section
      if (pathname === '/') {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        // If we're on another page, navigate to landing page with anchor
        router.push(`/${href}`);
      }
    } else {
      // Regular navigation
      router.push(href);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ willChange: 'transform' }}
    >
      <Navbar
        {...props}
        classNames={{
          base: cn('bg-transparent'),
          wrapper: 'w-full justify-center px-6 lg:px-8 relative z-10',
          item: 'hidden md:flex',
          ...classNames
        }}
        height='88px'
        maxWidth='full'
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Left Content */}
        <NavbarBrand
          className='group mr-4 cursor-pointer'
          onClick={() => {
            router.push('/');
          }}
        >
          <motion.div
            className='flex items-center gap-3'
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className='from-primary/15 to-primary/5 border-primary/20 group-hover:from-primary/25 group-hover:to-primary/10 flex h-12 w-12 items-center justify-center rounded-[16px] border bg-gradient-to-br shadow-[0px_4px_12px_rgba(59,130,246,0.15)] transition-transform transition-colors duration-300 group-hover:scale-110'>
              <WingmanIcon className='text-primary h-7 w-7' />
            </div>
            <div className='hidden flex-col sm:flex'>
              <p className='text-foreground text-xl leading-tight font-bold tracking-[0.15em]'>
                {' '}
                WINGMAN
              </p>
              <p className='text-default-500 text-xs leading-tight font-medium tracking-[0.1em]'>
                {' '}
                BY EXTRAEXPERTISE
              </p>
            </div>
          </motion.div>
        </NavbarBrand>

        {/* Center Content */}
        <NavbarContent justify='center' className='hidden gap-1 lg:flex'>
          {menuItems.map((item, index) => (
            <NavbarItem key={item.label}>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
              >
                <button
                  className='text-default-600 hover:text-primary hover:bg-primary/5 group relative rounded-[12px] px-4 py-2 font-medium tracking-[0.02em] transition-all duration-300 hover:scale-105'
                  onClick={() => handleNavigation(item.href)}
                >
                  {item.label}
                  <span className='from-primary to-secondary absolute inset-x-0 -bottom-1 h-0.5 scale-x-0 rounded-full bg-gradient-to-r transition-transform duration-300 group-hover:scale-x-100' />
                </button>
              </motion.div>
            </NavbarItem>
          ))}
        </NavbarContent>

        {/* Right Content */}
        <NavbarContent className='hidden gap-2 md:flex' justify='end'>
          <NavbarItem>
            <div className='bg-default-100/50 dark:bg-default-50/50 flex items-center gap-2 rounded-[12px] p-1 backdrop-blur-sm'>
              <LanguageSwitcher />
              <div className='bg-default-300/50 h-6 w-px' />
              <ThemeToggle />
            </div>
          </NavbarItem>
          <NavbarItem className='ml-2 flex gap-3'>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Login />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <Button
                className='from-primary to-primary-600 border-primary/20 h-10 border bg-gradient-to-r px-6 font-semibold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0px_12px_24px_rgba(59,130,246,0.25)]'
                color='primary'
                endContent={<Icon icon='solar:rocket-2-linear' className='h-4 w-4' />}
                radius='full'
                size='md'
                onPress={() => router.push('/register')}
              >
                Get Started
              </Button>
            </motion.div>
          </NavbarItem>
        </NavbarContent>

        <NavbarMenuToggle className='text-primary md:hidden' />

        <NavbarMenu
          className='bg-background/95 border-primary/10 top-[calc(var(--navbar-height)_-_1px)] max-h-fit border-t pt-8 pb-8 shadow-[0px_16px_40px_rgba(59,130,246,0.12)] backdrop-blur-xl'
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: 'easeOut',
              duration: 0.3
            }
          }}
        >
          <NavbarMenuItem className='relative z-10 mb-6'>
            <Button
              fullWidth
              variant='bordered'
              className='border-primary/30 hover:border-primary hover:bg-primary/10 bg-background/50 h-14 rounded-[16px] font-medium tracking-[0.02em] backdrop-blur-sm transition-all duration-300'
              startContent={<Icon icon='solar:login-2-linear' className='h-4 w-4' />}
              onPress={() => {
                setIsMenuOpen(false);
                setShowLoginModal(true);
              }}
            >
              Sign In
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className='relative z-10 mb-6'>
            <Button
              fullWidth
              color='primary'
              className='from-primary to-primary-600 border-primary/20 h-14 rounded-[16px] border bg-gradient-to-r font-semibold tracking-[0.02em] shadow-[0px_8px_20px_rgba(59,130,246,0.15)] hover:shadow-[0px_12px_24px_rgba(59,130,246,0.25)]'
              startContent={<Icon icon='solar:rocket-2-linear' className='h-4 w-4' />}
              onPress={() => {
                setIsMenuOpen(false);
                router.push('/register');
              }}
            >
              Get Started
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className='relative z-10 mb-6'>
            <div className='bg-default-100/30 border-default-200/50 flex items-center justify-between rounded-[12px] border p-4 backdrop-blur-sm'>
              <span className='text-default-600 flex items-center gap-2 text-sm font-medium'>
                <Icon icon='solar:global-outline' className='h-4 w-4' />
                Language
              </span>
              <LanguageSwitcher />
            </div>
          </NavbarMenuItem>
          <NavbarMenuItem className='relative z-10 mb-6'>
            <div className='bg-default-100/30 border-default-200/50 flex items-center justify-between rounded-[12px] border p-4 backdrop-blur-sm'>
              <span className='text-default-600 flex items-center gap-2 text-sm font-medium'>
                <Icon icon='solar:palette-outline' className='h-4 w-4' />
                Theme
              </span>
              <ThemeToggle />
            </div>
          </NavbarMenuItem>
          <Divider className='via-primary/20 mb-6 bg-gradient-to-r from-transparent to-transparent' />
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.label}-${index}`} className='relative z-10 mb-4'>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
              >
                <button
                  className='text-default-600 hover:text-primary hover:bg-primary/5 hover:border-primary/20 group flex w-full items-center gap-3 rounded-[12px] border border-transparent px-4 py-3 font-medium tracking-[0.02em] backdrop-blur-sm transition-all duration-300'
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleNavigation(item.href);
                  }}
                >
                  <Icon
                    icon='solar:arrow-right-linear'
                    className='group-hover:text-primary h-4 w-4 opacity-60 transition-all duration-300 group-hover:opacity-100'
                  />
                  {item.label}
                </button>
              </motion.div>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          router.push('/register');
        }}
      />
    </motion.div>
  );
};

BasicNavbar.displayName = 'BasicNavbar';

export default BasicNavbar;
