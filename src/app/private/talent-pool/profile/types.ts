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
  statusAviability: string;
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

export interface Language {
  id: string;
  key: string;
  level: string;
  name?: string;
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
}

export interface ProfileData {
  user: ProfileUser;
  experiences: Experience[];
  languages: Language[];
  education: Education[];
  notes: UserNote[];
  connectionStatus: ConnectionStatus;
}
