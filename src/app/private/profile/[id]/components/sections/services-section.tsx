import React from 'react';

import { Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IService } from '@root/modules/profile/types';

import { ActionButtons } from '../ActionButtons';

interface ServicesSectionProps {
  services: IService[];
  isOwnProfile: boolean;
  onAdd: () => void;
  onEdit: (service: IService) => void;
  onDelete: (service: IService) => void;
  t: (key: string) => string;
}

const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  isOwnProfile,
  onAdd,
  onEdit,
  onDelete,
  t
}) => {
  const getServiceTypeDisplay = (type: IService['type']) => {
    const typeMap = {
      HOURLY_BASED: 'Per Hour',
      DAILY_BASED: 'Per Day',
      PROJECT_BASED: 'Fixed Price'
    };
    return typeMap[type] || type;
  };

  const getServiceTypeColor = (type: IService['type']) => {
    const colorMap = {
      HOURLY_BASED: 'primary',
      DAILY_BASED: 'warning',
      PROJECT_BASED: 'success'
    };
    return colorMap[type] || 'default';
  };

  const formatPrice = (price: number, type: IService['type']) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);

    switch (type) {
      case 'HOURLY_BASED':
        return `${formatted}/hr`;
      case 'DAILY_BASED':
        return `${formatted}/day`;
      case 'PROJECT_BASED':
        return `${formatted} fixed`;
      default:
        return formatted;
    }
  };

  return (
    <Card
      id='services'
      className='border-default-200/50 hover:border-success/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
    >
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-success/10 rounded-full p-3'>
              <Icon icon='solar:bag-smile-linear' className='text-success h-5 w-5' />
            </div>
            <div>
              <h2 className='text-foreground text-xl font-semibold'>
                Services ({services.length})
              </h2>
              <p className='text-small text-foreground-500 mt-1'>
                Professional services and offerings
              </p>
            </div>
          </div>

          {isOwnProfile && (
            <ActionButtons showAdd onAdd={onAdd} addTooltip='Add new service' size='md' />
          )}
        </div>
      </CardHeader>
      <CardBody className='px-8 pt-2'>
        {services.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {services.map((service, index) => (
              <Card
                key={service.id || index}
                className='bg-default-50 hover:bg-default-100 border-default-200 border transition-all duration-200 hover:shadow-md'
              >
                <CardBody className='p-6'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center gap-2'>
                        <h3 className='text-foreground text-lg font-bold'>{service.name}</h3>
                        {isOwnProfile && (
                          <ActionButtons
                            showEdit
                            showDelete
                            onEdit={() => onEdit(service)}
                            onDelete={() => onDelete(service)}
                            editTooltip={`Edit ${service.name} service`}
                            deleteTooltip={`Delete ${service.name} service`}
                            size='sm'
                          />
                        )}
                      </div>
                      <div className='mb-3 flex items-center gap-2'>
                        <Chip
                          color={getServiceTypeColor(service.type) as any}
                          variant='flat'
                          size='sm'
                        >
                          {getServiceTypeDisplay(service.type)}
                        </Chip>
                        <span className='text-success text-lg font-bold'>
                          {formatPrice(service.price, service.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className='text-foreground-600 mb-4 text-sm leading-relaxed'>
                    {service.description}
                  </p>

                  {service.skills && service.skills.length > 0 && (
                    <div className='space-y-2'>
                      <p className='text-foreground-500 text-xs font-medium tracking-wide uppercase'>
                        Skills Required
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {service.skills.map((skill, skillIndex) => (
                          <Chip
                            key={skillIndex}
                            size='sm'
                            variant='bordered'
                            color='default'
                            className='text-xs'
                          >
                            {skill}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-12 text-center'>
            <div>
              <Icon
                icon='solar:bag-smile-linear'
                className='text-default-300 mx-auto mb-4 h-12 w-12'
              />
              <p className='text-foreground-500 mb-4'>No services available</p>
              {isOwnProfile && (
                <Button
                  color='primary'
                  variant='flat'
                  size='sm'
                  startContent={<Icon icon='solar:plus-linear' className='h-4 w-4' />}
                  onPress={onAdd}
                >
                  Add Service
                </Button>
              )}
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { ServicesSection };
