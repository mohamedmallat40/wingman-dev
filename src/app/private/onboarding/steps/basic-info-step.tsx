'use client';

import React, { useEffect, useRef, useState } from 'react';

import { type IUserProfile } from '@root/modules/profile/types';
// Country utilities
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import frLocale from 'i18n-iso-countries/langs/fr.json';
import nlLocale from 'i18n-iso-countries/langs/nl.json';
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Clock,
  Globe,
  Link,
  Loader2,
  Search,
  User,
  X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import wingManApi from '@/lib/axios';

import { type Skill } from '../../skills/types';

countries.registerLocale(enLocale);
countries.registerLocale(frLocale);
countries.registerLocale(nlLocale);

interface BasicInfoStepProperties {
  onNext: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userData: IUserProfile | null;
}

interface TimeZone {
  id: string;
  name: string;
  description: string;
  utcOffset: string;
}

interface Country {
  code: string;
  name: string;
  flag: string;
}

const getFallbackCountries = (locale: 'en' | 'fr' | 'nl'): Country[] => {
  const fallbackCountries = [
    { code: 'us', name: 'United States', flag: 'https://flagcdn.com/w40/us.png' },
    { code: 'ca', name: 'Canada', flag: 'https://flagcdn.com/w40/ca.png' },
    { code: 'gb', name: 'United Kingdom', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'de', name: 'Germany', flag: 'https://flagcdn.com/w40/de.png' },
    { code: 'fr', name: 'France', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'it', name: 'Italy', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'es', name: 'Spain', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'nl', name: 'Netherlands', flag: 'https://flagcdn.com/w40/nl.png' },
    { code: 'be', name: 'Belgium', flag: 'https://flagcdn.com/w40/be.png' },
    { code: 'au', name: 'Australia', flag: 'https://flagcdn.com/w40/au.png' }
  ];
  return fallbackCountries;
};

