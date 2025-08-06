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
import { usePathname } from 'next/navigation';

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
    description: 'Overview & Analytics'
  },
  {
    href: '/private/my-challenges',
    label: 'My Challenges',
    icon: 'solar:cup-star-linear',
    description: 'Your Programming Challenges'
  },
  {
    href: '/private/solutions',
    label: 'Solutions',
    icon: 'solar:code-square-linear',
    description: 'Code Solutions & Reviews'
  },
  {
    href: '/private/talent-pool',
    label: 'Talent Pool',
    icon: 'solar:users-group-rounded-linear',
    description: 'Find Skilled Freelancers'
  },
  {
    href: '/private/documents',
    label: 'Documents',
    icon: 'solar:document-text-linear',
    description: 'Manage Your Documents'
  }
];

export default function PrivateNavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount] = useState(5);

  return (
    <Navbar
      className='border-divider/50 shadow-small backdrop-blur-2xl grid w-full grid-cols-1 border-b bg-background/80 supports-[backdrop-filter]:bg-background/60'
      isBordered
      maxWidth='full'
      position='sticky'
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify='start'>
        <NavbarBrand className='gap-2'>
          <NavbarMenuToggle
            className='text-foreground hover:text-primary h-6 transition-colors sm:hidden'
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          />
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <WingmanIcon />
          </motion.div>
          <motion.div
            className='hidden flex-col sm:flex'
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className='from-primary-500 to-secondary-500 bg-gradient-to-r bg-clip-text leading-tight font-bold tracking-[0.4em] text-inherit'>
              WINGMAN
            </p>
            <p className='text-xs leading-tight text-inherit opacity-70'>BY EXTRAEXPERTISE</p>
          </motion.div>
        </NavbarBrand>

        <NavbarContent
          className='mx-8 hidden h-12 w-full max-w-full gap-1 rounded-2xl bg-gradient-to-r from-default-100/50 to-default-50/30 px-4 backdrop-blur-md border border-divider/30 shadow-small sm:flex'
          justify='start'
        >
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
                    className={`relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-all duration-300 group ${
                      isActive
                        ? 'text-primary bg-background shadow-medium ring-1 ring-primary/20 ring-offset-1 ring-offset-background'
                        : 'text-foreground-600 hover:text-primary hover:bg-background/70 hover:shadow-small hover:ring-1 hover:ring-primary/10'
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                    >
                      <Icon
                        icon={item.icon}
                        className={`text-[18px] transition-all duration-300 ${
                          isActive ? 'text-primary' : 'text-foreground-500 group-hover:text-primary'
                        }`}
                      />
                    </motion.div>
                    <span className={`text-sm font-semibold transition-all duration-300 ${
                      isActive ? 'text-primary' : 'text-foreground-600 group-hover:text-primary'
                    }`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className='absolute inset-0 rounded-xl'
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
        </NavbarContent>
      </NavbarContent>

      <NavbarContent as='div' className='items-center gap-3' justify='end'>
        <div className='flex items-center gap-2 p-1 rounded-2xl bg-gradient-to-r from-default-100/40 to-default-50/20 backdrop-blur-sm border border-divider/20'>
          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-xl hover:bg-background/60 transition-colors duration-200"
          >
            <LanguageSwitcher />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.08 }} 
            whileTap={{ scale: 0.95 }}
            className="p-1.5 rounded-xl hover:bg-background/60 transition-colors duration-200"
          >
            <ThemeToggle />
          </motion.div>
        </div>

        <div className='bg-divider/60 h-8 w-px rounded-full' />

        <NavbarItem className='flex'>
          <Popover offset={12} placement='bottom-end'>
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className='hover:bg-primary/10 hover:shadow-small overflow-visible transition-all duration-200'
                radius='full'
                variant='light'
                aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} new)` : ''}`}
                as={motion.button}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{
                    rotate: notificationCount > 0 ? [0, -10, 10, -5, 5, 0] : 0
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: notificationCount > 0 ? Number.POSITIVE_INFINITY : 0,
                    repeatDelay: 3
                  }}
                >
                  <Badge
                    color='danger'
                    content={notificationCount > 0 ? notificationCount : ''}
                    showOutline={false}
                    size='md'
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
            <PopoverContent className='max-w-[90vw] p-0 sm:max-w-[380px]'>
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <NotificationsCard className='w-full shadow-none' />
              </motion.div>
            </PopoverContent>
          </Popover>
        </NavbarItem>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center"
        >
          <Avatar />
        </motion.div>
      </NavbarContent>

      {/* Enhanced Mobile Menu */}
      <NavbarMenu className='bg-background/98 backdrop-blur-2xl border-r border-divider/50 pt-8 shadow-large'>
        <div className='flex flex-col gap-2'>
          {navItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <NavbarMenuItem key={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={`flex w-full items-center gap-4 rounded-2xl p-4 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/10 to-primary/5 text-primary border border-primary/20 shadow-small'
                        : 'text-foreground hover:bg-gradient-to-r hover:from-default-100/60 hover:to-default-50/30 hover:shadow-small hover:border hover:border-divider/30'
                    }`}
                  >
                    <div className={`p-2 rounded-xl transition-colors duration-300 ${
                      isActive ? 'bg-primary/10' : 'bg-default-100/50'
                    }`}>
                      <Icon icon={item.icon} className={`text-xl ${isActive ? 'text-primary' : 'text-foreground-600'}`} />
                    </div>
                    <div className='flex flex-col flex-1'>
                      <span className={`font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                      <span className={`text-tiny ${isActive ? 'text-primary/70' : 'text-foreground-500'}`}>
                        {item.description}
                      </span>
                    </div>
                    {isActive && (
                      <div className="w-1 h-8 bg-primary rounded-full" />
                    )}
                  </Link>
                </motion.div>
              </NavbarMenuItem>
            );
          })}

          {/* Mobile Settings Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className='border-divider/50 mt-8 border-t pt-6'
          >
            <div className='bg-gradient-to-r from-default-100/60 to-default-50/30 backdrop-blur-sm border border-divider/30 rounded-2xl p-4 shadow-small'>
              <div className='flex items-center justify-between'>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className='text-foreground text-sm font-semibold'>Preferences</span>
                </div>
                <div className='flex items-center gap-3'>
                  <div className="p-2 rounded-xl hover:bg-background/60 transition-colors">
                    <LanguageSwitcher />
                  </div>
                  <div className="p-2 rounded-xl hover:bg-background/60 transition-colors">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}
