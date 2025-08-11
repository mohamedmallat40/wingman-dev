'use client';

import { useEffect, useState } from 'react';

import type { BroadcastPreferences, Topic } from '../types';

import { BROADCAST_CONSTANTS } from '../constants';

export const useBroadcastPreferences = () => {
  const [preferences, setPreferences] = useState<BroadcastPreferences>({
    selectedTopics: [],
    isFirstTime: true,
    lastUpdated: new Date().toISOString()
  });

  const [isLoaded, setIsLoaded] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(BROADCAST_CONSTANTS.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as BroadcastPreferences;
        setPreferences(parsed);
      }
    } catch (error) {
      console.error('Failed to load broadcast preferences:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save preferences to localStorage whenever they change
  const savePreferences = (newPreferences: Partial<BroadcastPreferences>) => {
    const updated = {
      ...preferences,
      ...newPreferences,
      lastUpdated: new Date().toISOString()
    };

    setPreferences(updated);

    try {
      localStorage.setItem(BROADCAST_CONSTANTS.STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save broadcast preferences:', error);
    }
  };

  const completeOnboarding = (selectedTopics: Topic[]) => {
    savePreferences({
      selectedTopics,
      isFirstTime: false
    });
  };

  const updateTopics = (selectedTopics: Topic[]) => {
    savePreferences({ selectedTopics });
  };

  const resetPreferences = () => {
    const defaultPreferences: BroadcastPreferences = {
      selectedTopics: [],
      isFirstTime: true,
      lastUpdated: new Date().toISOString()
    };

    setPreferences(defaultPreferences);

    try {
      localStorage.removeItem(BROADCAST_CONSTANTS.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset broadcast preferences:', error);
    }
  };

  return {
    preferences,
    isLoaded,
    completeOnboarding,
    updateTopics,
    resetPreferences
  };
};
