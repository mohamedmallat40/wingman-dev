import { BaseApiService } from './base-api.service';
import { type ProfileUser, type Experience, type Education, type Language, type SocialAccount } from '../../types';

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  aboutMe?: string;
  profession?: string;
  workType?: string;
  workingTime?: string;
  experienceYears?: number;
  city?: string;
  region?: string;
  statusAvailability?: string;
  linkedinProfile?: string;
  profileWebsite?: string;
  profileImage?: string;
  profileCover?: string;
}

export interface CreateExperienceRequest {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  location?: string;
  skills?: string[];
  userId?: string;
}

export interface CreateEducationRequest {
  university: string;
  degree: string;
  field?: string;
  description?: string;
  startDate: string;
  endDate?: string;
  grade?: string;
  userId?: string;
}

export interface CreateLanguageRequest {
  name: string;
  nativeName?: string;
  code: string;
  level: string;
  certificationLevel?: string;
  yearsOfExperience?: number;
  description?: string;
  certificationName?: string;
  certificationScore?: string;
  certificationDate?: string;
  isNative: boolean;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
  canUnderstand: boolean;
  countryFlag?: string;
  userId?: string;
}

export interface CreateSocialAccountRequest {
  platform: SocialAccount['platform'];
  username: string;
  url: string;
  isPublic: boolean;
  displayName?: string;
  userId?: string;
}

class ProfileApiService extends BaseApiService {
  constructor() {
    super('/profile');
  }

  // Profile operations
  async getProfile(userId: string): Promise<ProfileUser> {
    return this.get<ProfileUser>(`/user/${userId}`);
  }

  async updateProfile(userId: string, data: UpdateProfileRequest): Promise<ProfileUser> {
    return this.put<ProfileUser>(`/user/${userId}`, data);
  }

