'use client';

import { useState } from 'react';

import { Badge } from '@heroui/badge';
import { Button } from '@heroui/button';
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
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Tooltip } from '@heroui/tooltip';
import { Icon } from '@iconify/react/dist/iconify.js';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';

import { LoginModal } from '@/app/(public)/components/login';
import Avatar from '@/app/private/components/avatar';
import { WingmanIcon } from '@/components/icons/wingman';

import NotificationsCard from '../../components/notifications/notifications-card';
import { LanguageSwitcher } from '../../components/ui/language-switcher';
import ThemeToggle from '../../components/ui/theme-toggle';

const navItems = [
  {
    href: '/private/dashboard',
    label: 'Dashboard',
    icon: 'solar:chart-square-linear',
    description: 'Overview & Analytics',
    shortLabel: 'Dashboard'
  },
  {
    href: '/private/my-challenges',
    label: 'My Challenges',
    icon: 'solar:cup-star-linear',
    description: 'Your Programming Challenges',
    shortLabel: 'Challenges'
  },
  {
    href: '/private/broadcasts',
    label: 'Broadcasts',
    icon: 'solar:dialog-2-linear',
    description: 'Team updates, announcements & async reviews',
    shortLabel: 'Broadcasts'
  },
  {
    href: '/private/talent-pool',
    label: 'Talent Pool',
    icon: 'solar:users-group-rounded-linear',
    description: 'Find Skilled Freelancers',
    shortLabel: 'Talent'
  },
  {
    href: '/private/documents',
    label: 'Documents',
    icon: 'solar:document-text-linear',
    description: 'Manage Your Documents',
    shortLabel: 'Documents'
  }
];

