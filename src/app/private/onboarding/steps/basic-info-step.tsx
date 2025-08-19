'use client';

import React, { useEffect, useRef, useState } from 'react';

import { type IUserProfile } from '@root/modules/profile/types';
import { ArrowLeft, ArrowRight, ChevronDown, Loader2, Search, X } from 'lucide-react';
import { z } from 'zod';

import wingManApi from '@/lib/axios';

import { type Skill } from '../../skills/types';

interface BasicInfoStepProperties {
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userData: IUserProfile | null;
}

// Enhanced validation schema with dynamic rate validation
const createBasicInfoSchema = (paymentType: string) => {
  const baseSchema = {
    aboutMe: z
      .string()
      .min(10, 'About me must be at least 10 characters')
      .max(500, 'About me must be less than 500 characters'),
    experienceYears: z
      .number()
      .min(0, 'Experience years must be 0 or greater')
      .max(50, 'Experience years must be less than 50'),
    paymentType: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT']),
    profession: z.enum(['FULL_TIME_FREELANCER', 'PART_TIME_FREELANCER', 'CONTRACTOR', 'STUDENT']),
    skills: z
      .array(
        z.object({
          id: z.string(),
          key: z.string()
        })
      )
      .min(3, 'Please select at least three skills'),
    statusAviability: z.enum(['OPEN_FOR_PART_TIME', 'NOT_AVAILABLE', 'OPEN_FOR_PROJECTS']),
    workingTime: z.enum(['FULL_TIME', 'PART_TIME'])
  };

  // Dynamic rate validation based on payment type
  if (paymentType === 'HOURLY_BASED') {
    return z.object({
      ...baseSchema,
      hourlyRate: z.number().min(5, 'Hourly rate must be at least 5 EUR'),
      dailyRate: z.number().optional()
    });
  } else if (paymentType === 'DAILY_BASED') {
    return z.object({
      ...baseSchema,
      dailyRate: z.number().min(5, 'Daily rate must be at least 5 EUR'),
      hourlyRate: z.number().optional()
    });
  } else {
    return z.object({
      ...baseSchema,
      hourlyRate: z.number().optional(),
      dailyRate: z.number().optional()
    });
  }
};

type BasicInfoData = {
  aboutMe: string;
  experienceYears: number;
  paymentType: 'HOURLY_BASED' | 'DAILY_BASED' | 'PROJECT';
  profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT';
  skills: Skill[]; // Changed to store complete skill objects
  statusAviability: 'OPEN_FOR_PART_TIME' | 'NOT_AVAILABLE' | 'OPEN_FOR_PROJECTS';
  workingTime: 'FULL_TIME' | 'PART_TIME';
  hourlyRate?: number;
  dailyRate?: number;
};

