'use client';

import { Spinner } from '@heroui/react';
import useBasicProfile from '@root/modules/profile/hooks/use-basic-profile';
import useProfile from '@root/modules/profile/hooks/use-profile';
import { useSearchParams } from 'next/navigation';

import EducationSection from './components/education';
import ExperienceSection from './components/experience';
import GeneralInfoSection from './components/general-info';
import ProfileCompletion from './components/profile-completion';
import ProjectsSection from './components/projects';
import ReviewsSection from './components/reviews';
import ServicesSection from './components/services';

export default function ProfilePage() {
  const parameters = useSearchParams();
  const userId = parameters.get('id') ?? '';
  const { profile: currentUserProfile } = useBasicProfile();

  const {
    profile: user,
    projects,
    experience,
    education,
    services,
    languages,
    reviews,
    isLoading,
    error
  } = useProfile(userId);

  // Show loading if we're redirecting or if data is loading
  if ((!userId && !currentUserProfile.id) || isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-center'>
          <h1 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            Profile Not Found
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            The requested profile could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full bg-transparent py-4'>
      <div className='mx-auto px-3 md:mx-auto'>
        {/* Profile Completion Card - Full Width at Top */}
        <ProfileCompletion
          skills={user.skills}
          projects={projects}
          experience={experience}
          education={education}
          reviews={reviews}
          services={services}
        />

        <div className='space-y-8'>
          <GeneralInfoSection user={user} languages={languages} />

          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <ProjectsSection projects={projects} />
            <ServicesSection services={services} />
          </div>
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            <ExperienceSection experience={experience} />
            <EducationSection education={education} />
          </div>
          <div>
            <ReviewsSection reviews={reviews} />
          </div>
        </div>
      </div>
    </div>
  );
}
