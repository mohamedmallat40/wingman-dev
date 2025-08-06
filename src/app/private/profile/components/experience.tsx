'use client';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { type IExperience } from '@root/modules/profile/types';
import { Building, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { formatDate } from '@/lib/utils/utilities';

interface ExperienceSectionProperties {
  experience: IExperience[];
}

export default function ExperienceSection({ experience }: Readonly<ExperienceSectionProperties>) {
  const router = useRouter();
  const handleEditClick = () => {
    router.push('/private/settings?tab=experience');
  };
  return (
    <Card className='w-full bg-transparent'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <h2 className='text-2xl font-bold'>Experience</h2>
        <Button
          isIconOnly
          variant='light'
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          onPress={handleEditClick}
        >
          <Edit size={20} />
        </Button>
      </CardHeader>
      <CardBody>
        <div className='space-y-6'>
          {experience.length > 0 ? (
            experience.map((exp, index) => (
              <div key={exp.id} className='relative'>
                {index < experience.length - 1 && (
                  <div className='absolute top-12 left-6 h-16 w-0.5 bg-gray-200 dark:bg-gray-700' />
                )}
                <div className='flex gap-4'>
                  <div className='flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900'>
                    <Building size={20} className='text-blue-600 dark:text-blue-400' />
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {exp.position}
                    </h3>
                    <p className='font-medium text-gray-600 dark:text-gray-400'>{exp.company}</p>
                    <p className='mt-1 text-sm text-gray-500 dark:text-gray-500'>
                      {formatDate(exp.startDate)} -{' '}
                      {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className='py-8 text-center text-gray-500 dark:text-gray-400'>
              <Building size={48} className='mx-auto mb-4 opacity-50' />
              <p>No experience added yet</p>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
