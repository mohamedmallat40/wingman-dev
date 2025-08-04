import type { IReview } from '@root/modules/profile/types';

import { Avatar, Button, Card, CardBody, CardHeader, Chip } from '@heroui/react';
import { Edit, Star, StarHalf } from 'lucide-react';

import { formatDate } from '@/lib/utils/utilities';

interface ReviewsSectionProperties {
  reviews: IReview[];
}

export default function ReviewsSection({ reviews }: Readonly<ReviewsSectionProperties>) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let index = 0; index < fullStars; index++) {
      stars.push(
        <Star key={`full-${index}`} size={16} className='fill-yellow-400 text-yellow-400' />
      );
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key='half' size={16} className='fill-yellow-400 text-yellow-400' />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let index = 0; index < emptyStars; index++) {
      stars.push(
        <Star key={`empty-${index}`} size={16} className='text-gray-300 dark:text-gray-600' />
      );
    }

    return stars;
  };

  const getStatusColor = (status: IReview['status']) => {
    switch (status) {
      case 'ACTIVE': {
        return 'success';
      }
      case 'PENDING': {
        return 'warning';
      }
      case 'INACTIVE': {
        return 'danger';
      }
      default: {
        return 'default';
      }
    }
  };

  const calculateAverageRating = () => {
    if (reviews.length === 0) return '0';
    const activeReviews = reviews.filter((review) => review.status === 'ACTIVE');
    if (activeReviews.length === 0) return '0';

    const sum = activeReviews.reduce((accumulator, review) => accumulator + review.stars, 0);
    return (sum / activeReviews.length).toFixed(1);
  };

  const activeReviews = reviews.filter((review) => review.status === 'ACTIVE');

  return (
    <Card className='w-full'>
      <CardHeader className='flex flex-row items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h2 className='text-2xl font-bold'>Client Reviews</h2>
          {activeReviews.length > 0 && (
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1'>
                {renderStars(Number.parseFloat(calculateAverageRating()))}
              </div>
              <span className='text-lg font-semibold'>{calculateAverageRating()}</span>
              <span className='text-sm text-gray-500 dark:text-gray-400'>
                ({activeReviews.length} review{activeReviews.length === 1 ? '' : 's'})
              </span>
            </div>
          )}
        </div>
        <Button
          isIconOnly
          variant='light'
          className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <Edit size={20} />
        </Button>
      </CardHeader>
      <CardBody>
        {reviews.length === 0 ? (
          <div className='py-12 text-center'>
            <div className='mb-4 text-gray-400 dark:text-gray-600'>
              <Star size={48} className='mx-auto' />
            </div>
            <h3 className='mb-2 text-lg font-medium text-gray-900 dark:text-white'>
              No Reviews Yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Client reviews will appear here once you start receiving feedback.
            </p>
          </div>
        ) : (
          <div className='space-y-6'>
            {reviews.map((review) => (
              <div
                key={review.id}
                className='rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50'
              >
                <div className='flex items-start gap-4'>
                  <Avatar
                    name={review.name}
                    className='h-12 w-12 flex-shrink-0'
                    getInitials={(name) =>
                      name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    }
                  />

                  <div className='min-w-0 flex-1'>
                    <div className='mb-3 flex items-start justify-between gap-4'>
                      <div className='flex-1'>
                        <div className='mb-1 flex items-center gap-2'>
                          <h4 className='font-semibold text-gray-900 dark:text-white'>
                            {review.name}
                          </h4>
                          <Chip
                            size='sm'
                            variant='flat'
                            color={getStatusColor(review.status)}
                            className='text-xs'
                          >
                            {review.status}
                          </Chip>
                        </div>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          {review.position} at {review.companyName}
                        </p>
                        <div className='mt-2 flex items-center gap-2'>
                          <div className='flex items-center gap-1'>{renderStars(review.stars)}</div>
                          <span className='text-sm font-medium'>{review.stars}</span>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>

                    <blockquote className='leading-relaxed text-gray-700 dark:text-gray-300'>
                      &quot;{review.testimony}&quot;
                    </blockquote>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
