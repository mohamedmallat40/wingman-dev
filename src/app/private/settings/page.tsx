'use client';

import { useState } from 'react';

import { Card, CardBody, Spinner, Tab, Tabs } from '@heroui/react';
import { profileOptions } from '@root/modules/profile/hooks/profile.server';
import useProfile from '@root/modules/profile/hooks/use-profile';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, FolderKanban, GraduationCap, Settings, User } from 'lucide-react';

import EducationTab from './components/education-tab';
import ExperienceTab from './components/experience-tab';
import GeneralInfoTab from './components/general-info-tab';
import ProjectsTab from './components/projects-tab';
import ServicesTab from './components/services-tab';

interface SettingsPageProperties {
  userId?: string;
}

export default function SettingsPage({ userId }: Readonly<SettingsPageProperties>) {
  const [selectedTab, setSelectedTab] = useState('general');

  // Get profile data first to extract userId if not provided
  const { data: profileData } = useQuery({
    ...profileOptions,
    staleTime: Infinity // Use cached data if available
  });

  // Use provided userId or extract from profile data
  const currentUserId = userId ?? profileData?.data?.id ?? '';

  const {
    profile: user,
    projects,
    experience,
    education,
    services,
    languages,
    isLoading,
    error
  } = useProfile(currentUserId as string);

  if (isLoading) {
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
            Settings Not Available
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>Unable to load user settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto w-[70%] space-y-8 py-6'>
      <div>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Profile Settings</h1>
          <p className='mt-2 text-gray-600 dark:text-gray-400'>
            Manage your profile information and preferences
          </p>
        </div>

        <Card className='w-full'>
          <CardBody className='p-0'>
            <Tabs
              selectedKey={selectedTab}
              onSelectionChange={(key) => {
                setSelectedTab(key as string);
              }}
              aria-label='Profile settings tabs'
              variant='underlined'
              classNames={{
                tabList: 'gap-6 w-full relative rounded-none p-6 border-b border-divider',
                cursor: 'w-full bg-primary',
                tab: 'max-w-fit px-0 h-12',
                tabContent: 'group-data-[selected=true]:text-primary'
              }}
            >
              <Tab
                key='general'
                title={
                  <div className='flex items-center space-x-2'>
                    <User size={18} />
                    <span>General Info</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <GeneralInfoTab user={user} languages={languages} />
                </div>
              </Tab>

              <Tab
                key='experience'
                title={
                  <div className='flex items-center space-x-2'>
                    <Briefcase size={18} />
                    <span>Experiences</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <ExperienceTab user={user} experiences={experience} />
                </div>
              </Tab>
              <Tab
                key='projects'
                title={
                  <div className='flex items-center space-x-2'>
                    <FolderKanban />
                    <span>Projects</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <ProjectsTab user={user} projects={projects} />
                </div>
              </Tab>

              <Tab
                key='education'
                title={
                  <div className='flex items-center space-x-2'>
                    <GraduationCap size={18} />
                    <span>Education</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <EducationTab user={user} educations={education} />
                </div>
              </Tab>

              <Tab
                key='services'
                title={
                  <div className='flex items-center space-x-2'>
                    <Settings size={18} />
                    <span>Services</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <ServicesTab user={user} services={services} />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
