import { API_ROUTES } from '@/lib/api-routes';
import wingManApi from '@/lib/axios';

export interface InvitationData {
  firstName: string;
  lastName: string;
  email: string;
  personalMessage?: string;
}

export interface InvitationResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    email: string;
    status: string;
  };
}

export const inviteUserToPlatform = async (data: InvitationData): Promise<InvitationResponse> => {
  const response = await wingManApi.post(API_ROUTES.invitations.platform, data);
  return response.data;
};