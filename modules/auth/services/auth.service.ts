import { API_ROUTES } from "@/lib/api-routes"
import wingManApi from "@/lib/axios"

export const login = async (data: any) => {
     return wingManApi.post(API_ROUTES.auth.login, data)
 
  }