'use client';

import React, { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Button } from '@heroui/button';
import { Icon } from '@iconify/react';
import { useLocale } from 'next-intl';
import { Language } from '@/i18n/config';
import { setUserLocale } from '@/i18n/locale';
import { motion } from 'framer-motion';

const languages: { key: Language; label: string; icon: string }[] = [
  { key: 'en', label: 'English', icon: 'twemoji:flag-united-kingdom' },
  { key: 'fr', label: 'Français', icon: 'twemoji:flag-france' },
  { key: 'nl', label: 'Nederlands', icon: 'twemoji:flag-netherlands' }
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const currentLang = locale || 'en';
  const [selectedKey, setSelectedKey] = useState<string>(currentLang);

  const currentLanguage = languages.find((lang) => lang.key === selectedKey);

  return (
    <Dropdown placement='bottom-end'>
      <DropdownTrigger>
        <Button
          isIconOnly
          size='sm'
          variant='light'
          radius='full'
          className='min-w-8 w-8 h-8 hover:bg-content2 transition-colors'
          aria-label={`Current language: ${currentLanguage?.label}`}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Icon 
              icon={currentLanguage?.icon || 'twemoji:flag-united-kingdom'} 
              className='text-lg'
            />
          </motion.div>
        </Button>
      </DropdownTrigger>
      
      <DropdownMenu
        aria-label='Language selection'
        variant='flat'
        disallowEmptySelection
        selectionMode='single'
        selectedKeys={new Set([selectedKey])}
        onSelectionChange={(keys) => {
          const key = Array.from(keys)[0] as Language;
          setSelectedKey(key);
          setUserLocale(key);
        }}
      >
        {languages.map((lang) => (
          <DropdownItem
            key={lang.key}
            startContent={
              <Icon 
                icon={lang.icon} 
                className='text-lg'
              />
            }
            className={selectedKey === lang.key ? 'bg-primary-50 text-primary-600' : ''}
          >
            {lang.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
