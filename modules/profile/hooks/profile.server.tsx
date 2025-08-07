import type { IEducation, IExperience, IReview, IService, IUserProfile } from '@root/modules/profile/types';

import {
  getMyProfile,
  getUserEducation,
  getUserExperience,
  getUserLanguages,
  getUserProfile,
  getUserReviews,
  getUserService
} from '@root/modules/profile/services/profile.service';
import { type ILanguage } from '@root/modules/profile/types';
import { queryOptions } from '@tanstack/react-query';

export const profileOptions = queryOptions({
  queryKey: ['profile'],
  queryFn: getMyProfile
});
export const userProfileOptions = (userId: string) =>
  queryOptions({
    queryKey: ['user-profile', userId],
    queryFn: async (): Promise<{ data: IUserProfile }> => {
      try {
        return await getUserProfile(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });

export const experienceOptions = (userId: string) =>
  queryOptions({
    queryKey: ['experiences', userId],
    queryFn: async (): Promise<{ data: IExperience[] }> => {
      try {
        return await getUserExperience(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });

export const educationOptions = (userId: string) =>
  queryOptions({
    queryKey: ['educations', userId],
    queryFn: async (): Promise<{ data: IEducation[] }> => {
      try {
        return await getUserEducation(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });

export const serviceOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['services', userId],
    queryFn: async (): Promise<{ data: IService[] }> => {
      try {
        return await getUserService(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });
};
export const languageOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['languages', userId],
    queryFn: async (): Promise<{ data: ILanguage[] }> => {
      try {
        return await getUserLanguages(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });
};
export const reviewsOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['reviews', userId],
    queryFn: async (): Promise<{ data: IReview[] }> => {
      try {
        return await getUserReviews(userId);
      } catch (error) {
        console.error(error);
        throw error;
      }
    }
  });
};
