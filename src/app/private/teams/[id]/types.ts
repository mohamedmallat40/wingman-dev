// Re-export the existing types from your system
export interface Group {
  id: string;
  groupName: string;
  color: string;
  members: number;
  tools: Tool[];
  owner: User;
  connections: Connection[];
}

export interface Connection {
  id: string;
  target: User;
}

export interface Tool {
  name: string;
  tag: string;
  description: string;
  link: string;
}

export interface User {
  id: string;
  email: string;
  kind: UserKind;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  profession: string;
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

// Additional types for the team details page
export type TeamDetailsTab = 'overview' | 'members' | 'tools' | 'projects';

export interface TeamDetailsState {
  activeTab: TeamDetailsTab;
  loading: boolean;
  error: string | null;
}

export interface TabConfig {
  key: TeamDetailsTab;
  label: string;
  icon: string;
  count?: number;
}

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  href?: string;
}

// Enums (you may already have these defined elsewhere)
export enum UserKind {
  FREELANCER = 'freelancer',
  AGENCY = 'agency',
  CLIENT = 'client'
}

export enum AvailabilityStatus {
  AVAILABLE = 'available',
  BUSY = 'busy',
  UNAVAILABLE = 'unavailable'
}

export enum WorkType {
  REMOTE = 'remote',
  ONSITE = 'onsite',
  HYBRID = 'hybrid'
}

export enum PaymentType {
  HOURLY = 'hourly',
  FIXED = 'fixed',
  MONTHLY = 'monthly'
}

export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP'
}

export interface Skill {
  id: string;
  name: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// Team-specific interfaces
export interface TeamMember extends User {
  joinedAt: string;
  role: 'owner' | 'member' | 'admin';
}

export interface TeamProject {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'paused';
  startDate: string;
  endDate?: string;
  members: string[]; // User IDs
  progress: number; // 0-100
}

export interface TeamStats {
  totalMembers: number;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalTools: number;
}