const getCountryList = (locale: 'en' | 'fr' | 'nl') => {
  try {
    const names = countries.getNames(locale, { select: 'official' });

    if (!names || Object.keys(names).length === 0) {
      console.warn('No countries loaded from i18n, using fallback');
      return getFallbackCountries(locale);
    }

    return Object.entries(names)
      .map(([code, name]) => ({
        code,
        name,
        flag: `https://flagcdn.com/w40/${code.toLowerCase()}.png`
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error loading countries:', error);
    return getFallbackCountries(locale);
  }
};

// Enhanced validation schema with dynamic amount validation
const createBasicInfoSchema = (paymentType: string, t: any) => {
  const baseSchema = {
    aboutMe: z
      .string()
      .min(10, t('setup.basicInfo.validation.aboutMeMinLength'))
      .max(500, t('setup.basicInfo.validation.aboutMeMaxLength')),
    experienceYears: z
      .number()
      .min(0, t('setup.basicInfo.validation.experienceYearsMin'))
      .max(50, t('setup.basicInfo.validation.experienceYearsMax')),
    paymentType: z.enum(['HOURLY_BASED', 'DAILY_BASED', 'PROJECT']),
    profession: z.enum(['FULL_TIME_FREELANCER', 'PART_TIME_FREELANCER', 'CONTRACTOR', 'STUDENT']),
    skills: z
      .array(
        z.object({
          id: z.string(),
          key: z.string()
        })
      )
      .min(3, t('setup.basicInfo.validation.skillsMinimum')),
    statusAviability: z.enum(['OPEN_FOR_PART_TIME', 'NOT_AVAILABLE', 'OPEN_FOR_PROJECTS']),
    workingTime: z.enum(['FULL_TIME', 'PART_TIME']),
    // Optional fields
    timeZone: z.string().optional(),
    country: z.string().optional(),
    region: z.string().optional(),
    countryCode: z.string().optional(),
    linkedinProfile: z.string().optional(),
    profileWebsite: z.string().optional()
  };

  // Dynamic amount validation based on payment type
  if (paymentType === 'HOURLY_BASED') {
    return z.object({
      ...baseSchema,
      amount: z.number().min(5, t('setup.basicInfo.validation.hourlyRateMinimum'))
    });
  } else if (paymentType === 'DAILY_BASED') {
    return z.object({
      ...baseSchema,
      amount: z.number().min(5, t('setup.basicInfo.validation.dailyRateMinimum'))
    });
  } else {
    return z.object({
      ...baseSchema,
      amount: z.number().optional()
    });
  }
};

type BasicInfoData = {
  aboutMe: string;
  experienceYears: number;
  paymentType: 'HOURLY_BASED' | 'DAILY_BASED' | 'PROJECT';
  profession: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT';
  skills: Skill[];
  statusAviability: 'OPEN_FOR_PART_TIME' | 'NOT_AVAILABLE' | 'OPEN_FOR_PROJECTS';
  workingTime: 'FULL_TIME' | 'PART_TIME';
  amount?: number;
  // Optional fields
  timeZone?: string;
  country?: string;
  region?: string;
  countryCode?: string;
  linkedinProfile?: string;
  profileWebsite?: string;
};

export default function BasicInfoStep({
  onNext,
  onPrevious,
  isLoading,
  setIsLoading,
  userData
}: Readonly<BasicInfoStepProperties>) {
  const t = useTranslations();

  const [formData, setFormData] = useState<IUserProfile>({
    aboutMe: '',
    experienceYears: 0,
    paymentType: 'HOURLY_BASED',
    profession: 'FULL_TIME_FREELANCER',
    skills: [],
    statusAviability: 'OPEN_FOR_PROJECTS',
    workingTime: 'FULL_TIME',
    amount: 0,
    timeZone: '',
    country: '',
    region: '',
    countryCode: '',
    linkedinProfile: '',
    profileWebsite: ''
  });

  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [filteredSkills, setFilteredSkills] = useState<Skill[]>([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false);

  // New state for optional fields
  const [timeZones, setTimeZones] = useState<TimeZone[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredTimeZones, setFilteredTimeZones] = useState<TimeZone[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [timeZoneSearch, setTimeZoneSearch] = useState('');
  const [countrySearch, setCountrySearch] = useState('');
  const [isTimeZoneDropdownOpen, setIsTimeZoneDropdownOpen] = useState(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Refs for dropdowns
  const skillsDropdownRef = useRef<HTMLDivElement>(null);
  const timeZoneDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Get current locale (fallback to 'en' if not available)
  const getCurrentLocale = (): 'en' | 'fr' | 'nl' => {
    // This should ideally come from your i18n context
    // For now, defaulting to 'en'
    return 'en';
  };

  // Fetch user data and initial data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsDataLoading(true);
      try {
        // Fetch skills and time zones in parallel
        const [skillsResponse, timeZonesResponse] = await Promise.all([
          wingManApi.get('/skills'),
          wingManApi.get('/time-zones')
        ]);

        let skillsData: Skill[] = [];
        if (skillsResponse.status >= 200 && skillsResponse.status < 300) {
          skillsData = skillsResponse.data;
          setAvailableSkills(skillsData);
          setFilteredSkills(skillsData);
        }

        let timeZonesData: TimeZone[] = [];
        if (timeZonesResponse.status >= 200 && timeZonesResponse.status < 300) {
          timeZonesData = timeZonesResponse.data;
          setTimeZones(timeZonesData);
          setFilteredTimeZones(timeZonesData);
        }

        // Get countries list
        const locale = getCurrentLocale();
        const countriesData = getCountryList(locale);
        setCountries(countriesData);
        setFilteredCountries(countriesData);

        // Convert user skills to complete skill objects
        const userSkillObjects =
          userData?.skills?.map((userSkill) => {
            if (typeof userSkill === 'object' && userSkill.id && userSkill.key) {
              return userSkill;
            }
            const matchingSkill = skillsData.find(
              (skill) => skill.id == userSkill.id || skill.key === userSkill.key
            );
            return matchingSkill ?? { id: userSkill, key: userSkill };
          }) || [];

        setFormData((previous) => ({
          ...previous,
          aboutMe: userData?.aboutMe ?? '',
          experienceYears: userData?.experienceYears ?? 0,
          paymentType: (userData?.paymentType as any) ?? 'HOURLY_BASED',
          profession: (userData?.profession as any) ?? 'FULL_TIME_FREELANCER',
          skills: userSkillObjects,
          statusAviability: (userData?.statusAviability as any) ?? 'OPEN_FOR_PROJECTS',
          workingTime: (userData?.workingTime as any) ?? 'FULL_TIME',
          amount: userData?.amount ?? 0,
          timeZone: userData?.timeZone ?? '',
          country: userData?.country ?? '',
          region: userData?.region ?? '',
          countryCode: userData?.countryCode ?? '',
          linkedinProfile: userData?.linkedinProfile ?? '',
          profileWebsite: userData?.profileWebsite ?? ''
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [userData]);

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

  // Filter time zones based on search
  useEffect(() => {
    if (timeZoneSearch.trim()) {
      const filtered = timeZones.filter(
        (tz) =>
          tz.name.toLowerCase().includes(timeZoneSearch.toLowerCase()) ||
          tz.description.toLowerCase().includes(timeZoneSearch.toLowerCase())
      );
      setFilteredTimeZones(filtered);
    } else {
      setFilteredTimeZones(timeZones);
    }
  }, [timeZoneSearch, timeZones]);

  // Filter countries based on search
  useEffect(() => {
    if (countrySearch.trim()) {
      const filtered = countries.filter((country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [countrySearch, countries]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target as Node)) {
        setIsSkillsDropdownOpen(false);
      }
      if (
        timeZoneDropdownRef.current &&
        !timeZoneDropdownRef.current.contains(event.target as Node)
      ) {
        setIsTimeZoneDropdownOpen(false);
      }
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
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

      // Handle payment type changes - set amount appropriately
      if (field === 'paymentType') {
        switch (value) {
          case 'HOURLY_BASED':
          case 'DAILY_BASED': {
            newData.amount = previous.amount || 0;
            break;
          }
          case 'PROJECT': {
            newData.amount = 0;
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

  const handleTimeZoneSelect = (timeZoneId: string) => {
    const timeZone = timeZones.find((tz) => tz.id === timeZoneId);
    if (timeZone) {
      handleInputChange('timeZone', timeZoneId);
      setTimeZoneSearch(`${timeZone.name} (${timeZone.utcOffset})`);
    }
    setIsTimeZoneDropdownOpen(false);
  };

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      handleInputChange('country', country.name);
      handleInputChange('region', country.name);
      handleInputChange('countryCode', country.code);
      setCountrySearch(country.name);
    }
    setIsCountryDropdownOpen(false);
  };

  const validateForm = () => {
    try {
      const schema = createBasicInfoSchema(formData.paymentType, t);
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
      const patchData: any = {
        aboutMe: formData.aboutMe,
        experienceYears: formData.experienceYears,
        paymentType: formData.paymentType,
        profession: formData.profession,
        skills: formData.skills.map((skill) => skill.id),
        statusAviability: formData.statusAviability,
        workingTime: formData.workingTime,
        currency: 'EUR'
      };

      // Add amount based on payment type
      if (formData.paymentType === 'HOURLY_BASED' || formData.paymentType === 'DAILY_BASED') {
        patchData.amount = formData.amount;
      }

      // Add optional fields if they exist
      if (formData.timeZone) patchData.timeZone = formData.timeZone;
      if (formData.country) patchData.country = formData.country;
      if (formData.region) patchData.region = formData.region;
      if (formData.countryCode) patchData.countryCode = formData.countryCode;
      if (formData.linkedinProfile) patchData.linkedinProfile = formData.linkedinProfile;
      if (formData.profileWebsite) patchData.profileWebsite = formData.profileWebsite;

      const response = await wingManApi.patch('/users/me', patchData);
      if (response.status >= 200 && response.status < 300) {
        onNext();
      }
    } catch (error) {
      console.error('Error updating user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRateLabel = () => {
    switch (formData.paymentType) {
      case 'HOURLY_BASED': {
        return t('setup.basicInfo.fields.hourlyRate.label');
      }
      case 'DAILY_BASED': {
        return t('setup.basicInfo.fields.dailyRate.label');
      }
      case 'PROJECT': {
        return t('setup.basicInfo.fields.projectRate.label');
      }
      default: {
        return t('setup.basicInfo.fields.rate.label');
      }
    }
  };

  const getRateValue = () => {
    if (formData.paymentType === 'PROJECT') return '';
    return formData.amount || '';
  };

  const handleRateChange = (value: number) => {
    handleInputChange('amount', value);
  };

  const getRateError = () => {
    return errors.amount;
  };

  const getRatePlaceholder = () => {
    return formData.paymentType === 'PROJECT'
      ? t('setup.basicInfo.fields.rate.placeholderNotApplicable')
      : t('setup.basicInfo.fields.rate.placeholder');
  };

  const getSelectedTimeZoneDisplay = () => {
    if (!formData.timeZone) return '';
    const timeZone = timeZones.find((tz) => tz.id === formData.timeZone);
    return timeZone ? `${timeZone.name} (${timeZone.utcOffset})` : '';
  };

  const getSelectedCountryDisplay = () => {
    if (!formData.countryCode) return '';
    const country = countries.find((c) => c.code === formData.countryCode);
    return country ? country.name : '';
  };

  if (isDataLoading) {
    return (
      <div className='flex min-h-[400px] items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 dark:text-blue-400' />
          <p className='text-gray-600 dark:text-gray-400'>
            {t('setup.basicInfo.loading.loadingInfo')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-colors dark:border-gray-700 dark:bg-gray-900'>
      <div className='mb-8'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100'>
          {t('setup.basicInfo.title')}
        </h2>
        <p className='text-gray-600 dark:text-gray-400'>{t('setup.basicInfo.description')}</p>
      </div>

      <div className='space-y-8'>
        {/* Required Fields Section */}
        <div className='space-y-6'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
            Required Information
          </h3>

          {/* About Me */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              {t('setup.basicInfo.fields.aboutMe.label')} *
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
              placeholder={t('setup.basicInfo.fields.aboutMe.placeholder')}
            />
            {errors.aboutMe && (
              <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.aboutMe}</p>
            )}
            <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
              {t('setup.basicInfo.fields.aboutMe.characterCount', {
                current: formData.aboutMe.length,
                max: 500
              })}
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Payment Type */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('setup.basicInfo.fields.paymentType.label')} *
              </label>
              <select
                value={formData.paymentType}
                onChange={(event) => {
                  handleInputChange('paymentType', event.target.value);
                }}
                className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
              >
                <option value='HOURLY_BASED'>
                  {t('setup.basicInfo.fields.paymentType.options.hourly')}
                </option>
                <option value='DAILY_BASED'>
                  {t('setup.basicInfo.fields.paymentType.options.daily')}
                </option>
                <option value='PROJECT'>
                  {t('setup.basicInfo.fields.paymentType.options.project')}
                </option>
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
                placeholder={getRatePlaceholder()}
                min='5'
              />
              {getRateError() && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{getRateError()}</p>
              )}
              {formData.paymentType !== 'PROJECT' && (
                <p className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
                  {t('setup.basicInfo.fields.rate.minimumNote')}
                </p>
              )}
            </div>

            {/* Working Time */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('setup.basicInfo.fields.workingTime.label')} *
              </label>
              <select
                value={formData.workingTime}
                onChange={(event) => {
                  handleInputChange('workingTime', event.target.value);
                }}
                className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
              >
                <option value='FULL_TIME'>
                  {t('setup.basicInfo.fields.workingTime.options.fullTime')}
                </option>
                <option value='PART_TIME'>
                  {t('setup.basicInfo.fields.workingTime.options.partTime')}
                </option>
              </select>
              {errors.workingTime && (
                <p className='mt-1 text-sm text-red-600 dark:text-red-400'>{errors.workingTime}</p>
              )}
            </div>

            {/* Experience Years */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('setup.basicInfo.fields.experienceYears.label')} *
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
                placeholder={t('setup.basicInfo.fields.experienceYears.placeholder')}
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
                {t('setup.basicInfo.fields.profession.label')} *
              </label>
              <select
                value={formData.profession}
                onChange={(event) => {
                  handleInputChange('profession', event.target.value);
                }}
                className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
              >
                <option value='FULL_TIME_FREELANCER'>
                  {t('setup.basicInfo.fields.profession.options.fullTimeFreelancer')}
                </option>
                <option value='PART_TIME_FREELANCER'>
                  {t('setup.basicInfo.fields.profession.options.partTimeFreelancer')}
                </option>
                <option value='CONTRACTOR'>
                  {t('setup.basicInfo.fields.profession.options.contractor')}
                </option>
                <option value='STUDENT'>
                  {t('setup.basicInfo.fields.profession.options.student')}
                </option>
              </select>
            </div>

            {/* Status Availability */}
            <div>
              <label className='mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300'>
                {t('setup.basicInfo.fields.availabilityStatus.label')} *
              </label>
              <select
                value={formData.statusAviability}
                onChange={(event) => {
                  handleInputChange('statusAviability', event.target.value);
                }}
                className='w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100'
              >
                <option value='OPEN_FOR_PROJECTS'>
                  {t('setup.basicInfo.fields.availabilityStatus.options.openForProjects')}
                </option>
                <option value='OPEN_FOR_PART_TIME'>
                  {t('setup.basicInfo.fields.availabilityStatus.options.openForPartTime')}
                </option>
                <option value='NOT_AVAILABLE'>
                  {t('setup.basicInfo.fields.availabilityStatus.options.notAvailable')}
                </option>
              </select>
            </div>
          </div>

          {/* Skills - Searchable Select */}
          <div>
            <label className='mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300'>
              {t('setup.basicInfo.fields.skills.label')} * (
              {t('setup.basicInfo.fields.skills.minimum')})
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
                  {t('setup.basicInfo.fields.skills.selectedCount', {
                    count: formData.skills.length
                  })}
                </p>
              </div>
            )}

            {/* Skills Dropdown */}
            <div ref={skillsDropdownRef} className='relative'>
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
                    placeholder={t('setup.basicInfo.fields.skills.placeholder')}
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
                            {t('setup.basicInfo.fields.skills.allSelected')}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                        <Search className='mx-auto mb-2 h-6 w-6 opacity-50' />
                        <p className='text-sm'>
                          {t('setup.basicInfo.fields.skills.noSkillsFound', {
                            search: skillSearch
                          })}
                        </p>
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

        {/* Optional Fields Section */}
        <div className='space-y-6 border-t border-gray-200 pt-8 dark:border-gray-700'>
          <div className='mb-4'>
            <h3 className='mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100'>
              Optional Information
            </h3>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              This helps us improve matching with companies or freelancers
            </p>
          </div>

          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            {/* Time Zone */}
            <div>
              <label className='mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300'>
                <Clock className='mr-2 h-4 w-4' />
                My timezone
              </label>
              <div ref={timeZoneDropdownRef} className='relative'>
                <div className='w-full rounded-lg border border-gray-300 bg-white transition-colors dark:border-gray-600 dark:bg-gray-800'>
                  <div className='relative'>
                    <input
                      type='text'
                      value={timeZoneSearch || getSelectedTimeZoneDisplay()}
                      onChange={(event) => {
                        setTimeZoneSearch(event.target.value);
                      }}
                      onFocus={() => {
                        setIsTimeZoneDropdownOpen(true);
                        setTimeZoneSearch('');
                      }}
                      placeholder='Europe/Brussels: Central European Time'
                      className='w-full rounded-lg border-0 bg-transparent py-3 pr-10 pl-3 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400'
                    />
                    <ChevronDown
                      className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-transform ${
                        isTimeZoneDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isTimeZoneDropdownOpen && (
                    <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'>
                      {filteredTimeZones.length > 0 ? (
                        <div className='py-1'>
                          {filteredTimeZones.map((timeZone) => (
                            <button
                              key={timeZone.id}
                              type='button'
                              onClick={() => {
                                handleTimeZoneSelect(timeZone.id);
                              }}
                              className='w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700'
                            >
                              <div className='flex flex-col'>
                                <span className='font-medium'>
                                  {timeZone.name} ({timeZone.utcOffset})
                                </span>
                                <span className='text-xs text-gray-500 dark:text-gray-400'>
                                  {timeZone.description}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                          <Clock className='mx-auto mb-2 h-6 w-6 opacity-50' />
                          <p className='text-sm'>No time zones found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Country */}
            <div>
              <label className='mb-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300'>
                <Globe className='mr-2 h-4 w-4' />
                and live in
              </label>
              <div ref={countryDropdownRef} className='relative'>
                <div className='w-full rounded-lg border border-gray-300 bg-white transition-colors dark:border-gray-600 dark:bg-gray-800'>
                  <div className='relative'>
                    <input
                      type='text'
                      value={countrySearch || getSelectedCountryDisplay()}
                      onChange={(event) => {
                        setCountrySearch(event.target.value);
                      }}
                      onFocus={() => {
                        setIsCountryDropdownOpen(true);
                        setCountrySearch('');
                      }}
                      placeholder='Belgium'
                      className='w-full rounded-lg border-0 bg-transparent py-3 pr-10 pl-3 text-gray-900 placeholder-gray-500 focus:ring-0 focus:outline-none dark:text-gray-100 dark:placeholder-gray-400'
                    />
                    <ChevronDown
                      className={`absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 transform text-gray-400 transition-transform ${
                        isCountryDropdownOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>

                  {isCountryDropdownOpen && (
                    <div className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-600 dark:bg-gray-800'>
                      {filteredCountries.length > 0 ? (
                        <div className='py-1'>
                          {filteredCountries.map((country) => (
                            <button
                              key={country.code}
                              type='button'
                              onClick={() => {
                                handleCountrySelect(country.code);
                              }}
                              className='w-full px-4 py-2 text-left text-sm text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-100 dark:hover:bg-gray-700 dark:focus:bg-gray-700'
                            >
                              <div className='flex items-center space-x-3'>
                                <img
                                  src={country.flag}
                                  alt={`${country.name} flag`}
                                  className='h-5 w-7 rounded object-cover'
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                                <span>{country.name}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className='px-4 py-8 text-center text-gray-500 dark:text-gray-400'>
                          <Globe className='mx-auto mb-2 h-6 w-6 opacity-50' />
                          <p className='text-sm'>No countries found</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div>
            <label className='mb-3 flex items-center text-sm font-medium text-gray-700 dark:text-gray-300'>
              <User className='mr-2 h-4 w-4' />
              You can find me online via
            </label>

            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* LinkedIn Profile */}
              <div>
                <div className='relative'>
                  <Link className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                  <input
                    type='url'
                    value={formData.linkedinProfile || ''}
                    onChange={(event) => {
                      handleInputChange('linkedinProfile', event.target.value);
                    }}
                    placeholder='LinkedIn profile URL'
                    className='w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                  />
                </div>
              </div>

              {/* Profile Website */}
              <div>
                <div className='relative'>
                  <Globe className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                  <input
                    type='url'
                    value={formData.profileWebsite || ''}
                    onChange={(event) => {
                      handleInputChange('profileWebsite', event.target.value);
                    }}
                    placeholder='Personal website or portfolio'
                    className='w-full rounded-lg border border-gray-300 bg-white py-3 pr-3 pl-10 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className='mt-8 flex items-center justify-between border-t border-gray-200 pt-6 dark:border-gray-700'>
        <button
          onClick={onPrevious}
          className='inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>{t('setup.actions.back')}</span>
        </button>

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className='inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>{t('setup.actions.saving')}</span>
            </>
          ) : (
            <>
              <span>{t('setup.actions.continue')}</span>
              <ArrowRight className='h-4 w-4' />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
