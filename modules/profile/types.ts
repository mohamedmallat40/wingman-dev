import { type AddressDetails } from '@/lib/types/auth';

interface NotificationSetting {
  id: string;
  type: 'JOB_RECOMMENDATION' | 'CHAT_ALERT' | 'APPLICATION_STATUS';
  preferences: ('EMAIL' | 'WEB')[];
}

export interface IUserProfile {
  id: string;
  email: string;
  kind: 'FREELANCER' | 'COMPANY' | 'ADMIN' | 'AGENCY';
  isMailVerified: boolean;
  userName: string | null;
  firstName: string;
  lastName: string;
  resume: string;
  aboutMe: string;
  profileImage: string;
  profileCover: string | null;
  statusAviability: 'OPEN_FOR_PROJECT' | 'AVAILABLE' | 'NOT_AVAILABLE';
  phoneNumber: string;
  birthDate: string | null;
  lastUpdatedDateStatus: string | null;
  hourlyRate: number;
  linkedinProfile: string;
  category: string | null;
  profileWebsite: string;
  dailyRate: number;
  experienceYears: number;
  extraInfo: string;
  workType: 'REMOTE' | 'ON_SITE';
  stepper: boolean;
  profession: string | null;
  city: string | null;
  amount: number;
  currency: string;
  shouldBeVisible: boolean;
  paymentType: 'DAILY_BASED' | 'HOURLY_BASED' | 'PROJECT';
  region: string | null;
  workingTime: 'PART_TIME' | 'FULL_TIME';
  cid: string;
  isCompleted: boolean;
  addedBy: string | null;
  isDeleted: boolean;
  dateDeleted: string | null;
  acceptChatWarning: boolean;
  language: string;
  completedSteps: string[];
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  created_at: string;
  updated_at: string;
  address: AddressDetails[];
  position: string | null;
  skills: Skill[];
  notes: string[];
  portfolio: string | null;
  tags: string[];
  savedMissions: string[];
  notificationSettings: NotificationSetting[];
}

export interface IEducation {
  id: string;
  university: string;
  degree: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface IExperience {
  id: string;
  company: string;
  description: string;
  startDate: string;
  endDate: string;
  position: string;
  title: string | null;
  link: string | null;
  image: string;
  screenShots: string | null;
  videoUrl: string | null;
}
export interface IService {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'HOURLY_BASED' | 'DAILY_BASED' | 'PROJECT_BASED';
  createdAt: string;
  skills: Skill[];
}
export interface ILanguage {
  id: string;
  key?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'NATIVE';
}

export interface Skill {
  id: string;
  key: string;
  type: 'NORMAL' | 'SOFT';
}
export interface IReview {
  id: string;
  stars: number;
  testimony: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  name: string;
  email: string;
  companyName: string;
  position: string;
  createdAt: string;
}
