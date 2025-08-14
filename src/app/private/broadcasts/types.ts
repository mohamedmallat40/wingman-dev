// Topic interface matching API response
export interface Topic {
  id: string;
  title: string;
  description: string;
  key: string | null;
  icon: string;
  color: string;
  background: string | null;
}

// Skill interface matching API response
export interface Skill {
  id: string;
  key: string;
  type: string | null;
}

// Owner/User interface matching API response
export interface BroadcastOwner {
  id: string;
  email: string;
  kind: 'COMPANY' | 'FREELANCER' | 'AGENCY';
  isMailVerified: boolean;
  userName: string | null;
  firstName: string;
  lastName: string;
  resume: string | null;
  aboutMe: string | null;
  profileImage: string | null;
  profileCover: string | null;
  statusAviability: string;
  phoneNumber: string;
  contactLink: string | null;
  birthDate: string | null;
  lastUpdatedDateStatus: string | null;
  hourlyRate: number;
  linkedinProfile: string | null;
  category: string | null;
  profileWebsite: string | null;
  dailyRate: number;
  experienceYears: number;
  extraInfo: string | null;
  workType: string;
  stepper: boolean;
  profession: string | null;
  city: string | null;
  amount: number | null;
  currency: string | null;
  shouldBeVisible: boolean | null;
  paymentType: string | null;
  region: string | null;
  workingTime: string;
  cid: string;
  isCompleted: boolean;
  addedBy: string | null;
  isDeleted: boolean;
  dateDeleted: string | null;
  registrationType: string | null;
  acceptChatWarning: boolean;
  SignedCommissionAgreement: boolean;
  language: string;
  completedSteps: string[];
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  created_at: string;
  updated_at: string;
}

// Main BroadcastPost interface matching API response
export interface BroadcastPost {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  topics: Topic[];
  skills: Skill[];
  owner: BroadcastOwner;
  media?: string[]; // Array of filenames
}

export interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
    handle: string;
  };
  content: string;
  timestamp: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
  };
  replies?: Comment[];
  isPinned?: boolean;
  isAuthor?: boolean;
  isEdited?: boolean;
  editedAt?: string;
}

export interface PostInteraction {
  postId: string;
  userId: string;
  type: 'like' | 'bookmark' | 'share' | 'view';
  timestamp: string;
}

