'use client';

import { useState } from 'react';

import { Card, CardBody, Spinner, Tab, Tabs } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, GraduationCap, Settings, User } from 'lucide-react';

import EducationTab from './components/education-tab';
import ExperienceProjectsTab from './components/experience-projects-tab';
import GeneralInfoTab from './components/general-info-tab';
import ServicesTab from './components/services-tab';

// Mock API function - replace with your actual API call
async function fetchUserSettings() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: '1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    avatar: '/placeholder.svg?height=120&width=120',
    address: {
      street: 'Oak Street',
      houseNumber: '123',
      city: 'San Francisco',
      country: 'USA'
    },
    aboutMe:
      'Passionate full-stack developer with expertise in modern web technologies. I love creating scalable applications and solving complex problems.',
    experienceYears: 5,
    hourlyRate: 85,
    paymentType: 'hourly' as const,
    skills: [
      { id: 1, key: 'React' },
      { id: 2, key: 'Node.js' },
      { id: 3, key: 'TypeScript' },
      { id: 4, key: 'Python' },
      { id: 5, key: 'AWS' }
    ],
    languages: [
      { id: 1, key: 'EN', level: 'Native' as const },
      { id: 2, key: 'ES', level: 'Intermediate' as const },
      { id: 3, key: 'FR', level: 'Basic' as const }
    ],
    projects: [
      {
        id: 1,
        name: 'E-commerce Platform',
        company: 'TechCorp',
        image: '/placeholder.svg?height=200&width=300'
      },
      {
        id: 2,
        name: 'Mobile Banking App',
        company: 'FinanceInc',
        image: '/placeholder.svg?height=200&width=300'
      }
    ],
    experience: [
      {
        id: 1,
        position: 'Senior Full Stack Developer',
        company: 'TechCorp',
        startDate: '2022-01-15',
        endDate: undefined
      },
      {
        id: 2,
        position: 'Frontend Developer',
        company: 'StartupXYZ',
        startDate: '2020-06-01',
        endDate: '2021-12-31'
      }
    ],
    education: [
      {
        id: 1,
        degree: 'Master of Computer Science',
        university: 'Stanford University',
        startDate: '2018-09-01',
        endDate: '2020-05-15',
        description: 'Specialized in Machine Learning and Software Engineering'
      }
    ],
    services: [
      {
        id: '0792cf4a-1f25-4a40-aa56-98fcbad24a09',
        name: 'Web Design',
        description:
          'We build dynamic websites with modern technologies and responsive design principles',
        price: 2500,
        type: 'DAILY_BASED' as const,
        skills: [
          {
            id: 'f23e9dd1-7adf-46fe-9683-5f12c5c7bc79',
            key: 'A/B Testing for Emails',
            type: 'NORMAL' as const
          },
          {
            id: 'ba260616-0137-47dd-b319-cdb3b1da7364',
            key: 'Active Listening',
            type: 'SOFT' as const
          }
        ]
      }
    ]
  };
}

export default function SettingsPage() {
  const [selectedTab, setSelectedTab] = useState('general');

  const {
    data: user,
    isLoading,
    error
  } = useQuery({
    queryKey: ['user-settings'],
    queryFn: fetchUserSettings
  });

  if (isLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (error || !user) {
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
    <div className='min-h-screen w-full bg-transparent py-8 dark:bg-transparent'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
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
                  <GeneralInfoTab user={user as any} />
                </div>
              </Tab>

              <Tab
                key='experience'
                title={
                  <div className='flex items-center space-x-2'>
                    <Briefcase size={18} />
                    <span>Experience & Projects</span>
                  </div>
                }
              >
                <div className='p-6'>
                  <ExperienceProjectsTab user={user as any} />
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
                  <EducationTab user={user as any} />
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
                  <ServicesTab user={user as any} />
                </div>
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
