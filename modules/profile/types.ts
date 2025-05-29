interface Address {
    id: string;
    city: string;
    country: string;
    postalCode: string;
    VATNumber: string;
    street: string;
    countryCode: string | null;
    houseNumber: string;
    companyName: string;
    type: string;
  }
  
  interface NotificationSetting {
    id: string;
    type: 'JOB_RECOMMENDATION' | 'CHAT_ALERT' | 'APPLICATION_STATUS';
    preferences: ('EMAIL' | 'WEB')[];
  }
  
  export interface IUserProfile {
    id: string;
    email: string;
    kind: 'FREELANCER' | string;
    isMailVerified: boolean;
    userName: string | null;
    firstName: string;
    lastName: string;
    resume: string;
    aboutMe: string;
    profileImage: string;
    profileCover: string | null;
    statusAviability: 'OPEN_FOR_PROJECT' | string;
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
    workType: 'REMOTE' | string;
    stepper: boolean;
    profession: string | null;
    city: string | null;
    amount: number;
    currency: string;
    shouldBeVisible: boolean;
    paymentType: 'DAILY_BASED' | string;
    region: string | null;
    workingTime: 'PART_TIME' | string;
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
    address: Address[];
    position: string | null;
    skills: string[];
    notes: string[];
    portfolio: string | null;
    tags: string[];
    savedMissions: string[];
    notificationSettings: NotificationSetting[];
  }
  