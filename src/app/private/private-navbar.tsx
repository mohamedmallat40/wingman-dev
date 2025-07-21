'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
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
import { Icon } from '@iconify/react/dist/iconify.js';
import { motion, AnimatePresence } from 'framer-motion';

import { WingmanIcon } from '@/components/icons/wingman';

import NotificationsCard from '../../components/notifications/notifications-card';
import { LanguageSwitcher } from '../../components/ui/language-switcher';
import ThemeToggle from '../../components/ui/theme-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import { Tooltip } from '@heroui/tooltip';
import Avatar from '@/app/private/components/Avatar';

const navItems = [
  {
    href: '/private/dashboard',
    label: 'Dashboard',
    icon: 'solar:widget-2-bold-duotone',
    description: 'Overview & Analytics'
  },
  {
    href: '/private/challenges',
    label: 'Challenges',
    icon: 'solar:target-bold-duotone',
    description: 'Programming Challenges'
  },
  {
    href: '/private/talent-pool',
    label: 'Talent Pool',
    icon: 'solar:users-group-two-rounded-bold-duotone',
    description: 'Find Developers'
  },
  {
    href: '/private/documents',
    label: 'Documents',
    icon: 'solar:documents-bold-duotone',
    description: 'Files & Resources'
  }
];

export default function PrivateNavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount] = useState(5);

  return (
    <Navbar 
      className='justify-start backdrop-blur-md bg-background/60 border-b border-divider' 
      isBordered
      maxWidth='full'
      position='sticky'
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent justify='start'>
        <NavbarBrand className='gap-2'>
          <NavbarMenuToggle 
            className='h-6 sm:hidden text-foreground hover:text-primary transition-colors' 
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
            <p className='font-bold leading-tight tracking-[0.4em] text-inherit bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent'>
              WINGMAN
            </p>
            <p className='text-xs leading-tight text-inherit opacity-70'>BY EXTRAEXPERTISE</p>
          </motion.div>
        </NavbarBrand>
        
        <NavbarContent
          className='mx-8 hidden h-12 w-full max-w-fit gap-2 rounded-xl bg-content2/50 px-3 shadow-sm backdrop-blur-sm dark:bg-content1/50 sm:flex'
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
                    className={`relative flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-primary-500 bg-primary-50 dark:bg-primary-100/10'
                        : 'text-foreground-600 hover:text-primary-500 hover:bg-primary-50/50 dark:hover:bg-primary-100/5'
                    }`}
                  >
                    <Icon 
                      icon={item.icon} 
                      className={`text-lg transition-colors ${
                        isActive ? 'text-primary-500' : 'text-foreground-500'
                      }`} 
                    />
                    <span className='font-medium text-sm'>{item.label}</span>
                    {isActive && (
                      <motion.div
                        className='absolute inset-0 bg-primary-100/20 rounded-lg border border-primary-200/50'
                        layoutId='navbar-active'
                        initial={false}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
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
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <LanguageSwitcher />
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <ThemeToggle />
        </motion.div>
        
        <NavbarItem className='flex'>
          <Popover offset={12} placement='bottom-end'>
            <PopoverTrigger>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  disableRipple
                  isIconOnly
                  className='overflow-visible hover:bg-primary-50 dark:hover:bg-primary-100/10'
                  radius='full'
                  variant='light'
                >
                  <motion.div
                    animate={{ 
                      rotate: notificationCount > 0 ? [0, -10, 10, -5, 5, 0] : 0
                    }}
                    transition={{ 
                      duration: 0.6,
                      repeat: notificationCount > 0 ? Infinity,
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
                        icon='solar:bell-bold-duotone' 
                        width={22} 
                      />
                    </Badge>
                  </motion.div>
                </Button>
              </motion.div>
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
          transition={{ duration: 0.3 }}
        >
          <Avatar />
        </motion.div>
      </NavbarContent>
      
      {/* Enhanced Mobile Menu */}
      <NavbarMenu className='pt-6 bg-background/95 backdrop-blur-md'>
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
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all w-full ${
                      isActive
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-100/10'
                        : 'text-foreground hover:bg-content2'
                    }`}
                  >
                    <Icon icon={item.icon} className='text-xl' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>{item.label}</span>
                      <span className='text-tiny text-foreground-500'>{item.description}</span>
                    </div>
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
            className='mt-6 pt-4 border-t border-divider'
          >
            <div className='flex items-center justify-between px-3 py-2'>
              <span className='text-sm font-medium text-foreground-600'>Preferences</span>
              <div className='flex items-center gap-2'>
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        </div>
      </NavbarMenu>
    </Navbar>
  );
}