import React, { useEffect, useState } from 'react';

import type { Language } from '@/i18n/transaltions';

import { Select, SelectItem } from '@heroui/select';
import { Icon } from '@iconify/react';
import { useLocale } from '@react-aria/i18n';

const languages: { key: Language; label: string; icon: string }[] = [
  { key: 'en', label: 'English', icon: 'twemoji:flag-united-kingdom' },
  { key: 'fr', label: 'Français', icon: 'twemoji:flag-france' },
  { key: 'nl', label: 'Nederlands', icon: 'twemoji:flag-netherlands' }
];

interface LanguageSwitcherProps {
  onChange: (lang: Language) => void;
}

export function LanguageSwitcher({ onChange }: LanguageSwitcherProps) {
  const { locale } = useLocale();
  const currentLang = (locale?.slice(0, 2) as Language) || 'en';
  const [selectedKey, setSelectedKey] = useState<Language>(currentLang);

  useEffect(() => {
    setSelectedKey(currentLang);
  }, [currentLang]);

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
        onChange(key);
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
