import { user } from '@heroui/theme';
import {
  educationOptions,
  experienceOptions,
  languageOptions,
  profileOptions,
  reviewsOptions,
  serviceOptions,
  userProfileOptions
} from '@root/modules/profile/hooks/profile.server';
import { ILanguage, type IExperience, type IUserProfile } from '@root/modules/profile/types';
import { useQuery } from '@tanstack/react-query';

const useProfile = (userId: string) => {
  const { data, error, isLoading } = useQuery(profileOptions);

  const shouldFetchUserData = Boolean(userId && userId.trim() !== '');

  const experienceQuery = useQuery({
    ...experienceOptions(userId),
    enabled: shouldFetchUserData
  });

  const userQuery = useQuery({
    ...userProfileOptions(userId),
    enabled: shouldFetchUserData
  });
  const educationQuery = useQuery({
    ...educationOptions(userId),
    enabled: shouldFetchUserData
  });
  const serviceQuery = useQuery({
    ...serviceOptions(userId),
    enabled: shouldFetchUserData
  });
  const languageQuery = useQuery({
    ...languageOptions(userId),
    enabled: shouldFetchUserData
  });
  const reviewsQuery = useQuery({
    ...reviewsOptions(userId),
    enabled: shouldFetchUserData
  });

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const logout = () => {
    localStorage.removeItem('token');
    globalThis.location.href = '/';
  };

  const experienceData = experienceQuery.error ? [] : (experienceQuery.data?.data ?? []);
  const projects = experienceData.filter((item: IExperience) => item.title);
  const experience = experienceData.filter((item: IExperience) => !item.title);
  const languages = languageQuery.error
    ? []
    : languageQuery.data?.data.map((lang) => {
        return {
          ...lang,
          key: new Intl.DisplayNames(['en'], { type: 'language' }).of(lang.key) || lang.key
        };
      });
  return {
    user: userQuery.error ? null : (userQuery.data?.data ?? null),
    profile: data?.data as IUserProfile,
    projects,
    experience,
    services: serviceQuery.error ? [] : (serviceQuery.data?.data ?? []),
    education: educationQuery.error ? [] : (educationQuery.data?.data ?? []),
    languages: languages as ILanguage[],
    reviews: reviewsQuery.error ? [] : (reviewsQuery.data?.data ?? []),
    isLoading: isLoading || experienceQuery.isLoading || educationQuery.isLoading,
    error: error,
    logout
  };
};

export default useProfile;
