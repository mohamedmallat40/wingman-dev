'use client';

import React from 'react';

import { Button, Card, CardBody, Input, Select, SelectItem, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';

import { type SocialAccount } from '../../types';

interface SocialAccountsFormProps {
  socialAccounts: SocialAccount[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: SocialAccount) => void;
}

const platformOptions = [
  { key: 'linkedin', label: 'LinkedIn', icon: 'solar:linkedin-linear', color: 'text-blue-600' },
  { key: 'github', label: 'GitHub', icon: 'solar:code-square-linear', color: 'text-gray-800' },
  { key: 'twitter', label: 'Twitter', icon: 'solar:twitter-linear', color: 'text-blue-400' },
  { key: 'instagram', label: 'Instagram', icon: 'solar:instagram-linear', color: 'text-pink-600' },
  { key: 'facebook', label: 'Facebook', icon: 'solar:facebook-linear', color: 'text-blue-700' },
  { key: 'youtube', label: 'YouTube', icon: 'solar:youtube-linear', color: 'text-red-600' },
  { key: 'tiktok', label: 'TikTok', icon: 'solar:music-note-linear', color: 'text-black' },
  { key: 'behance', label: 'Behance', icon: 'solar:palette-linear', color: 'text-blue-500' },
  { key: 'dribbble', label: 'Dribbble', icon: 'solar:basketball-linear', color: 'text-pink-500' },
  { key: 'medium', label: 'Medium', icon: 'solar:pen-new-square-linear', color: 'text-green-600' },
  {
    key: 'portfolio',
    label: 'Portfolio',
    icon: 'solar:folder-open-linear',
    color: 'text-purple-600'
  },
  { key: 'other', label: 'Other', icon: 'solar:link-linear', color: 'text-default-600' }
];

export const SocialAccountsForm: React.FC<SocialAccountsFormProps> = ({
  socialAccounts,
  onAdd,
  onRemove,
  onUpdate
}) => {
  const getPlatformDetails = (platform: string) => {
    return (
      platformOptions.find((option) => option.key === platform) ||
      platformOptions[platformOptions.length - 1]
    );
  };

  const generateBaseUrl = (platform: string, username: string) => {
    const baseUrls: Record<string, string> = {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
      twitter: 'https://twitter.com/',
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      youtube: 'https://youtube.com/@',
      tiktok: 'https://tiktok.com/@',
      behance: 'https://behance.net/',
      dribbble: 'https://dribbble.com/',
      medium: 'https://medium.com/@'
    };

    return baseUrls[platform] ? `${baseUrls[platform]}${username}` : '';
  };

  const handlePlatformChange = (index: number, platform: string) => {
    const account = socialAccounts[index];
    if (!account) return;
    const baseUrl = generateBaseUrl(platform, account.username);
    onUpdate(index, {
      ...account,
      platform: platform as SocialAccount['platform'],
      url: baseUrl || account.url,
      id: account.id,
      username: account.username,
      isPublic: account.isPublic
    } as SocialAccount);
  };

  const handleUsernameChange = (index: number, username: string) => {
    const account = socialAccounts[index];
    if (!account) return;
    const baseUrl = generateBaseUrl(account.platform, username);
    onUpdate(index, {
      ...account,
      username,
      url: baseUrl || account.url,
      id: account.id,
      platform: account.platform,
      isPublic: account.isPublic
    } as SocialAccount);
  };

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Social Accounts ({socialAccounts.length})</h3>
          <p className='text-default-600 text-sm'>
            Connect your social media profiles and portfolios
          </p>
        </div>
        <Button
          color='primary'
          variant='flat'
          startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
          onPress={onAdd}
        >
          Add Social Account
        </Button>
      </div>

      <div className='max-h-96 space-y-4 overflow-y-auto pr-2'>
        {socialAccounts.map((account, index) => {
          const platformDetails = getPlatformDetails(account.platform);

          return (
            <Card
              key={account.id}
              className='border-default-200 hover:border-primary/50 border-2 transition-colors'
            >
              <CardBody className='p-4'>
                <div className='space-y-4'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='bg-default-100 rounded-lg p-2'>
                        <Icon
                          icon={platformDetails?.icon || 'solar:link-outline'}
                          className={`h-5 w-5 ${platformDetails?.color || 'text-default-500'}`}
                        />
                      </div>
                      <div>
                        <h4 className='text-foreground font-medium'>
                          {account.displayName || platformDetails?.label || account.platform}
                        </h4>
                        <p className='text-default-600 text-sm'>
                          @{account.username || 'username'}
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Switch
                        size='sm'
                        isSelected={account.isPublic}
                        onValueChange={(isPublic) => onUpdate(index, { ...account, isPublic })}
                        color='success'
                      >
                        <span className='text-default-600 text-sm'>Public</span>
                      </Switch>
                      <Button
                        isIconOnly
                        variant='light'
                        color='danger'
                        size='sm'
                        onPress={() => onRemove(index)}
                      >
                        <Icon icon='solar:trash-bin-minimalistic-linear' className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Select
                      label='Platform'
                      selectedKeys={[account.platform]}
                      onSelectionChange={(keys) => {
                        const platform = Array.from(keys)[0] as string;
                        handlePlatformChange(index, platform);
                      }}
                      variant='bordered'
                      size='sm'
                    >
                      {platformOptions.map((platform) => (
                        <SelectItem
                          key={platform.key}
                          startContent={
                            <Icon icon={platform.icon} className={`h-4 w-4 ${platform.color}`} />
                          }
                        >
                          {platform.label}
                        </SelectItem>
                      ))}
                    </Select>

                    <Input
                      label='Username'
                      value={account.username}
                      onChange={(e) => handleUsernameChange(index, e.target.value)}
                      variant='bordered'
                      size='sm'
                      startContent='@'
                    />
                  </div>

                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                    <Input
                      label='Custom Display Name'
                      placeholder={platformDetails?.label || account.platform}
                      value={account.displayName || ''}
                      onChange={(e) => onUpdate(index, { ...account, displayName: e.target.value })}
                      variant='bordered'
                      size='sm'
                    />

                    <Input
                      label='Full URL'
                      value={account.url}
                      onChange={(e) => onUpdate(index, { ...account, url: e.target.value })}
                      variant='bordered'
                      size='sm'
                      startContent={
                        <Icon icon='solar:link-linear' className='text-default-400 h-4 w-4' />
                      }
                    />
                  </div>

                  {account.url && (
                    <div className='bg-default-50 flex items-center gap-2 rounded-lg p-3'>
                      <Icon icon='solar:eye-linear' className='text-default-600 h-4 w-4' />
                      <span className='text-default-600 text-sm'>Preview:</span>
                      <a
                        href={account.url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary truncate text-sm hover:underline'
                      >
                        {account.url}
                      </a>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      {socialAccounts.length === 0 && (
        <div className='flex items-center justify-center py-12 text-center'>
          <div>
            <Icon
              icon='solar:link-circle-linear'
              className='text-default-300 mx-auto mb-4 h-12 w-12'
            />
            <p className='text-default-500 mb-4'>No social accounts added yet</p>
            <Button
              color='primary'
              variant='flat'
              startContent={<Icon icon='solar:add-circle-linear' className='h-4 w-4' />}
              onPress={onAdd}
            >
              Add your first social account
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
