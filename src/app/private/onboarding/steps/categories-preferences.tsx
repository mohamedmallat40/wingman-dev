'use client';

import React, { useEffect, useState } from 'react';

import { IUserProfile } from '@root/modules/profile/types';
import { ArrowLeft, ArrowRight, Bell, Check, Globe, Loader2, Mail, Search } from 'lucide-react';

import wingManApi from '@/lib/axios';

// Define notification types
const NOTIFICATION_TYPES = {
  NEW_OPPORTUNITIES: {
    title: 'New Opportunities',
    description: 'Get notified when new job opportunities match your profile'
  },
  APPLICATION_UPDATES: {
    title: 'Application Updates',
    description: 'Receive updates on your job applications'
  },
  MESSAGES: {
    title: 'Messages',
    description: 'Get notified when you receive new messages'
  },
  WEEKLY_DIGEST: {
    title: 'Weekly Digest',
    description: 'Receive a weekly summary of your activity'
  }
};

interface CategoriesPreferencesProperties {
  onComplete: () => void;
  onPrevious: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  userData?: IUserProfile;
  setUserData: (data: IUserProfile) => void;
}

interface Category {
  id: string;
  label: string;
  value: string | null;
}

interface NotificationPreference {
  id: string;
  type: string;
  preferences: ('EMAIL' | 'WEB')[];
}

