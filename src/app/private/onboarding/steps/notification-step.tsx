'use client';

import React, { useEffect, useState } from 'react';

import { ArrowLeft, Bell, Check, Globe, Loader2, Mail } from 'lucide-react';

interface NotificationStepProps {
  onComplete: () => void;
  onPrevious: () => void;
  isLoading: boolean;
}

interface NotificationPreference {
  id: string;
  type: string;
  title: string;
  description: string;
  preferences: ('EMAIL' | 'WEB')[];
}

export default function NotificationStep({
  onComplete,
  onPrevious,
  isLoading
}: NotificationStepProps) {
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreference[]>(
    []
  );
  const [loadingPreferences, setLoadingPreferences] = useState(true);
  const [savingPreferences, setSavingPreferences] = useState(false);

  // Fetch notification preferences on component mount
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      setLoadingPreferences(true);
      try {
        // Replace with actual API call
        // const response = await fetch('/notification/preferences');
        // const data = await response.json();

        // Mock data for now
        const mockPreferences: NotificationPreference[] = [
          {
            id: '4a9a739d-a3cf-4b87-a8de-a98057a635b2',
            type: 'JOB_RECOMMENDATION',
            title: 'Job Recommendations',
            description: 'Get notified when new jobs match your skills and preferences',
            preferences: ['EMAIL', 'WEB']
          },
          {
            id: '5b8b648e-b4d0-5c98-b9ef-b09168b746c3',
            type: 'APPLICATION_STATUS',
            title: 'Application Updates',
            description: 'Receive updates when clients respond to your applications',
            preferences: ['EMAIL', 'WEB']
          },
          {
            id: '6c9c759f-c5e1-6da9-caf0-c1a279c857d4',
            type: 'MESSAGE_RECEIVED',
            title: 'New Messages',
            description: 'Get notified when you receive new messages from clients',
            preferences: ['EMAIL']
          },
          {
            id: '7d0d86a0-d6f2-7eba-db01-d2b38ad968e5',
            type: 'PROJECT_INVITATION',
            title: 'Project Invitations',
            description: 'Receive notifications when clients invite you to projects',
            preferences: ['EMAIL', 'WEB']
          },
          {
            id: '8e1e97b1-e703-8fcb-ec12-e3c49bea79f6',
            type: 'PAYMENT_UPDATES',
            title: 'Payment Notifications',
            description: 'Get updates about payments and invoice status',
            preferences: ['EMAIL']
          }
        ];

        await new Promise((resolve) => setTimeout(resolve, 800)); // Mock loading delay
        setNotificationPreferences(mockPreferences);
      } catch (error) {
        console.error('Error fetching notification preferences:', error);
      } finally {
        setLoadingPreferences(false);
      }
    };

    fetchNotificationPreferences();
  }, []);

  const handleTogglePreference = async (id: string, type: 'EMAIL' | 'WEB') => {
    // Optimistically update UI
    setNotificationPreferences((prev) =>
      prev.map((pref) => {
        if (pref.id === id) {
          const hasPreference = pref.preferences.includes(type);
          return {
            ...pref,
            preferences: hasPreference
              ? pref.preferences.filter((p) => p !== type)
              : [...pref.preferences, type]
          };
        }
        return pref;
      })
    );

    try {
      // Get updated preference
      const updatedPref = notificationPreferences.find((p) => p.id === id);
      if (!updatedPref) return;

      const hasPreference = updatedPref.preferences.includes(type);
      const newPreferences = hasPreference
        ? updatedPref.preferences.filter((p) => p !== type)
        : [...updatedPref.preferences, type];

      // Replace with actual API call
      // await fetch(`/notification/preferences/${id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     type: updatedPref.type,
      //     preferences: newPreferences
      //   })
      // });

      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error('Error updating notification preference:', error);
      // Revert optimistic update on error
      setNotificationPreferences((prev) =>
        prev.map((pref) => {
          if (pref.id === id) {
            const hasPreference = !pref.preferences.includes(type);
            return {
              ...pref,
              preferences: hasPreference
                ? pref.preferences.filter((p) => p !== type)
                : [...pref.preferences, type]
            };
          }
          return pref;
        })
      );
    }
  };

  const handleComplete = async () => {
    setSavingPreferences(true);
    try {
      // Save all notification preferences
      // In a real implementation, you might batch these updates
      // or they might already be saved individually in handleTogglePreference

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Mock save delay

      await onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setSavingPreferences(false);
    }
  };

  return (
    <div className='rounded-lg border bg-white p-8 shadow-sm'>
      <div className='mb-8'>
        <h2 className='mb-2 text-2xl font-bold text-gray-900'>Notification preferences</h2>
        <p className='text-gray-600'>
          Choose how you'd like to be notified about important updates. You can change these
          settings later.
        </p>
      </div>

      {loadingPreferences ? (
        <div className='flex items-center justify-center py-12'>
          <div className='text-center'>
            <Loader2 className='mx-auto mb-4 h-8 w-8 animate-spin text-blue-600' />
            <p className='text-gray-600'>Loading notification preferences...</p>
          </div>
        </div>
      ) : (
        <div className='space-y-6'>
          <div className='rounded-lg bg-gray-50 p-4'>
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-2'>
                <Mail className='h-5 w-5 text-gray-600' />
                <span className='text-sm font-medium text-gray-700'>Email</span>
              </div>
              <div className='flex items-center space-x-2'>
                <Globe className='h-5 w-5 text-gray-600' />
                <span className='text-sm font-medium text-gray-700'>Web</span>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            {notificationPreferences.map((preference) => (
              <div key={preference.id} className='rounded-lg border border-gray-200 p-6'>
                <div className='flex items-start justify-between'>
                  <div className='flex-1'>
                    <div className='mb-2 flex items-center space-x-2'>
                      <Bell className='h-5 w-5 text-gray-600' />
                      <h3 className='text-lg font-medium text-gray-900'>{preference.title}</h3>
                    </div>
                    <p className='mb-4 text-gray-600'>{preference.description}</p>

                    <div className='flex items-center space-x-6'>
                      {/* Email Toggle */}
                      <div className='flex items-center space-x-3'>
                        <button
                          onClick={() => handleTogglePreference(preference.id, 'EMAIL')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                            preference.preferences.includes('EMAIL') ? 'bg-blue-600' : 'bg-gray-200'
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
                          <Mail className='h-4 w-4 text-gray-500' />
                          <span className='text-sm text-gray-700'>Email</span>
                        </div>
                      </div>

                      {/* Web Toggle */}
                      <div className='flex items-center space-x-3'>
                        <button
                          onClick={() => handleTogglePreference(preference.id, 'WEB')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
                            preference.preferences.includes('WEB') ? 'bg-blue-600' : 'bg-gray-200'
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
                          <Globe className='h-4 w-4 text-gray-500' />
                          <span className='text-sm text-gray-700'>Web</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className='rounded-lg border border-blue-200 bg-blue-50 p-4'>
            <div className='flex items-center space-x-2'>
              <Check className='h-5 w-5 text-blue-600' />
              <p className='text-sm text-blue-700'>
                You're almost done! Your notification preferences will be saved.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className='mt-8 flex items-center justify-between border-t pt-6'>
        <button
          onClick={onPrevious}
          className='inline-flex items-center space-x-2 text-gray-600 transition-colors hover:text-gray-800'
        >
          <ArrowLeft className='h-4 w-4' />
          <span>Back</span>
        </button>

        <button
          onClick={handleComplete}
          disabled={isLoading || savingPreferences || loadingPreferences}
          className='inline-flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50'
        >
          {isLoading || savingPreferences ? (
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