export default function PrivateNavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount] = useState(5);
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <Navbar
      className='border-divider/40 shadow-small bg-background/95 supports-[backdrop-filter]:bg-background/70 w-full max-w-full border-b backdrop-blur-xl'
      isBordered
      maxWidth='full'
      position='sticky'
      onMenuOpenChange={setIsMenuOpen}
      height='4.5rem'
    >
      <NavbarContent justify='start' className='gap-0'>
        {/* Brand Section with Enhanced Spacing */}
        <NavbarBrand className='mr-8 grow-0 gap-3 lg:mr-12'>
          {/* Mobile Menu Toggle */}
          <NavbarMenuToggle
            className='text-foreground hover:text-primary mr-3 h-8 w-8 transition-colors xl:hidden'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className='flex-shrink-0'
          >
            <WingmanIcon />
          </motion.div>
          
          <motion.div
            className='hidden min-w-0 flex-col sm:flex'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className='from-primary-500 to-secondary-500 bg-gradient-to-r bg-clip-text text-sm leading-tight font-bold tracking-[0.3em] text-inherit sm:text-base'>
              WINGMAN
            </p>
            <p className='text-xs leading-tight text-inherit opacity-70 sm:text-xs'>
              BY EXTRAEXPERTISE
            </p>
          </motion.div>
        </NavbarBrand>

        {/* Desktop Navigation - Enhanced Layout */}
        <NavbarContent className='hidden w-full max-w-none gap-2 xl:flex' justify='start'>
          <div className='from-default-100/40 to-default-50/25 border-divider/25 flex h-11 items-center gap-2 rounded-2xl border bg-gradient-to-r px-3 backdrop-blur-md shadow-small'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavbarItem key={item.href} className='relative'>
                  <Tooltip
                    content={item.description}
                    placement='bottom'
                    delay={500}
                    className='text-tiny'
                  >
                    <Link
                      href={item.href}
                      className={`group relative flex items-center gap-3 rounded-xl px-4 py-2.5 transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-background shadow-medium ring-primary/20 ring-2'
                          : 'text-foreground-600 hover:text-primary hover:bg-background/70 hover:shadow-small'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Icon
                          icon={item.icon}
                          className={`text-[17px] transition-all duration-200 ${
                            isActive
                              ? 'text-primary'
                              : 'text-foreground-500 group-hover:text-primary'
                          }`}
                        />
                      </motion.div>
                      <span
                        className={`text-sm font-medium transition-all duration-200 ${
                          isActive ? 'text-primary' : 'text-foreground-600 group-hover:text-primary'
                        }`}
                      >
                        {item.shortLabel}
                      </span>
                      {isActive && (
                        <motion.div
                          className='bg-primary/5 absolute inset-0 rounded-xl'
                          layoutId='navbar-active'
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </Tooltip>
                </NavbarItem>
              );
            })}
          </div>
        </NavbarContent>

        {/* Tablet Navigation - Icon Only with Enhanced Spacing */}
        <NavbarContent className='hidden w-full max-w-none gap-2 lg:flex xl:hidden' justify='start'>
          <div className='from-default-100/30 to-default-50/20 border-divider/20 flex h-11 items-center gap-2 rounded-xl border bg-gradient-to-r px-3 backdrop-blur-md shadow-small'>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <NavbarItem key={item.href} className='relative'>
                  <Tooltip
                    content={`${item.label} - ${item.description}`}
                    placement='bottom'
                    delay={300}
                    className='text-tiny'
                  >
                    <Link
                      href={item.href}
                      className={`group relative flex items-center justify-center rounded-lg p-3 transition-all duration-200 ${
                        isActive
                          ? 'text-primary bg-background shadow-medium ring-primary/20 ring-2'
                          : 'text-foreground-500 hover:text-primary hover:bg-background/70 hover:shadow-small'
                      }`}
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.1 }}
                      >
                        <Icon
                          icon={item.icon}
                          className={`text-[19px] transition-all duration-200 ${
                            isActive
                              ? 'text-primary'
                              : 'text-foreground-500 group-hover:text-primary'
                          }`}
                        />
                      </motion.div>
                      {isActive && (
                        <motion.div
                          className='bg-primary/5 absolute inset-0 rounded-lg'
                          layoutId='tablet-active'
                          initial={false}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        />
                      )}
                    </Link>
                  </Tooltip>
                </NavbarItem>
              );
            })}
          </div>
        </NavbarContent>
      </NavbarContent>

      {/* Right Side Actions - Enhanced Spacing */}
      <NavbarContent as='div' className='flex items-center gap-3 sm:gap-4' justify='end'>
        {/* Settings Group - Enhanced with Better Spacing */}
        <div className='from-default-100/40 to-default-50/25 border-divider/25 hidden items-center gap-2 rounded-xl border bg-gradient-to-r p-2 backdrop-blur-sm shadow-small sm:flex'>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='hover:bg-background/60 rounded-lg p-2 transition-all duration-200'
          >
            <LanguageSwitcher />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='hover:bg-background/60 rounded-lg p-2 transition-all duration-200'
          >
            <ThemeToggle />
          </motion.div>
        </div>

        {/* Elegant Divider */}
        <div className='bg-divider/50 hidden h-7 w-px rounded-full sm:block' />

        {/* Notifications - Enhanced Button */}
        <NavbarItem className='flex'>
          <Popover offset={16} placement='bottom-end'>
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className='hover:bg-primary/10 hover:shadow-medium h-10 w-10 overflow-visible transition-all duration-200 sm:h-11 sm:w-11'
                radius='full'
                variant='light'
                aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
                as={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{
                    rotate: notificationCount > 0 ? [0, -8, 8, -4, 4, 0] : 0
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: notificationCount > 0 ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 4
                  }}
                >
                  <Badge
                    color='danger'
                    content={
                      notificationCount > 0
                        ? notificationCount > 9
                          ? '9+'
                          : notificationCount
                        : ''
                    }
                    showOutline={false}
                    size='sm'
                    className={notificationCount > 0 ? 'animate-pulse' : ''}
                  >
                    <Icon
                      className={`transition-colors ${
                        notificationCount > 0 ? 'text-primary-500' : 'text-default-500'
                      }`}
                      icon='solar:bell-linear'
                      width={22}
                    />
                  </Badge>
                </motion.div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='max-w-[95vw] p-0 sm:max-w-[420px]'>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{ duration: 0.15 }}
              >
                <NotificationsCard className='w-full shadow-none' />
              </motion.div>
            </PopoverContent>
          </Popover>
        </NavbarItem>

        {/* User Avatar - Enhanced */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className='flex items-center pl-1'
        >
          <Avatar />
        </motion.div>
      </NavbarContent>

      {/* Enhanced Mobile Menu with Professional Spacing */}
      <NavbarMenu className='bg-background/96 border-divider/40 border-r pt-6 shadow-2xl backdrop-blur-2xl'>
        <div className='flex h-full flex-col px-4'>
          {/* Navigation Section */}
          <div className='flex-1'>
            <div className='mb-6 px-2'>
              <p className='text-foreground-600 text-sm font-semibold tracking-wide uppercase'>
                Navigation
              </p>
            </div>

            <div className='flex flex-col gap-2'>
              <AnimatePresence>
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <NavbarMenuItem key={item.href}>
                      <motion.div
                        initial={{ opacity: 0, x: -30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.95 }}
                        transition={{
                          duration: 0.2,
                          delay: index * 0.05,
                          type: 'spring',
                          stiffness: 400,
                          damping: 25
                        }}
                      >
                        <button
                          className={`group flex w-full items-center gap-4 rounded-xl p-4 transition-all duration-200 ${
                            isActive
                              ? 'from-primary/15 to-primary/5 text-primary border-primary/25 shadow-medium border bg-gradient-to-r'
                              : 'text-foreground hover:from-default-100/60 hover:to-default-50/30 hover:shadow-medium hover:border-divider/40 hover:border hover:bg-gradient-to-r active:scale-[0.98]'
                          }`}
                          onClick={() => {
                            setIsMenuOpen(false);
                            router.push(item.href);
                          }}
                        >
                          <motion.div
                            className={`rounded-xl p-3 transition-all duration-200 ${
                              isActive
                                ? 'bg-primary/20 shadow-medium'
                                : 'bg-default-100/70 group-hover:bg-primary/15'
                            }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Icon
                              icon={item.icon}
                              className={`text-xl transition-colors ${isActive ? 'text-primary' : 'text-foreground-600 group-hover:text-primary'}`}
                            />
                          </motion.div>
                          <div className='flex flex-1 flex-col gap-1'>
                            <span
                              className={`font-semibold transition-colors ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}
                            >
                              {item.label}
                            </span>
                            <span
                              className={`text-sm transition-colors ${isActive ? 'text-primary/70' : 'text-foreground-500 group-hover:text-foreground-600'}`}
                            >
                              {item.description}
                            </span>
                          </div>
                          {isActive && (
                            <motion.div
                              className='bg-primary shadow-medium h-8 w-1.5 rounded-full'
                              layoutId='mobile-active'
                              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                          )}
                        </button>
                      </motion.div>
                    </NavbarMenuItem>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Section - Enhanced Spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className='border-divider/50 mt-6 border-t pt-6'
          >
            {/* Settings Card */}
            <div className='mb-6'>
              <div className='from-default-100/60 to-default-50/30 border-divider/30 shadow-medium rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-xl shadow-small'>
                      <Icon icon='solar:settings-bold' className='text-primary h-4 w-4' />
                    </div>
                    <span className='text-foreground font-medium'>Settings</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <motion.div
                      className='hover:bg-background/60 rounded-lg p-2 transition-all duration-200'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LanguageSwitcher />
                    </motion.div>
                    <motion.div
                      className='hover:bg-background/60 rounded-lg p-2 transition-all duration-200'
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ThemeToggle />
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>

            {/* User Profile Card */}
            <div className='pb-6'>
              <div className='from-default-100/60 to-default-50/30 border-divider/30 shadow-medium rounded-xl border bg-gradient-to-r p-4 backdrop-blur-sm'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-xl shadow-small'>
                      <Icon icon='solar:user-bold' className='text-primary h-4 w-4' />
                    </div>
                    <div>
                      <span className='text-foreground font-medium'>Account</span>
                      <p className='text-foreground-500 text-sm'>Profile & Settings</p>
                    </div>
                  </div>
                  <Button
                    size='sm'
                    variant='flat'
                    className='text-primary hover:bg-primary/10'
                    onPress={() => {
                      setIsMenuOpen(false);
                      router.push('/private/profile');
                    }}
                  >
                    <Icon icon='solar:alt-arrow-right-linear' width={16} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </NavbarMenu>

      {/* Login Modal */}
      <LoginModal isOpen={showLoginModal} onOpenChange={setShowLoginModal} />
    </Navbar>
  );
}