export default function CategoriesPreferencesStep({
  onComplete,
  onPrevious,
  isLoading,
  setIsLoading,
  userData,
  setUserData
}: Readonly<CategoriesPreferencesProperties>) {
  const [currentStep, setCurrentStep] = useState<'categories' | 'notifications'>('categories');

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string>('');

  // Notifications state
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>(
    []
  );
  const [loadingPreferences, setLoadingPreferences] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await wingManApi.get('/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();

    setSelectedCategories(userData?.categories.map((category) => category.id) || []);
  }, []);

  // Fetch notification preferences when moving to notifications step
  useEffect(() => {
    if (currentStep === 'notifications') {
      const fetchNotificationPreferences = async () => {
        setLoadingPreferences(true);
        try {
          const response = await wingManApi.get('/notification/preferences');
          setNotificationPreferences(response.data);
        } catch (error) {
          console.error('Error fetching notification preferences:', error);
        } finally {
          setLoadingPreferences(false);
        }
      };

      fetchNotificationPreferences();
    }
  }, [currentStep]);

  const handleCategoryToggle = (categoryId: string) => {
    setCategoryError(''); // Clear error when user makes a selection
    setSelectedCategories((previous) =>
      previous.includes(categoryId)
        ? previous.filter((id) => id !== categoryId)
        : [...previous, categoryId]
    );
  };

  const handleCategoriesNext = async () => {
    // Validate at least one category is selected
    if (selectedCategories.length === 0) {
      setCategoryError('Please select at least one category to continue.');
      return;
    }

    setIsLoading(true);
    setCategoryError('');

    await wingManApi.patch('/users/me', {
      categories: selectedCategories
    });
    setIsLoading(false);
    setCurrentStep('notifications');
  };

  const handleTogglePreference = async (id: string, type: 'EMAIL' | 'WEB') => {
    // Find current preference
    const currentPref = notificationPreferences.find((p) => p.id === id);
    if (!currentPref) return;

    const hasPreference = currentPref.preferences.includes(type);
    const newPreferences = hasPreference
      ? currentPref.preferences.filter((p) => p !== type)
      : [...currentPref.preferences, type];

    // Optimistically update UI
    setNotificationPreferences((previous) =>
      previous.map((pref) => (pref.id === id ? { ...pref, preferences: newPreferences } : pref))
    );

    try {
      await wingManApi.patch('/notification/preferences', {
        type: currentPref.type,
        preferences: newPreferences
      });
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // Revert optimistic update on error
      setNotificationPreferences((previous) =>
        previous.map((pref) =>
          pref.id === id ? { ...pref, preferences: currentPref.preferences } : pref
        )
      );
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay for UX
      onComplete();
    } catch (error) {
      console.error('Error completing setup:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 'categories') {
    return (
      <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
        <div className='mb-8'>
          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
            Choose your categories
          </h2>
          <p className='text-gray-600 dark:text-gray-300'>
            Select the categories that best match your expertise. This helps us show you relevant
            opportunities.{' '}
            <span className='font-medium text-gray-900 dark:text-white'>
              You must select at least one category.
            </span>
          </p>
        </div>

        {loadingCategories ? (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-blue-600' />
              <p className='text-gray-600 dark:text-gray-300'>Loading categories...</p>
            </div>
          </div>
        ) : (
          <div className='space-y-6'>
            {/* Error Message */}
            {categoryError && (
              <div className='rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-400 dark:bg-red-900/30'>
                <p className='text-sm text-red-700 dark:text-red-300'>{categoryError}</p>
              </div>
            )}

            {/* Selected Count */}
            {selectedCategories.length > 0 && (
              <div className='rounded-lg border border-blue-200 bg-blue-50 p-3 dark:border-blue-400 dark:bg-blue-900/30'>
                <p className='text-sm text-blue-700 dark:text-blue-300'>
                  {selectedCategories.length}{' '}
                  {selectedCategories.length === 1 ? 'category' : 'categories'} selected
                </p>
              </div>
            )}

            {/* Categories Grid */}
            <div className='grid max-h-96 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2'>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => {
                      handleCategoryToggle(category.id);
                    }}
                    className={`relative cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm ${
                      selectedCategories.includes(category.id)
                        ? 'border-blue-300 bg-blue-50 dark:border-blue-400 dark:bg-blue-900/30'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className='flex items-start space-x-3'>
                      <div
                        className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded border ${
                          selectedCategories.includes(category.id)
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-500'
                        }`}
                      >
                        {selectedCategories.includes(category.id) && (
                          <Check className='h-4 w-4 text-white' />
                        )}
                      </div>

                      <div className='min-w-0 flex-1'>
                        <h3
                          className={`font-medium ${
                            selectedCategories.includes(category.id)
                              ? 'text-blue-900 dark:text-blue-300'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {category.label}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='col-span-2 py-8 text-center'>
                  <p className='text-gray-500 dark:text-gray-400'>No categories found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className='mt-8 flex items-center justify-between border-t border-gray-300 pt-6 dark:border-gray-600'>
          <button
            onClick={onPrevious}
            className='inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
          >
            <ArrowLeft className='h-4 w-4' />
            <span>Back</span>
          </button>

          <button
            onClick={handleCategoriesNext}
            disabled={isLoading || loadingCategories || selectedCategories.length === 0}
            className='inline-flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
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

  // Notifications Step
  return (
    <div className='rounded-lg border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800'>
      <div className='mb-8'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
          Notification preferences
        </h2>
        <p className='text-gray-600 dark:text-gray-300'>
          Choose how you'd like to be notified about important updates. You can change these
          settings later.
        </p>
      </div>

      {loadingPreferences ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-blue-600' />
            <p className='text-gray-600 dark:text-gray-300'>Loading notification preferences...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Mail className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>Email</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Globe className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                <span className='text-sm font-medium text-gray-700 dark:text-gray-200'>Web</span>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {notificationPreferences.map((preference) => {
              const typeInfo = NOTIFICATION_TYPES[
                preference.type as keyof typeof NOTIFICATION_TYPES
              ] || {
                title: preference.type
                  .replace('_', ' ')
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                description: `Manage ${preference.type.toLowerCase().replace('_', ' ')} notifications`
              };

              return (
                <div
                  key={preference.id}
                  className='rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-600 dark:bg-gray-700'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='mb-2 flex items-center space-x-2'>
                        <Bell className='h-5 w-5 text-gray-600 dark:text-gray-300' />
                        <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                          {typeInfo.title}
                        </h3>
                      </div>
                      <p className='mb-4 text-gray-600 dark:text-gray-300'>
                        {typeInfo.description}
                      </p>

                      <div className='flex items-center space-x-6'>
                        {/* Email Toggle */}
                        <div className='flex items-center space-x-3'>
                          <button
                            onClick={() => handleTogglePreference(preference.id, 'EMAIL')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                              preference.preferences.includes('EMAIL')
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preference.preferences.includes('EMAIL')
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div className='flex items-center space-x-1'>
                            <Mail className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                            <span className='text-sm text-gray-700 dark:text-gray-200'>Email</span>
                          </div>
                        </div>

                        {/* Web Toggle */}
                        <div className='flex items-center space-x-3'>
                          <button
                            onClick={() => handleTogglePreference(preference.id, 'WEB')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                              preference.preferences.includes('WEB')
                                ? 'bg-blue-600'
                                : 'bg-gray-200 dark:bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                preference.preferences.includes('WEB')
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <div className='flex items-center space-x-1'>
                            <Globe className='h-4 w-4 text-gray-500 dark:text-gray-400' />
                            <span className='text-sm text-gray-700 dark:text-gray-200'>Web</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-400 dark:bg-blue-900/30'>
            <div className='flex items-center space-x-2'>
              <Check className='h-5 w-5 text-blue-600' />
              <p className='text-sm text-blue-700 dark:text-blue-300'>
                You're almost done! Your notification preferences will be saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className='mt-8 flex items-center justify-between border-t border-gray-300 pt-6 dark:border-gray-600'>
        <button
          onClick={() => {
            setCurrentStep('categories');
          }}
          className='inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Back</span>
        </button>

        <button
          onClick={handleComplete}
          disabled={isLoading || loadingPreferences}
          className='inline-flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              <span>Completing Setup...</span>
            </>
          ) : (
            <>
              <Check className='h-4 w-4' />
              <span>Complete Setup</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
