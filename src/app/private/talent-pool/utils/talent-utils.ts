// Utility functions for talent pool components
import type { AvailabilityStatus, Currency, PaymentType, UserKind, WorkType } from '../types';

export interface AvailabilityConfig {
  readonly color: 'success' | 'warning' | 'danger';
  readonly labelKey: string;
  readonly icon: string;
}

export interface WorkTypeConfig {
  readonly icon: string;
  readonly color: 'success' | 'warning' | 'secondary' | 'default';
  readonly labelKey: string;
}

// Availability status configuration
export const getAvailabilityConfig = (status: AvailabilityStatus | string): AvailabilityConfig => {
  switch (status) {
    case 'OPEN_FOR_PROJECT':
      return {
        color: 'success',
        labelKey: 'talentPool.availability.availableForProjects',
        icon: 'solar:check-circle-bold'
      };
    case 'OPEN_FOR_PART_TIME':
      return {
        color: 'warning',
        labelKey: 'talentPool.availability.partTimeAvailable',
        icon: 'solar:clock-circle-bold'
      };
    case 'BUSY':
      return {
        color: 'danger',
        labelKey: 'talentPool.availability.busy',
        icon: 'solar:close-circle-bold'
      };
    default:
      return {
        color: 'success',
        labelKey: 'talentPool.availability.available',
        icon: 'solar:check-circle-bold'
      };
  }
};

// Work type configuration  
export const getWorkTypeConfig = (workType: WorkType | string): WorkTypeConfig => {
  switch (workType) {
    case 'REMOTE':
      return {
        icon: 'solar:home-wifi-linear',
        color: 'success',
        labelKey: 'talentPool.workType.remote'
      };
    case 'ON_LOCATION':
      return {
        icon: 'solar:buildings-linear',
        color: 'warning',
        labelKey: 'talentPool.workType.onLocation'
      };
    case 'HYBRID':
      return {
        icon: 'solar:laptop-linear',
        color: 'secondary',
        labelKey: 'talentPool.workType.hybrid'
      };
    default:
      return {
        icon: 'solar:case-linear',
        color: 'default',
        labelKey: 'talentPool.workType.unknown'
      };
  }
};

// Format rate with currency and period
export const formatRate = (
  amount: number,
  currency: Currency | string,
  paymentType: PaymentType | string,
  t?: (key: string) => string
): string => {
  const currencySymbol = currency === 'EUR' ? '€' : '$';
  const period = paymentType === 'HOURLY_BASED' 
    ? (t ? t('talentPool.paymentTypes.hourly') : '/hour')
    : (t ? t('talentPool.paymentTypes.daily') : '/day');
  const rateAmount = amount || 0;
  return `${currencySymbol}${rateAmount}${period}`;
};

// Country flag mapping
const COUNTRY_FLAGS: Record<string, string> = {
  BE: '🇧🇪',
  NL: '🇳🇱',
  FR: '🇫🇷',
  DE: '🇩🇪',
  US: '🇺🇸',
  UK: '🇬🇧',
  CA: '🇨🇦',
  AU: '🇦🇺',
  CH: '🇨🇭',
  AT: '🇦🇹'
} as const;

export const getCountryFlag = (region: string | null): string => {
  if (!region) return '🌍';
  return COUNTRY_FLAGS[region] || '🌍';
};

// User type mapping with i18n keys
const USER_TYPE_MAP = {
  FULL_TIME_FREELANCER: 'talentPool.userTypes.freelancer',
  STUDENT: 'talentPool.userTypes.student', 
  FREELANCER: 'talentPool.userTypes.freelancer',
  AGENCY: 'talentPool.userTypes.agency'
} as const;

export const mapUserType = (userType: UserKind | string, t?: (key: string) => string): string => {
  const translationKey = USER_TYPE_MAP[userType as keyof typeof USER_TYPE_MAP];
  if (translationKey && t) {
    return t(translationKey);
  }
  // Fallback for unknown types or when no translation function is provided
  return translationKey 
    ? (userType === 'STUDENT' ? 'Student' : 'Freelancer') 
    : userType.toLowerCase().replace(/_/g, ' ');
};

// Generate user initials for avatar fallback
export const getUserInitials = (firstName?: string, lastName?: string): string => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}`;
};

// Truncate text with ellipsis
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Clean HTML from text content
export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};
