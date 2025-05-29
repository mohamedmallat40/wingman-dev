import { API_ROUTES } from "@/lib/api-routes"
import wingManApi from "@/lib/axios"

export const getMyProfile = async (data: any) => {
     return wingManApi.get(API_ROUTES.profile.me, data)
 
  }