'use client';

import type { IUserProfile, Skill } from '@root/modules/profile/types';

import { Avatar, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { type ILanguage } from '@root/modules/profile/types';
import { Clock, DollarSign, Edit, MapPin } from 'lucide-react';

import { API_ROUTES } from '@/lib/api-routes';

interface GeneralInfoSectionProperties {
  user: IUserProfile;
  languages: ILanguage[] | undefined;
}

export default function GeneralInfoSection({
  user,
  languages
}: Readonly<GeneralInfoSectionProperties>) {
  return (
    <Card className='w-full border-0 bg-transparent'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <h2 className='text-2xl font-bold'>General Information</h2>
        <Button
          isIconOnly
          variant='light'
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <Edit size={20} />
        </Button>
      </CardHeader>
      <CardBody className='space-y-6'>
        {/* Profile Header */}
        <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-start'>
          <Avatar
            src={`${API_ROUTES.profile.image}${user.profileImage}`}
            className='h-24 w-24 sm:h-32 sm:w-32'
            name={`${user.firstName} ${user.lastName}`}
          />
          <div className='flex-1 space-y-3 text-center sm:text-left'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                {user.firstName} {user.lastName}
              </h1>
              <div className='mt-2 flex items-center justify-center gap-2 text-gray-600 sm:justify-start dark:text-gray-400'>
                {user.address.length > 0 && (
                  <>
                    <MapPin size={16} />
                    <span>
                      {user.address[0]?.street} {user.address[0]?.houseNumber},{' '}
                      {user.address[0]?.city}, {user.address[0]?.country}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className='flex flex-wrap justify-center gap-4 text-sm sm:justify-start'>
              <div className='flex items-center gap-2'>
                <Clock size={16} className='text-blue-500' />
                <span>{user.experienceYears} years experience</span>
              </div>
              <div className='flex items-center gap-2'>
                <DollarSign size={16} className='text-green-500' />
                <span>
                  {`${user.hourlyRate}/${user.paymentType === 'HOURLY_BASED' ? 'hour' : 'day'}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* About Me */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>About Me</h3>
          <p
            className='leading-relaxed text-gray-700 dark:text-gray-300'
            dangerouslySetInnerHTML={{ __html: user.aboutMe }}
          ></p>
        </div>

        {/* Skills */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>Skills</h3>
          <div className='flex flex-wrap gap-2'>
            {user.skills.map((skill: Skill) => (
              <Chip key={skill.id} variant='flat' color='default' className='text-sm'>
                {skill.key}
              </Chip>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className='mb-3 text-lg font-semibold'>Languages</h3>
          <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4'>
            {languages?.map((language: ILanguage) => (
              <div
                key={language.id}
                className='flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800'
              >
                <span className='font-medium'>{language.key}</span>
                <Chip size='sm' variant='flat' color='secondary'>
                  {language.level}
                </Chip>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
