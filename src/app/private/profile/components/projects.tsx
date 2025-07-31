'use client';

import { Button, Card, CardBody, CardHeader } from '@heroui/react';
import { type IExperience } from '@root/modules/profile/types';
import { Edit } from 'lucide-react';
import Image from 'next/image';

import { API_ROUTES } from '@/lib/api-routes';

interface ProjectsSectionProperties {
  projects: IExperience[];
}

export default function ProjectsSection({ projects }: Readonly<ProjectsSectionProperties>) {
  return (
    <Card className='h-auto w-full bg-transparent'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <h2 className='text-2xl font-bold'>Projects</h2>
        <Button
          isIconOnly
          variant='light'
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <Edit size={20} />
        </Button>
      </CardHeader>
      <CardBody>
        <div className='grid grid-cols-1 gap-4'>
          {projects.map((project: IExperience) => (
            <div
              key={project.id}
              className='group relative h-32 cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r from-blue-500 to-purple-600'
            >
              <Image
                src={`${API_ROUTES.profile.image}${project.image ?? ''}`}
                alt={project.title ?? ''}
                fill
                className='object-fill opacity-25 transition-opacity group-hover:opacity-40'
              />
              <div className='absolute inset-0 flex flex-col justify-end p-4'>
                <h3 className='mb-1 text-lg font-bold text-white'>{project.title}</h3>
                <p className='text-sm text-white/90'>{project.company}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
