// TypeScript types for Talent Pool API responses

export interface Skill {
  key: string;
  name?: string;
  level?: string;
  type?: 'NORMAL' | 'SOFT';
}

export interface User {
  id: string;
  email: string;
  kind: 'FREELANCER' | 'AGENCY' | 'FULL_TIME_FREELANCER' | 'STUDENT';
  firstName: string;
  lastName: string;
  profileImage: string | null;
  profession: string | null;
  region: string | null;
  skills: Skill[];
  hourlyRate: number;
  dailyRate: number;
  statusAviability: string;
  isConnected: boolean;
  isCompleted: boolean;
  aboutMe?: string;
  experienceYears?: number;
  workType?: string;
  workingTime?: string;
  paymentType?: string;
  amount?: number;
  currency?: string;
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
  skills?: string[];
  region?: string;
  availability?: string;
  minRate?: number;
  maxRate?: number;
}

export interface TalentCardProps {
  user: User;
  onViewProfile?: (userId: string) => void;
  onConnect?: (userId: string) => void;
}

export interface TeamCardProps {
  group: Group;
  onViewTeam?: (groupId: string) => void;
  onJoinTeam?: (groupId: string) => void;
}