export default function BasicInfoStep({
  onNext,
  onPrevious,
  isLoading,
  setIsLoading,
  userData
}: Readonly<BasicInfoStepProperties>) {
  const [formData, setFormData] = useState<IUserProfile>({
    aboutMe: '',
    experienceYears: 0,
    paymentType: 'HOURLY_BASED',
    profession: 'FULL_TIME_FREELANCER',
    skills: [], // Now stores complete skill objects
    statusAviability: 'OPEN_FOR_PROJECTS',
    workingTime: 'FULL_TIME',
    hourlyRate: 0,
    dailyRate: 0
  });

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDataLoading, setIsDataLoading] = useState(true);
  const dropdownReference = useRef<HTMLDivElement>(null);

  // Fetch user data and skills on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch user data and skills in parallel
        const skillsResponse = await wingManApi.get('/skills');

        let skillsData: Skill[] = [];
        if (skillsResponse.status >= 200 && skillsResponse.status < 300) {
          skillsData = await skillsResponse.data;
          setAvailableSkills(skillsData);
          setFilteredSkills(skillsData);
        }


          // Convert user skills to complete skill objects
          const userSkillObjects = userData?.skills.map((userSkill) => {
            if (typeof userSkill === 'object' && userSkill.id && userSkill.key) {
              return userSkill;
            }
            // If userSkill is just a string (id or key), find the matching skill
            const matchingSkill = skillsData.find(
              (skill) => skill.id == userSkill.id || skill.key === userSkill.key
            );
            return matchingSkill ?? { id: userSkill, key: userSkill };
          });

          setFormData((previous) => ({
            ...previous,
            aboutMe: userData.aboutMe ?? '',
            experienceYears: userData.experienceYears ?? 0,
            paymentType: (userData.paymentType as any) ?? 'HOURLY_BASED',
            profession: (userData.profession as any) ?? 'FULL_TIME_FREELANCER',
            skills: userSkillObjects,
            statusAviability: (userData.statusAviability as any) ?? 'OPEN_FOR_PROJECTS',
            workingTime: (userData.workingTime as any) ?? 'FULL_TIME',
            hourlyRate: userData.hourlyRate ?? 0,
            dailyRate: userData.dailyRate ?? 0
          }));
        
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter skills based on search
  useEffect(() => {
    if (skillSearch.trim()) {
      const filtered = availableSkills.filter((skill) =>
        skill.key.toLowerCase().includes(skillSearch.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills(availableSkills);
    }
  }, [skillSearch, availableSkills]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownReference.current && !dropdownReference.current.contains(event.target as Node)) {
        setIsSkillsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field: keyof BasicInfoData, value: any) => {
    setFormData((previous) => {
      const newData = { ...previous, [field]: value };

      // Handle payment type changes - set rates appropriately
      if (field === 'paymentType') {
        switch (value) {
          case 'HOURLY_BASED': {
            newData.dailyRate = 1;
            newData.hourlyRate = previous.hourlyRate || 0;
            break;
          }
          case 'DAILY_BASED': {
            newData.hourlyRate = 1;
            newData.dailyRate = previous.dailyRate || 0;
            break;
          }
          case 'PROJECT': {
            newData.hourlyRate = 1;
            newData.dailyRate = 1;
            break;
          }
        }
      }

      return newData;
    });

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((previous) => ({ ...previous, [field]: '' }));
    }
  };

  const handleSkillSelect = (skillId: string) => {
    const skill = availableSkills.find((s) => s.id === skillId);
    if (skill && !formData.skills.some((s) => s.id === skillId)) {
      setFormData((previous) => ({
        ...previous,
        skills: [...previous.skills, skill]
      }));
    }
    setSkillSearch('');
    setIsSkillsDropdownOpen(false);

    // Clear skills error when user selects skills
    if (errors.skills) {
      setErrors((previous) => ({ ...previous, skills: '' }));
    }
  };

  const handleSkillRemove = (skillId: string) => {
    setFormData((previous) => ({
      ...previous,
      skills: previous.skills.filter((skill) => skill.id !== skillId)
    }));
  };

  const validateForm = () => {
    try {
      const schema = createBasicInfoSchema(formData.paymentType);
      schema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        for (const error_ of error.errors) {
          if (error_.path) {
            newErrors[error_.path[0] as string] = error_.message;
          }
        }
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Prepare data for API - send complete skill objects
      const patchData: any = {
        aboutMe: formData.aboutMe,
        experienceYears: formData.experienceYears,
        paymentType: formData.paymentType,
        profession: formData.profession,
        skills: formData.skills.map((skill) => skill.id), // Send complete skill objects
        statusAviability: formData.statusAviability,
        workingTime: formData.workingTime
      };

      // Add rate based on payment type
      if (formData.paymentType === 'HOURLY_BASED') {
        patchData.hourlyRate = formData.hourlyRate;
        patchData.dailyRate = 1;
      } else if (formData.paymentType === 'DAILY_BASED') {
        patchData.dailyRate = formData.dailyRate;
        patchData.hourlyRate = 1;
      } else {
        patchData.hourlyRate = 1;
        patchData.dailyRate = 1;
      }

      const response = await wingManApi.patch('/users/me', patchData);
      if (response.status >= 200 && response.status < 300) {
        onNext();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const getRateLabel = () => {
    switch (formData.paymentType) {
      case 'HOURLY_BASED': {
        return 'Hourly Rate (EUR)';
      }
      case 'DAILY_BASED': {
        return 'Daily Rate (EUR)';
      }
      case 'PROJECT': {
        return 'Rate (Not applicable for project-based)';
      }
      default: {
        return 'Rate (EUR)';
      }
    }
  };

  const getRateValue = () => {
    switch (formData.paymentType) {
      case 'HOURLY_BASED': {
        return formData.hourlyRate || '';
      }
      case 'DAILY_BASED': {
        return formData.dailyRate || '';
      }
      default: {
        return '';
      }
    }
  };

  const handleRateChange = (value: number) => {
    if (formData.paymentType === 'HOURLY_BASED') {
      handleInputChange('hourlyRate', value);
    } else if (formData.paymentType === 'DAILY_BASED') {
      handleInputChange('dailyRate', value);
    }
  };

  const getRateError = () => {
    if (formData.paymentType === 'HOURLY_BASED') {
      return errors.hourlyRate;
    } else if (formData.paymentType === 'DAILY_BASED') {
      return errors.dailyRate;
    }
    return '';
  };

  if (isDataLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 dark:text-blue-400' />
          <p className='text-gray-600 dark:text-gray-400'>Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900'>
      <div className='mb-8'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100'>
          Tell us about yourself
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>
          This information will help us match you with the right opportunities.
        </p>
      </div>

      <div className='space-y-6'>
        {/* About Me */}
        <div>
          <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            About Me *
          </label>
          <textarea
            rows={4}
            value={formData.aboutMe}
            onChange={(event) => {
              handleInputChange('aboutMe', event.target.value);
            }}
            className={`w-full resize-none rounded-lg border bg-white p-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
              errors.aboutMe
                ? 'border-red-300 dark:border-red-600'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder='Write a short introduction about yourself...'
          />
          {errors.aboutMe && (
            <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.aboutMe}</p>
          )}
          <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            {formData.aboutMe.length}/500 characters
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Payment Type */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Payment Type *
            </label>
            <select
              value={formData.paymentType}
              onChange={(event) => {
                handleInputChange('paymentType', event.target.value);
              }}
              className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            >
              <option value='HOURLY_BASED'>Hourly Based</option>
              <option value='DAILY_BASED'>Daily Based</option>
              <option value='PROJECT'>Project Based</option>
            </select>
          </div>

          {/* Rate */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              {getRateLabel()} {formData.paymentType !== 'PROJECT' && '*'}
            </label>
            <input
              type='number'
              value={getRateValue()}
              onChange={(event) => {
                handleRateChange(Number(event.target.value));
              }}
              disabled={formData.paymentType === 'PROJECT'}
              className={`w-full rounded-lg border bg-white p-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:disabled:bg-gray-700 ${
                getRateError()
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder={
                formData.paymentType === 'PROJECT' ? 'Not applicable' : 'Your rate in EUR'
              }
              min='5'
            />
            {getRateError() && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{getRateError()}</p>
            )}
            {formData.paymentType !== 'PROJECT' && (
              <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                Minimum 5 EUR required
              </p>
            )}
          </div>

          {/* Working Time */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Working Time *
            </label>
            <select
              value={formData.workingTime}
              onChange={(event) => {
                handleInputChange('workingTime', event.target.value);
              }}
              className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            >
              <option value='FULL_TIME'>Full Time</option>
              <option value='PART_TIME'>Part Time</option>
            </select>
            {errors.workingTime && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.workingTime}</p>
            )}
          </div>

          {/* Experience Years */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Years of Experience *
            </label>
            <input
              type='number'
              value={formData.experienceYears || ''}
              onChange={(event) => {
                handleInputChange('experienceYears', Number(event.target.value));
              }}
              className={`w-full rounded-lg border bg-white p-3 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 ${
                errors.experienceYears
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder='Years of experience'
              min='0'
              max='50'
            />
            {errors.experienceYears && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>
                {errors.experienceYears}
              </p>
            )}
          </div>

          {/* Profession */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Profession *
            </label>
            <select
              value={formData.profession}
              onChange={(event) => {
                handleInputChange('profession', event.target.value);
              }}
              className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            >
              <option value='FULL_TIME_FREELANCER'>Full-time Freelancer</option>
              <option value='PART_TIME_FREELANCER'>Part-time Freelancer</option>
              <option value='CONTRACTOR'>Contractor</option>
              <option value='STUDENT'>Student</option>
            </select>
          </div>

          {/* Status Availability */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Availability Status *
            </label>
            <select
              value={formData.statusAviability}
              onChange={(event) => {
                handleInputChange('statusAviability', event.target.value);
              }}
              className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
            >
              <option value='OPEN_FOR_PROJECTS'>Open for Projects</option>
              <option value='OPEN_FOR_PART_TIME'>Open for Part-time</option>
              <option value='NOT_AVAILABLE'>Not Available</option>
            </select>
          </div>
        </div>

        {/* Skills - Searchable Select */}
        <div>
          <label className='mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300'>
            Skills * (Select at least 3 skills)
          </label>

          {/* Selected Skills Display */}
          {formData.skills.length > 0 && (
            <div className='mb-3'>
              <div className='flex flex-wrap gap-2'>
                {formData.skills.map((skill) => (
                  <span
                    key={skill.id}
                    className='inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  >
                    {skill.key}
                    <button
                      type='button'
                      onClick={() => {
                        handleSkillRemove(skill.id);
                      }}
                      className='ml-1 hover:text-blue-900 dark:hover:text-blue-100'
                    >
                      <X className='h-3 w-3' />
                    </button>
                  </span>
                ))}
              </div>
              <p className='mt-2 text-sm text-gray-600 dark:text-gray-400'>
                Selected: {formData.skills.length} skills
              </p>
            </div>
          )}

          {/* Skills Dropdown */}
          <div ref={dropdownReference} className='relative'>
            <div
              className={`w-full rounded-lg border bg-white transition-colors dark:bg-gray-800 ${
                errors.skills
                  ? 'border-red-300 dark:border-red-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {/* Search Input */}
              <div className='relative'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <input
                  type='text'
                  value={skillSearch}
                  onChange={(event) => {
                    setSkillSearch(event.target.value);
                  }}
                  onFocus={() => {
                    setIsSkillsDropdownOpen(true);
                  }}
                  placeholder='Search and select skills...'
                  className='w-full rounded-lg border-0 bg-transparent py-3 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400'
                />
                <ChevronDown
                  className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-transform ${
                    isSkillsDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </div>

              {/* Dropdown */}
              {isSkillsDropdownOpen && (
                <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'>
                  {filteredSkills.length > 0 ? (
                    <div className='py-1'>
                      {filteredSkills
                        .filter((skill) => !formData.skills.some((s) => s.id === skill.id))
                        .map((skill) => (
                          <button
                            key={skill.id}
                            type='button'
                            onClick={() => {
                              handleSkillSelect(skill.id);
                            }}
                            className='w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700'
                          >
                            <div className='flex flex-col'>
                              <span>{skill.key}</span>
                            </div>
                          </button>
                        ))}

                      {filteredSkills.filter(
                        (skill) => !formData.skills.some((s) => s.id === skill.id)
                      ).length === 0 && (
                        <div className='px-4 py-2 text-sm text-gray-500 dark:text-gray-400'>
                          All matching skills already selected
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                      <Search className='mx-auto mb-2 h-6 w-6 opacity-50' />
                      <p className='text-sm'>No skills found matching &quot;{skillSearch}&quot;</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {errors.skills && (
            <p className='mt-2 text-sm text-red-600 dark:text-red-400'>{errors.skills}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700'>
        <button
          onClick={onPrevious}
          className='inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Back</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className='inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className='h-4 w-4' />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
