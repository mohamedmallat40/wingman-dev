import React from 'react';

import { Avatar, Badge, Button, Card, CardBody } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Talent {
  name: string;
  title: string;
  description: string;
  avatarSrc?: string;
  initials?: string;
  isTeam: boolean;
  tags: string[];
  endorsements: number;
  availability: 'available' | 'busy';
  availabilityUntil?: string;
}

interface TalentPoolCardProperties {
  talent: Talent;
  className?: string;
}

export const TalentPoolCard: React.FC<TalentPoolCardProperties> = ({ talent }) => {
  const {
    name,
    title,
    description,
    avatarSrc,
    initials,
    isTeam,
    tags,
    endorsements,
    availability,
    availabilityUntil
  } = talent;

  const isAvailable = availability === 'available';

  return (
    <Card className={`h-full w-full max-w-lg`}>
      <CardBody className='flex h-full flex-col justify-between p-6'>
        <div>
          <div className='mb-4 flex items-center gap-3'>
            <Avatar src={avatarSrc} name={initials ?? name} size='md' />
            <div className='flex-1'>
              <h3 className='flex items-center justify-between gap-2 text-lg font-semibold'>
                {name}
                {talent.isTeam && (
                  <div className='bg-primary flex items-center gap-1 rounded-md px-3 py-1 text-sm text-white'>
                    Team
                  </div>
                )}
              </h3>
              <p className='text-default-500 text-sm'>{title}</p>
            </div>
          </div>
          <p className='text-default-700 mb-4 line-clamp-3 text-sm'>{description}</p>
          <div className='mb-4 flex flex-wrap gap-2'>
            {tags.map((tag, index) => (
              <Badge key={index} variant='flat' size='md' color='success'>
                {tag}
              </Badge>
            ))}
          </div>
          <div className='text-default-500 mb-6 flex items-center justify-between text-sm'>
            <div className='flex items-center gap-1'>
              <Icon icon='lucide:star' className='text-warning' />
              <span>{endorsements} endorsements</span>
            </div>
            <Badge
              color={isAvailable ? 'success' : 'warning'}
              variant='flat'
              size='sm'
              className='flex items-center gap-1'
            >
              <Icon icon={isAvailable ? 'lucide:check-circle' : 'lucide:circle-dot'} />
              {isAvailable ? 'Available now' : `Busy until ${availabilityUntil ?? 'N/A'}`}
            </Badge>
          </div>
        </div>
        <div className='flex gap-2'>
          <Button fullWidth color='primary'>
            {isTeam ? 'Contact Team' : 'Contact'}
          </Button>
          <Button fullWidth variant='bordered'>
            View Profile
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};
