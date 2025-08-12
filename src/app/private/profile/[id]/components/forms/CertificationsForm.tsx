'use client';

import React from 'react';

import { Button, Card, CardBody, Input } from '@heroui/react';
import { Icon } from '@iconify/react';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
}

interface CertificationsFormProps {
  certifications: Certification[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, data: Certification) => void;
}

export const CertificationsForm: React.FC<CertificationsFormProps> = ({
  certifications,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold'>Certifications ({certifications.length})</h3>
          <p className='text-default-600 text-sm'>Professional certifications and achievements</p>
        </div>
        <Button
          color='primary'
          variant='flat'
          startContent={<Icon icon='solar:add-circle-outline' className='h-4 w-4' />}
          onPress={onAdd}
        >
          Add Certification
        </Button>
      </div>

      <div className='max-h-96 space-y-4 overflow-y-auto pr-2'>
        {certifications.map((cert, index) => (
          <Card key={cert.id} className='border-default-200 border-2'>
            <CardBody className='p-4'>
              <div className='mb-4 flex items-start justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='bg-secondary/20 rounded-lg p-2'>
                    <Icon icon='solar:medal-star-outline' className='text-secondary/70 h-5 w-5' />
                  </div>
                  <div>
                    <h4 className='font-semibold'>{cert.name || 'Certification Name'}</h4>
                    <p className='text-default-600 text-sm'>
                      {cert.issuer || 'Issuing Organization'}
                    </p>
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
              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
                <Input
                  label='Certification Name'
                  variant='bordered'
                  value={cert.name}
                  onChange={(e) => onUpdate(index, { ...cert, name: e.target.value })}
                />
                <Input
                  label='Issuing Organization'
                  variant='bordered'
                  value={cert.issuer}
                  onChange={(e) => onUpdate(index, { ...cert, issuer: e.target.value })}
                />
                <Input
                  label='Issue Date'
                  type='date'
                  variant='bordered'
                  value={cert.issueDate}
                  onChange={(e) => onUpdate(index, { ...cert, issueDate: e.target.value })}
                />
                <Input
                  label='Expiry Date'
                  type='date'
                  variant='bordered'
                  value={cert.expiryDate || ''}
                  onChange={(e) => onUpdate(index, { ...cert, expiryDate: e.target.value })}
                />
              </div>
              <Input
                label='Credential ID'
                variant='bordered'
                value={cert.credentialId || ''}
                onChange={(e) => onUpdate(index, { ...cert, credentialId: e.target.value })}
                className='mt-4'
              />
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};
