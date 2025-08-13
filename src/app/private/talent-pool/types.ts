// TypeScript types for Talent Pool API responses

export interface Skill {
  key: string;
  name?: string;
  level?: string;
  type?: 'NORMAL' | 'SOFT';
}

export type UserKind =
  | 'FREELANCER'
  | 'AGENCY'
  | 'FULL_TIME_FREELANCER'
  | 'PART_TIME_FREELANCER'
  | 'STUDENT';
export type WorkType = 'REMOTE' | 'ON_LOCATION' | 'HYBRID';
export type PaymentType = 'HOURLY_BASED' | 'DAILY_BASED';
export type AvailabilityStatus = 'OPEN_FOR_PROJECT' | 'OPEN_FOR_PART_TIME' | 'BUSY';
export type Currency = 'EUR' | 'USD';

export interface User {
  id: string;
  email: string;
  kind: UserKind;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  profession: string | null;
  region: string | null;
  skills: Skill[];
  hourlyRate: number;
  dailyRate: number;
  statusAviability: AvailabilityStatus;
  isConnected: boolean;
  isCompleted: boolean;
  aboutMe?: string;
  experienceYears?: number;
  workType?: WorkType;
  workingTime?: string;
  paymentType?: PaymentType;
  amount?: number;
  currency?: Currency;
  city?: string;
  reviewCount?: string;
  averageRating?: number;
}

export interface Tool {
  name: string;
  tag: string;
  description: string;
  link: string;
}

export interface Connection {
  id: string;
  // Add other connection fields as needed
}

export interface Group {
  id: string;
  groupName: string;
  color: string;
  members: number;
  tools: Tool[];
  owner: User;
  connections: Connection[];
}

export interface PaginationMeta {
  currentPage: number;
  itemCount: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
}

export interface UserResponse {
  items: User[];
  meta: PaginationMeta;
}

export interface TeamResponse {
  items: Group[];
  meta: PaginationMeta;
}

export type TalentType = 'freelancers' | 'agencies' | 'teams';

export interface TalentPoolFilters {
  search?: string;
  name?: string;
  skills?: string[];
  availability?: string;
  minRate?: number;
  maxRate?: number;
  workType?: WorkType;
  minRating?: number;
  experienceLevel?: string[];
  country?: string[];
  region?: string;
  profession?: 'FULL_TIME_FREELANCER' | 'PART_TIME_FREELANCER' | 'CONTRACTOR' | 'STUDENT';
}

export interface TalentCardProps {
  user: User;
  onViewProfile?: (userId: string) => void;
  onConnect?: (userId: string) => void;
  onAddNote?: (userId: string) => void;
  onAddToGroup?: (userId: string) => void;
  onAssignTags?: (userId: string) => void;
}

export interface TeamCardProps {
  group: Group;
  onViewTeam?: (groupId: string) => void;
  onJoinTeam?: (groupId: string) => void;
}
