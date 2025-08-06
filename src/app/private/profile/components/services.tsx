'use client';

import { Accordion, AccordionItem, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { type IService } from '@root/modules/profile/types';
import { Briefcase, Calendar, Clock, DollarSign, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getSkillColor = (skillType: string) => {
  switch (skillType) {
    case 'SOFT': {
      return 'secondary';
    }
    case 'HARD': {
      return 'primary';
    }
    default: {
      return 'default';
    }
  }
};
const formatPrice = (price: number, type: IService['type']) => {
  const formattedPrice = new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(price);

  switch (type) {
    case 'HOURLY_BASED': {
      return `${formattedPrice}/hour`;
    }
    case 'DAILY_BASED': {
      return `${formattedPrice}/day`;
    }
    case 'PROJECT_BASED': {
      return `${formattedPrice}/project`;
    }
    default: {
      return formattedPrice;
    }
  }
};
interface ServicesSectionProperties {
  services: IService[];
}

export default function ServicesSection({ services }: Readonly<ServicesSectionProperties>) {
  const router = useRouter();

  const handleEditClick = () => {
    router.push('/private/settings?tab=services');
  };
  const getTypeIcon = (type: IService['type']) => {
    switch (type) {
      case 'HOURLY_BASED': {
        return <Clock size={16} className='text-blue-500' />;
      }
      case 'DAILY_BASED': {
        return <Calendar size={16} className='text-green-500' />;
      }
      case 'PROJECT_BASED': {
        return <Briefcase size={16} className='text-purple-500' />;
      }
      default: {
        return <DollarSign size={16} className='text-gray-500' />;
      }
    }
  };

  return (
    <Card className='h-auto w-full bg-transparent'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <h2 className='text-2xl font-bold'>Services</h2>
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
        <Accordion variant='splitted' className='px-0'>
          {services.map((service) => (
            <AccordionItem
              key={service.id}
              aria-label={service.name}
              title={
                <div className='flex w-full items-center justify-between bg-transparent'>
                  <div className='flex items-center gap-3'>
                    <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {service.name}
                    </h3>
                  </div>
                  <div className='flex items-center gap-2 text-sm'>
                    {getTypeIcon(service.type)}
                    <span className='font-medium text-gray-700 dark:text-gray-300'>
                      {formatPrice(service.price, service.type)}
                    </span>
                  </div>
                </div>
              }
              className='group border-default-200 border-1 bg-transparent'
            >
              <div className='space-y-4 pt-2'>
                {/* Description */}
                <div>
                  <h4 className='mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Description
                  </h4>
                  <p className='leading-relaxed text-gray-600 dark:text-gray-400'>
                    {service.description}
                  </p>
                </div>

                {/* Skills */}
                <div>
                  <h4 className='mb-3 text-sm font-semibold text-gray-700 dark:text-gray-300'>
                    Required Skills
                  </h4>
                  <div className='flex flex-wrap gap-2'>
                    {service.skills.map((skill) => (
                      <Chip
                        key={skill.id}
                        variant='flat'
                        color={getSkillColor(skill.type)}
                        size='sm'
                        className='text-xs'
                      >
                        {skill.key}
                      </Chip>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </CardBody>
    </Card>
  );
}
