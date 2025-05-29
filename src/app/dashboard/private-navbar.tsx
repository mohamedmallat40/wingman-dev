
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

import { WingmanIcon } from '@/components/icons/wingman';

import NotificationsCard from '../../components/notifications/notifications-card';
import { LanguageSwitcher } from '../../components/ui/language-switcher';
import ThemeToggle from '../../components/ui/theme-toggle';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/popover';
import { Button } from '@heroui/button';
import { Badge } from '@heroui/badge';
import Avatar from '@/app/dashboard/components/Avatar';

export default function PrivateNavBar() {

 

  return (
    <Navbar isBordered>
      <NavbarContent justify='start'>
        <NavbarBrand className='mr-4'>
          <NavbarMenuToggle className='mr-2 h-6 sm:hidden' />
          <WingmanIcon />
          <div className='hidden flex-col sm:flex'>
            <p className='font-bold leading-tight tracking-[0.4em] text-inherit'>WINGMAN</p>
            <p className='text-xs leading-tight text-inherit opacity-70'>BY EXTRAEXPERTISE</p>
          </div>
        </NavbarBrand>
        <NavbarContent
          className='ml-4 hidden h-12 w-full max-w-fit gap-8 rounded-medium bg-content2 px-4 dark:bg-content1 sm:flex'
          justify='start'
        >
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link aria-current='page' className='flex gap-2 text-inherit' href='#'>
              Challenges
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Talent Pool
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link className='flex gap-2 text-inherit' href='#'>
              Documents
            </Link>
          </NavbarItem>
        </NavbarContent>
      </NavbarContent>
      <NavbarContent as='div' className='items-center' justify='end'>
        <LanguageSwitcher  />
        <ThemeToggle />
        <NavbarItem className='flex'>
          <Popover offset={12} placement='bottom-end'>
            <PopoverTrigger>
              <Button
                disableRipple
                isIconOnly
                className='overflow-visible'
                radius='full'
                variant='light'
              >
                <Badge color='danger' content='5' showOutline={false} size='md'>
                  <Icon className='text-default-500' icon='solar:bell-linear' width={22} />
                </Badge>
              </Button>
            </PopoverTrigger>
            <PopoverContent className='max-w-[90vw] p-0 sm:max-w-[380px]'>
              <NotificationsCard className='w-full shadow-none' />
            </PopoverContent>
          </Popover>
        </NavbarItem>
      <Avatar/>
      </NavbarContent>
      {/* Mobile Menu */}
      <NavbarMenu>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Dashboard
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem isActive>
          <Link aria-current='page' className='w-full' color='primary' href='#'>
            Deployments
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Analytics
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Team
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link className='w-full' color='foreground' href='#'>
            Settings
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
