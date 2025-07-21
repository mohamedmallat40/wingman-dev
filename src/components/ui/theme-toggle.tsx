'use client';

import React from 'react';

import { Button } from '@heroui/button';
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@heroui/dropdown';
import { Laptop, MoonStar, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown className='min-w-32'>
      <DropdownTrigger>
        <Button
          data-testid='theme-toggle'
          isIconOnly
          variant='light'
          radius='full'
          className='hover:bg-content2'
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-foreground' />
          <MoonStar className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu data-testid='theme-dropdown-content'>
        <DropdownItem
          key='theme-light'
          data-testid='theme-light'
          onPress={() => {
            setTheme('light');
          }}
        >
          <div className='flex items-center'>
            <Sun className='mr-2 h-[1.2rem] w-[1.2rem] ' />
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
