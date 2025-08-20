import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export interface NetworkUser {
  id: string;
  email: string;
  kind: string;
  isMailVerified: boolean;
  userName: string | null;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  aboutMe: string | null;
  statusAviability: string;
  profession: string;
  city: string | null;
  region: string | null;
  workType: string;
  hourlyRate: number;
  dailyRate: number;
  experienceYears: number;
  language: string;
  created_at: string;
  updated_at: string;
  favorite: boolean;
}

/**
 * Search users in network for mentions
 */
export const searchNetworkUsers = async (name: string, page = 1, limit = 10): Promise<NetworkUser[]> => {
  try {
    const queryParams = new URLSearchParams({
      name,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await wingManApi.get(`${API_ROUTES.network.searchNetwork}?${queryParams}`);
    
    // The API returns { items: [...], meta: {...} }
    // We need to extract the items array
    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    
    return [];
  } catch (error) {
    // Error handled by UI
    return [];
  }
};