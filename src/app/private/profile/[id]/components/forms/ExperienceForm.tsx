'use client';

import React from 'react';

import { Button, Card, CardBody, CardHeader, Input, Textarea } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IExperience } from 'modules/profile/types';

interface ExperienceFormProps {
  experience: IExperience[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: IExperience) => void;
}

export const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Work Experience ({experience.length})</h3>
          <p className='text-default-600 text-sm'>Your professional work history</p>
        </div>
        <Button
          color='primary'
          variant='flat'
          startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
          onPress={onAdd}
        >
          Add Experience
        </Button>
      </div>

      <div className='max-h-96 space-y-6 overflow-y-auto pr-2'>
        {experience.map((exp, index) => (
          <Card key={exp.id} className='border-default-200 border-2'>
            <CardHeader className='pb-2'>
              <div className='flex w-full items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/20 rounded-lg p-2'>
                    <Icon icon='solar:briefcase-outline' className='text-primary/70 h-5 w-5' />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{exp.position || 'Position'}</h4>
                    <p className='text-default-600 text-sm'>{exp.company || 'Company'}</p>
                  </div>
                </div>
                <Button
                  size='sm'
                  variant='light'
                  color='danger'
                  isIconOnly
                  onPress={() => onRemove(index)}
                >
                  <Icon icon='solar:trash-bin-trash-outline' className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardBody className='pt-0'>
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Input
                  label='Company'
                  variant='bordered'
                  value={exp.company}
                  onChange={(e) => onUpdate(index, { ...exp, company: e.target.value })}
                />
                <Input
                  label='Position'
                  variant='bordered'
                  value={exp.position}
                  onChange={(e) =>
                    onUpdate(index, { ...exp, position: e.target.value, title: e.target.value })
                  }
                />
                <Input
                  label='Start Date'
                  type='date'
                  variant='bordered'
                  value={exp.startDate}
                  onChange={(e) => onUpdate(index, { ...exp, startDate: e.target.value })}
                />
                <Input
                  label='End Date'
                  type='date'
                  variant='bordered'
                  value={exp.endDate}
                  onChange={(e) => onUpdate(index, { ...exp, endDate: e.target.value })}
                />
              </div>
              <Textarea
                label='Description'
                variant='bordered'
                value={exp.description}
                onChange={(e) => onUpdate(index, { ...exp, description: e.target.value })}
                minRows={3}
                className='mt-4'
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
