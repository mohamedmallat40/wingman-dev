import React from 'react';
import { Progress } from '@heroui/react';
import {
  type IEducation,
  type IExperience,
  type IReview,
  type IService,
  type Skill
} from '@root/modules/profile/types';

interface ProfileCompletionProperties {
  skills: Skill[];
  projects: IExperience[];
  experience: IExperience[];
  education: IEducation[];
  reviews: IReview[];
  services: IService[];
}

export default function ProfileCompletion({
  skills = [],
  projects = [],
  experience = [],
  education = [],
  reviews = [],
  services = []
}: Readonly<ProfileCompletionProperties>) {
  const calculateCompletion = () => {
    let completed = 0;
    const totalSections = 6;

    if (skills.length >= 3) completed++;
    if (projects.length > 0) completed++;
    if (experience.length > 0) completed++;
    if (education.length > 0) completed++;
    if (reviews.length > 0) completed++;
    if (services.length > 0) completed++;

    return Math.round((completed / totalSections) * 100);
  };

  const getCompletionDetails = () => {
    const details = [
      { name: 'Skills', required: 3, current: skills.length, completed: skills.length >= 3 },
      { name: 'Projects', required: 1, current: projects.length, completed: projects.length > 0 },
      {
        name: 'Experience',
        required: 1,
        current: experience.length,
        completed: experience.length > 0
      },
      {
        name: 'Education',
        required: 1,
        current: education.length,
        completed: education.length > 0
      },
      { name: 'Reviews', required: 1, current: reviews.length, completed: reviews.length > 0 },
      { name: 'Services', required: 1, current: services.length, completed: services.length > 0 }
    ];
    return details;
  };

  const completionPercentage = calculateCompletion();
  const completionDetails = getCompletionDetails();
  const isFullyComplete = completionPercentage === 100;

  return (
    <div className='mb-6 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-3 flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
            Profile Completion
          </h3>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            {isFullyComplete
              ? 'Your profile is complete! 🎉'
              : 'Complete your profile to increase visibility'}
          </p>
        </div>
        <div className='text-right'>
          <span className='text-xl font-bold text-gray-900 dark:text-white'>
            {completionPercentage}%
          </span>
        </div>
      </div>

      {/* Progress Bar - Smaller */}
      <div className='mb-3'>
        <Progress
          value={completionPercentage}
          className='w-full'
          color={
            completionPercentage === 100
              ? 'success'
              : (completionPercentage >= 50
                ? 'primary'
                : 'warning')
          }
          size='md'
        />
      </div>

      {/* Completion Details */}
      {!isFullyComplete && (
        <div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
          {completionDetails.map((detail, index) => (
            <div
              key={index}
              className={`flex items-center text-xs ${
                detail.completed
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <span className={`mr-2 ${detail.completed ? '✓' : '○'}`}>
                {detail.completed ? '✓' : '○'}
              </span>
              <span>
                {detail.name} ({detail.current}/{detail.required})
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
