import React from 'react';

import { Avatar, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Icon } from '@iconify/react';
import { type IReview } from '@root/modules/profile/types';

import { ActionButtons } from '../ActionButtons';

interface TestimonialsSectionProps {
  testimonials: IReview[];
  isOwnProfile: boolean;
  onView: (testimonial: IReview) => void;
  onDelete: (testimonial: IReview) => void;
  t: (key: string) => string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  testimonials,
  isOwnProfile,
  onView,
  onDelete,
  t
}) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className='flex gap-0.5'>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon={star <= rating ? 'solar:star-bold' : 'solar:star-linear'}
            className={`h-4 w-4 ${star <= rating ? 'text-warning' : 'text-default-300'}`}
          />
        ))}
      </div>
    );
  };

  const getAverageRating = () => {
    if (testimonials.length === 0) return 0;
    const sum = testimonials.reduce((acc, testimonial) => acc + testimonial.stars, 0);
    return (sum / testimonials.length).toFixed(1);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      id='testimonials'
      className='border-default-200/50 hover:border-warning/20 scroll-mt-24 shadow-sm transition-all duration-300 hover:shadow-md'
    >
      <CardHeader className='pb-4'>
        <div className='flex w-full items-center justify-between'>
          <div className='flex items-center gap-4'>
            <div className='bg-warning/10 rounded-full p-3'>
              <Icon icon='solar:star-bold' className='text-warning h-5 w-5' />
            </div>
            <div>
              <div className='flex items-center gap-3'>
                <h2 className='text-foreground text-xl font-semibold'>
                  Testimonials ({testimonials.length})
                </h2>
                {testimonials.length > 0 && (
                  <div className='flex items-center gap-2'>
                    {renderStars(Number(getAverageRating()))}
                    <span className='text-foreground-600 text-sm font-medium'>
                      {getAverageRating()}
                    </span>
                  </div>
                )}
              </div>
              <p className='text-small text-foreground-500 mt-1'>Client feedback and reviews</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardBody className='px-8 pt-2'>
        {testimonials.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.id || index}
                className='bg-default-50 hover:bg-default-100 border-default-200 cursor-pointer border transition-all duration-200 hover:shadow-md'
                isPressable
                onPress={() => onView(testimonial)}
              >
                <CardBody className='p-6'>
                  <div className='mb-4 flex items-start justify-between'>
                    <div className='flex flex-1 items-start gap-3'>
                      <Avatar
                        name={getInitials(testimonial.name)}
                        size='sm'
                        className='bg-warning/20 text-warning flex-shrink-0 font-semibold'
                      />
                      <div className='min-w-0 flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <h3 className='text-foreground truncate font-semibold'>
                            {testimonial.name}
                          </h3>
                          {testimonial.status && (
                            <Chip
                              size='sm'
                              color={
                                testimonial.status === 'ACTIVE'
                                  ? 'success'
                                  : testimonial.status === 'PENDING'
                                    ? 'warning'
                                    : 'default'
                              }
                              variant='flat'
                              className='text-tiny'
                            >
                              {testimonial.status}
                            </Chip>
                          )}
                        </div>
                        <p className='text-foreground-600 truncate text-sm'>
                          {testimonial.position} at {testimonial.companyName}
                        </p>
                        <div className='mt-1 flex items-center gap-2'>
                          {renderStars(testimonial.stars)}
                          <span className='text-foreground-500 text-xs'>
                            {testimonial.createdAt && formatDate(testimonial.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isOwnProfile && (
                      <div className='flex flex-shrink-0 gap-1'>
                        <ActionButtons
                          showDelete
                          onDelete={() => onDelete(testimonial)}
                          deleteTooltip={`Delete testimonial from ${testimonial.name}`}
                          size='sm'
                        />
                      </div>
                    )}
                  </div>

                  <blockquote className='text-foreground-700 line-clamp-3 text-sm leading-relaxed'>
                    "{testimonial.testimony}"
                  </blockquote>

                  <div className='mt-4 flex items-center justify-between'>
                    <Button
                      size='sm'
                      variant='light'
                      color='primary'
                      onPress={() => onView(testimonial)}
                      className='text-xs'
                    >
                      Read More
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-12 text-center'>
            <div>
              <Icon icon='solar:star-linear' className='text-default-300 mx-auto mb-4 h-12 w-12' />
              <p className='text-foreground-500 mb-2'>No testimonials yet</p>
              <p className='text-foreground-400 text-sm'>
                {isOwnProfile
                  ? 'Client testimonials will appear here once they leave feedback'
                  : "This user hasn't received any testimonials yet"}
              </p>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export { TestimonialsSection };
