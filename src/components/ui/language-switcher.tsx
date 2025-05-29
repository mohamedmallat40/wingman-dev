'use client'
import React, { useEffect, useState } from 'react';


import { Select, SelectItem } from '@heroui/select';
import { Icon } from '@iconify/react';
import { useLocale } from 'next-intl';
import {Language}from'@/i18n/config'
import { setUserLocale } from '@/i18n/locale';
const languages: { key: Language; label: string; icon: string }[] = [
  { key: 'en', label: 'English', icon: 'twemoji:flag-united-kingdom' },
  { key: 'fr', label: 'Français', icon: 'twemoji:flag-france' },
  { key: 'nl', label: 'Nederlands', icon: 'twemoji:flag-netherlands' }
];




export function LanguageSwitcher() {
  const locale= useLocale();
  const currentLang = locale || 'en';
  const [selectedKey, setSelectedKey] = useState<string>(currentLang);


  return (
    <Select
      aria-label='Language selector'
      className='w-36 max-w-xs'
      renderValue={() => {
        const selected = languages.find((lang) => lang.key === selectedKey);

        if (!selected) return null;

        return (
          <div className='flex items-center gap-2'>
            <Icon className='text-xl' icon={selected.icon} />
            <span>{selected.label}</span>
          </div>
        );
      }}
      selectedKeys={new Set([selectedKey])}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0] as Language;

        setSelectedKey(key);
        setUserLocale(key)
      }}
    >
      {languages.map((lang) => (
        <SelectItem key={lang.key} startContent={<Icon className='text-xl' icon={lang.icon} />}>
          {lang.label}
        </SelectItem>
      ))}
    </Select>
  );
}
