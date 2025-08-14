'use client';

import React, { useEffect, useState } from 'react';

import { Button } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Laptop, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        data-testid='theme-toggle'
        isIconOnly
        variant='light'
        radius='full'
        className='text-default-600 hover:!bg-primary data-[hover=true]:!bg-primary transition-all duration-300 hover:!text-white data-[hover=true]:!text-white'
      >
        <Sun className='h-[1.2rem] w-[1.2rem]' />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Dropdown className='min-w-32'>
      <DropdownTrigger>
        <Button
          data-testid='theme-toggle'
          isIconOnly
          variant='light'
          radius='full'
          className='text-default-600 hover:!bg-primary data-[hover=true]:!bg-primary transition-all duration-300 hover:!text-white data-[hover=true]:!text-white'
        >
          {theme === 'dark' ? (
            <MoonStar className='h-[1.2rem] w-[1.2rem] transition-all duration-300' />
          ) : (
            <Sun className='h-[1.2rem] w-[1.2rem] transition-all duration-300' />
          )}
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        data-testid='theme-dropdown-content'
        itemClasses={{
          base: 'text-default-700 hover:!bg-primary hover:!text-white data-[hover=true]:!bg-primary data-[hover=true]:!text-white transition-all duration-300'
        }}
      >
        <DropdownItem
          key='theme-light'
          data-testid='theme-light'
          onPress={() => {
            setTheme('light');
          }}
        >
          <div className='flex items-center'>
            <Sun className='mr-2 h-[1.2rem] w-[1.2rem]' />
            <span>Light</span>
          </div>
        </DropdownItem>
        <DropdownItem
          key='theme-dark'
          data-testid='theme-dark'
          onPress={() => {
            setTheme('dark');
          }}
        >
          <div className='flex items-center'>
            <MoonStar className='mr-2 h-[1.2rem] w-[1.2rem]' />
            <span>Dark</span>
          </div>
        </DropdownItem>
        <DropdownItem
          key='theme-system'
          data-testid='theme-system'
          onPress={() => {
            setTheme('system');
          }}
        >
          <div className='flex items-center'>
            <Laptop className='mr-2 h-[1.2rem] w-[1.2rem]' />
            <span>System</span>
          </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