  async uploadProfileImage(userId: string, file: File): Promise<{ profileImage: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return this.post<{ profileImage: string }>(`/user/${userId}/avatar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async uploadCoverImage(userId: string, file: File): Promise<{ profileCover: string }> {
    const formData = new FormData();
    formData.append('profileCover', file);
    
    return this.post<{ profileCover: string }>(`/user/${userId}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Skills operations
  async getSkills(userId: string): Promise<Array<{ key: string; type?: string }>> {
    return this.get<Array<{ key: string; type?: string }>>(`/user/${userId}/skills`);
  }

  async updateSkills(userId: string, skills: Array<{ key: string; type?: string }>): Promise<Array<{ key: string; type?: string }>> {
    return this.put<Array<{ key: string; type?: string }>>(`/user/${userId}/skills`, { skills });
  }

  async addSkill(userId: string, skill: { key: string; type?: string }): Promise<{ key: string; type?: string }> {
    return this.post<{ key: string; type?: string }>(`/user/${userId}/skills`, skill);
  }

  async removeSkill(userId: string, skillKey: string): Promise<void> {
    return this.delete<void>(`/user/${userId}/skills/${skillKey}`);
  }

  // Connection operations
  async getConnectionStatus(userId: string): Promise<{
    isConnected: boolean;
    isPending: boolean;
    canConnect: boolean;
    canAccept: boolean;
    invitationId?: string;
  }> {
    return this.get<{
      isConnected: boolean;
      isPending: boolean;
      canConnect: boolean;
      canAccept: boolean;
      invitationId?: string;
    }>(`/connections/status/${userId}`);
  }

  async sendConnectionRequest(userId: string): Promise<{ invitationId: string }> {
    return this.post<{ invitationId: string }>(`/connections/request/${userId}`);
  }

  async acceptConnectionRequest(invitationId: string): Promise<void> {
    return this.patch<void>(`/connections/accept/${invitationId}`);
  }

  async declineConnectionRequest(invitationId: string): Promise<void> {
    return this.patch<void>(`/connections/decline/${invitationId}`);
  }
}

// Experience API Service
class ExperienceApiService extends BaseApiService {
  constructor() {
    super('/experience');
  }

  async getByUserId(userId: string): Promise<Experience[]> {
    return this.get<Experience[]>(`/byUser/${userId}`);
  }

  async createExperience(data: CreateExperienceRequest): Promise<Experience> {
    return this.create<Experience>(data);
  }

  async updateExperience(id: string, data: Partial<CreateExperienceRequest>): Promise<Experience> {
    return this.update<Experience>(id, data);
  }

  async deleteExperience(id: string): Promise<void> {
    return this.remove(id);
  }

  async reorderExperiences(userId: string, experienceIds: string[]): Promise<Experience[]> {
    return this.patch<Experience[]>(`/reorder/${userId}`, { experienceIds });
  }
}

// Education API Service
class EducationApiService extends BaseApiService {
  constructor() {
    super('/education');
  }

  async getByUserId(userId: string): Promise<Education[]> {
    return this.get<Education[]>(`/byUser/${userId}`);
  }

  async createEducation(data: CreateEducationRequest): Promise<Education> {
    return this.create<Education>(data);
  }

  async updateEducation(id: string, data: Partial<CreateEducationRequest>): Promise<Education> {
    return this.update<Education>(id, data);
  }

  async deleteEducation(id: string): Promise<void> {
    return this.remove(id);
  }

  async reorderEducation(userId: string, educationIds: string[]): Promise<Education[]> {
    return this.patch<Education[]>(`/reorder/${userId}`, { educationIds });
  }
}

// Languages API Service
class LanguagesApiService extends BaseApiService {
  constructor() {
    super('/languages');
  }

  async getByUserId(userId: string): Promise<Language[]> {
    return this.get<Language[]>(`/byUser/${userId}`);
  }

  async createLanguage(data: CreateLanguageRequest): Promise<Language> {
    return this.create<Language>(data);
  }

  async updateLanguage(id: string, data: Partial<CreateLanguageRequest>): Promise<Language> {
    return this.update<Language>(id, data);
  }

  async deleteLanguage(id: string): Promise<void> {
    return this.remove(id);
  }

  async getAvailableLanguages(): Promise<Array<{
    name: string;
    nativeName: string;
    code: string;
    countryFlag: string;
    region: string;
  }>> {
    return this.get<Array<{
      name: string;
      nativeName: string;
      code: string;
      countryFlag: string;
      region: string;
    }>>('/available');
  }

  async getCertificationsByLanguage(languageCode: string): Promise<string[]> {
    return this.get<string[]>(`/certifications/${languageCode}`);
  }
}

// Social Accounts API Service
class SocialAccountsApiService extends BaseApiService {
  constructor() {
    super('/social-accounts');
  }

  async getByUserId(userId: string): Promise<SocialAccount[]> {
    return this.get<SocialAccount[]>(`/byUser/${userId}`);
  }

  async createSocialAccount(data: CreateSocialAccountRequest): Promise<SocialAccount> {
    return this.create<SocialAccount>(data);
  }

  async updateSocialAccount(id: string, data: Partial<CreateSocialAccountRequest>): Promise<SocialAccount> {
    return this.update<SocialAccount>(id, data);
  }

  async deleteSocialAccount(id: string): Promise<void> {
    return this.remove(id);
  }

  async updatePrivacy(accountId: string, isPublic: boolean): Promise<SocialAccount> {
    return this.patch<SocialAccount>(`/${accountId}/privacy`, { isPublic });
  }

  async validateUrl(platform: string, url: string): Promise<{ isValid: boolean; suggestion?: string }> {
    return this.post<{ isValid: boolean; suggestion?: string }>('/validate-url', { platform, url });
  }

  async reorderSocialAccounts(userId: string, accountIds: string[]): Promise<SocialAccount[]> {
    return this.patch<SocialAccount[]>(`/reorder/${userId}`, { accountIds });
  }
}

// Export service instances
export const profileApiService = new ProfileApiService();
export const experienceApiService = new ExperienceApiService();
export const educationApiService = new EducationApiService();
export const languagesApiService = new LanguagesApiService();
export const socialAccountsApiService = new SocialAccountsApiService();

// Export service classes for testing
export { ProfileApiService, ExperienceApiService, EducationApiService, LanguagesApiService, SocialAccountsApiService };