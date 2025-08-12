import wingManApi from '@/lib/axios';
import { type SocialAccount } from '../types';

export interface CreateSocialAccountRequest {
  platform: SocialAccount['platform'];
  username: string;
  url: string;
  isPublic: boolean;
  displayName?: string;
}

export interface UpdateSocialAccountRequest {
  id: string;
  platform?: SocialAccount['platform'];
  username?: string;
  url?: string;
  isPublic?: boolean;
  displayName?: string;
}

export class SocialAccountsService {
  /**
   * Get all social accounts for the current user
   */
  static async getSocialAccounts(): Promise<SocialAccount[]> {
    try {
      const response = await wingManApi.get('/profile/social-accounts');
      return response.data;
    } catch (error) {
      console.error('Error fetching social accounts:', error);
      throw new Error('Failed to fetch social accounts');
    }
  }

  /**
   * Get social accounts for a specific user (public accounts only if not own profile)
   */
  static async getUserSocialAccounts(userId: string): Promise<SocialAccount[]> {
    try {
      const response = await wingManApi.get(`/profile/${userId}/social-accounts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user social accounts:', error);
      throw new Error('Failed to fetch user social accounts');
    }
  }

  /**
   * Create a new social account
   */
  static async createSocialAccount(data: CreateSocialAccountRequest): Promise<SocialAccount> {
    try {
      const response = await wingManApi.post('/profile/social-accounts', data);
      return response.data;
    } catch (error) {
      console.error('Error creating social account:', error);
      throw new Error('Failed to create social account');
    }
  }

  /**
   * Update an existing social account
   */
  static async updateSocialAccount(data: UpdateSocialAccountRequest): Promise<SocialAccount> {
    try {
      const response = await wingManApi.put(`/profile/social-accounts/${data.id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating social account:', error);
      throw new Error('Failed to update social account');
    }
  }

  /**
   * Delete a social account
   */
  static async deleteSocialAccount(accountId: string): Promise<void> {
    try {
      await wingManApi.delete(`/profile/social-accounts/${accountId}`);
    } catch (error) {
      console.error('Error deleting social account:', error);
      throw new Error('Failed to delete social account');
    }
  }

  /**
   * Update privacy settings for multiple social accounts
   */
  static async updateSocialAccountsPrivacy(updates: Array<{ id: string; isPublic: boolean }>): Promise<SocialAccount[]> {
    try {
      const response = await wingManApi.patch('/profile/social-accounts/privacy', { updates });
      return response.data;
    } catch (error) {
      console.error('Error updating social accounts privacy:', error);
      throw new Error('Failed to update social accounts privacy');
    }
  }

  /**
   * Validate social account URL
   */
  static validateSocialAccountUrl(platform: SocialAccount['platform'], url: string): boolean {
    const platformPatterns: Record<SocialAccount['platform'], RegExp> = {
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(in|pub)\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      github: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      facebook: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      youtube: /^https?:\/\/(www\.)?youtube\.com\/(c\/|channel\/|@)[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      behance: /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      dribbble: /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      medium: /^https?:\/\/(www\.)?medium\.com\/@[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      portfolio: /^https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/,
      other: /^https?:\/\/[a-zA-Z0-9-._~:/?#[\]@!$&'()*+,;=%]+$/
    };

    const pattern = platformPatterns[platform];
    return pattern ? pattern.test(url) : false;
  }

  /**
   * Generate URL from platform and username
   */
  static generateUrl(platform: SocialAccount['platform'], username: string): string {
    const baseUrls: Record<SocialAccount['platform'], string> = {
      linkedin: 'https://linkedin.com/in/',
      github: 'https://github.com/',
      twitter: 'https://twitter.com/',
      instagram: 'https://instagram.com/',
      facebook: 'https://facebook.com/',
      youtube: 'https://youtube.com/@',
      tiktok: 'https://tiktok.com/@',
      behance: 'https://behance.net/',
      dribbble: 'https://dribbble.com/',
      medium: 'https://medium.com/@',
      portfolio: '',
      other: ''
    };

    const baseUrl = baseUrls[platform];
    return baseUrl ? `${baseUrl}${username}` : '';
  }

  /**
   * Extract username from social media URL
   */
  static extractUsername(platform: SocialAccount['platform'], url: string): string {
    const extractors: Record<SocialAccount['platform'], (url: string) => string> = {
      linkedin: (url) => {
        const match = url.match(/linkedin\.com\/(?:in|pub)\/([^/?]+)/);
        return match ? match[1] : '';
      },
      github: (url) => {
        const match = url.match(/github\.com\/([^/?]+)/);
        return match ? match[1] : '';
      },
      twitter: (url) => {
        const match = url.match(/(?:twitter\.com|x\.com)\/([^/?]+)/);
        return match ? match[1] : '';
      },
      instagram: (url) => {
        const match = url.match(/instagram\.com\/([^/?]+)/);
        return match ? match[1] : '';
      },
      facebook: (url) => {
        const match = url.match(/facebook\.com\/([^/?]+)/);
        return match ? match[1] : '';
      },
      youtube: (url) => {
        const match = url.match(/youtube\.com\/(?:c\/|channel\/|@)([^/?]+)/);
        return match ? match[1] : '';
      },
      tiktok: (url) => {
        const match = url.match(/tiktok\.com\/@([^/?]+)/);
        return match ? match[1] : '';
      },
      behance: (url) => {
        const match = url.match(/behance\.net\/([^/?]+)/);
        return match ? match[1] : '';
      },
      dribbble: (url) => {
        const match = url.match(/dribbble\.com\/([^/?]+)/);
        return match ? match[1] : '';
      },
      medium: (url) => {
        const match = url.match(/medium\.com\/@([^/?]+)/);
        return match ? match[1] : '';
      },
      portfolio: (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^/?]+)/);
        return match ? match[1] : '';
      },
      other: (url) => {
        const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^/?]+)/);
        return match ? match[1] : '';
      }
    };

    const extractor = extractors[platform];
    return extractor ? extractor(url) : '';
  }

  /**
   * Get platform display name and icon
   */
  static getPlatformInfo(platform: SocialAccount['platform']) {
    const platformInfo: Record<SocialAccount['platform'], { name: string; icon: string; color: string }> = {
      linkedin: { name: 'LinkedIn', icon: 'solar:linkedin-linear', color: 'text-blue-600' },
      github: { name: 'GitHub', icon: 'solar:code-square-linear', color: 'text-gray-800' },
      twitter: { name: 'Twitter', icon: 'solar:twitter-linear', color: 'text-blue-400' },
      instagram: { name: 'Instagram', icon: 'solar:instagram-linear', color: 'text-pink-600' },
      facebook: { name: 'Facebook', icon: 'solar:facebook-linear', color: 'text-blue-700' },
      youtube: { name: 'YouTube', icon: 'solar:youtube-linear', color: 'text-red-600' },
      tiktok: { name: 'TikTok', icon: 'solar:music-note-linear', color: 'text-black' },
      behance: { name: 'Behance', icon: 'solar:palette-linear', color: 'text-blue-500' },
      dribbble: { name: 'Dribbble', icon: 'solar:basketball-linear', color: 'text-pink-500' },
      medium: { name: 'Medium', icon: 'solar:pen-new-square-linear', color: 'text-green-600' },
      portfolio: { name: 'Portfolio', icon: 'solar:folder-open-linear', color: 'text-purple-600' },
      other: { name: 'Other', icon: 'solar:link-linear', color: 'text-default-600' }
    };

    return platformInfo[platform] || platformInfo.other;
  }
}