
import React from 'react';

import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle, type NavbarProps } from '@heroui/navbar';


import { Icon } from '@iconify/react';

import { WingmanIcon } from '@/components/icons/wingman';
import { Link } from '@heroui/link';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { cn } from '@heroui/theme';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import Login from '@/app/(public)/components/login';

const menuItems = [
  'About',
  'Blog',
  'Customers',
  'Pricing',
  'Enterprise',
  'Changelog',
  'Documentation',
  'Contact Us'
];

const BasicNavbar =
  ({ classNames = {}, ...props }) => {

    return (
      <Navbar

        {...props}
        classNames={{
          base: cn('border-default-100 bg-transparent', {
          }),
          wrapper: 'w-full justify-center',
          item: 'hidden md:flex',
          ...classNames
        }}
        height='60px'

      >
        {/* Left Content */}
        <NavbarBrand className='mr-4'>
          <NavbarMenuToggle className='mr-2 h-6 sm:hidden' />
          <WingmanIcon />
          <div className='hidden flex-col sm:flex'>
            <p className='font-bold leading-tight tracking-[0.4em] text-inherit'> WINGMAN</p>
            <p className='text-xs leading-tight text-inherit opacity-70'> BY EXTRAEXPERTISE</p>
          </div>
        </NavbarBrand>

        {/* Center Content */}
        <NavbarContent justify='center'>
          <NavbarItem isActive className="data-[active='true']:font-medium[date-active='true']">
            <Link aria-current='page' className='text-default-foreground' href='#' size='sm'>
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='text-default-500' href='#' size='sm'>
              Services
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='text-default-500' href='#' size='sm'>
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='text-default-500' href='#' size='sm'>
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='text-default-500' href='#' size='sm'>
              Pricing
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Right Content */}
        <NavbarContent className='hidden md:flex' justify='end'>
          <NavbarItem className='ml-2 !flex gap-2'>
            <Login />
            <Button
              className='font-medium'
              color='primary'
              endContent={<Icon icon='solar:alt-arrow-right-linear' />}
              radius='full'
         
            >
              Get Started
            </Button>
          </NavbarItem>
        </NavbarContent>
        <NavbarItem>
          <LanguageSwitcher />

        </NavbarItem>
        <NavbarMenuToggle className='text-default-400 md:hidden' />

        <NavbarMenu
          className='top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50'
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: 'easeInOut',
              duration: 0.2
            }
          }}
        >


          <NavbarMenuItem>
            <Button fullWidth as={Link} href='/#' variant='faded'>
              Sign Ins
            </Button>
          </NavbarMenuItem>
          <NavbarMenuItem className='mb-4'>
            <Button fullWidth as={Link} className='bg-foreground text-background' href='/#'>
              Get Started
            </Button>
          </NavbarMenuItem>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link className='mb-2 w-full text-default-500' href='#' size='md'>
                {item}
              </Link>
              {index < menuItems.length - 1 && <Divider className='opacity-50' />}
            </NavbarMenuItem>
          ))}
        </NavbarMenu>

      </Navbar>
    );
  }

BasicNavbar.displayName = 'BasicNavbar';

export default BasicNavbar;
