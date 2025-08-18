import { type Education, type Experience, type Language, type ProfileUser } from '../types';

interface ProfileCompletionData {
  user: ProfileUser;
  experiences?: Experience[];
  education?: Education[];
  languages?: Language[];
}

export const calculateProfileCompletion = (data: ProfileCompletionData): number => {
  const { user, experiences = [], education = [], languages = [] } = data;

  let completedFields = 0;
  let totalFields = 0;

  // Personal Information (40% weight)
  const personalFields = [
    { field: user.firstName, weight: 3 },
    { field: user.lastName, weight: 3 },
    { field: user.email, weight: 2 },
    { field: user.aboutMe, weight: 5 },
    { field: user.profileImage, weight: 3 },
    { field: user.phoneNumber, weight: 2 },
    { field: user.region, weight: 2 },
    { field: user.city, weight: 2 },
    { field: user.profession, weight: 3 }
  ];

  personalFields.forEach(({ field, weight }) => {
    totalFields += weight;
    if (field && field.toString().trim()) {
      completedFields += weight;
    }
  });

  // Professional Information (30% weight)
  if (experiences.length > 0) {
    completedFields += 8;
  }
  totalFields += 8;

  if (education.length > 0) {
    completedFields += 6;
  }
  totalFields += 6;

  // Skills and Languages (20% weight)
  if (user.skills && user.skills.length > 0) {
    completedFields += 4;
  }
  totalFields += 4;

  if (languages.length > 0) {
    completedFields += 4;
  }
  totalFields += 4;

  // Additional Information (10% weight)
  if (user.socialAccounts && user.socialAccounts.length > 0) {
    completedFields += 2;
  }
  totalFields += 2;

  if (user.linkedinProfile) {
    completedFields += 2;
  }
  totalFields += 2;

  if (user.profileWebsite) {
    completedFields += 1;
  }
  totalFields += 1;

  if (user.resume) {
    completedFields += 1;
  }
  totalFields += 1;

  return Math.round((completedFields / totalFields) * 100);
};

export const getCompletionColor = (percentage: number): 'danger' | 'warning' | 'success' => {
  if (percentage < 50) return 'danger';
  if (percentage < 80) return 'warning';
  return 'success';
};

export const getCompletionMessage = (percentage: number): string => {
  if (percentage < 30) return 'Just getting started';
  if (percentage < 50) return 'Making progress';
  if (percentage < 70) return 'Looking good';
  if (percentage < 90) return 'Almost complete';
  return 'Profile complete';
};
