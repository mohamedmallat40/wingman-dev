export interface SocialAccount {
  id: string;
  platform: 'linkedin' | 'github' | 'twitter' | 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'behance' | 'dribbble' | 'medium' | 'portfolio' | 'other';
  username: string;
  url: string;
  isPublic: boolean;
  displayName?: string;
}

export interface ProfileUser {
  id: string;
  email: string;
  kind: string;
  userName?: string;
  firstName: string;
  lastName: string;
  resume?: string;
  aboutMe?: string;
  profileImage?: string;
  profileCover?: string;
  statusAvailability: string;
  phoneNumber?: string;
  linkedinProfile?: string;
  profileWebsite?: string;
  profession?: string;
  workType?: string;
  workingTime?: string;
  experienceYears?: number;
  language: string;
  region?: string;
  city?: string;
  skills: Array<{ key: string; type?: string }>;
  amount?: number;
  currency?: string;
  paymentType?: string;
  reviewCount?: string;
  averageRating?: number;
  socialAccounts?: SocialAccount[];
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  skills?: string[];
}

export type LanguageProficiencyLevel = 
  | 'NATIVE' 
  | 'FLUENT' 
  | 'PROFESSIONAL' 
  | 'CONVERSATIONAL' 
  | 'INTERMEDIATE' 
  | 'BEGINNER' 
  | 'ELEMENTARY';

export type CertificationLevel = 
  | 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1' | 'NATIVE';

export interface Language {
  id: string;
  name: string; // Full language name (e.g., "English", "Spanish")
  nativeName?: string; // Native name (e.g., "Español" for Spanish)
  code: string; // ISO 639-1 code (e.g., "en", "es", "fr")
  level: LanguageProficiencyLevel;
  certificationLevel?: CertificationLevel; // CEFR level if applicable
  yearsOfExperience?: number;
  description?: string; // Additional context
  certificationName?: string; // e.g., "IELTS", "TOEFL", "DELE"
  certificationScore?: string; // e.g., "8.5/9", "Advanced"
  certificationDate?: string; // When certification was obtained
  isNative: boolean;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
  canUnderstand: boolean;
  countryFlag?: string; // Country code for flag display
  // For backwards compatibility
  key: string; // Will map to 'name'
}

export interface Education {
  id: string;
  university: string;
  degree: string;
  field?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
}

export interface UserNote {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isPending?: boolean;
  connectionId?: string;
  canConnect: boolean;
  canAccept?: boolean;
  invitationId?: string;
}

export interface ProfileData {
  user: ProfileUser;
  experiences: Experience[];
  languages: Language[];
  education: Education[];
  notes: UserNote[];
  connectionStatus: ConnectionStatus;
}