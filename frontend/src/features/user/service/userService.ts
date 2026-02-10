import api from "@/api/axiosInstance"
import { USER_ROUTES } from "./user.api"
import type { CreateProfileData } from "../types/user.schema"

export const userService={
   addProfile:async(formData:FormData)=>{
        const response=await api.post(USER_ROUTES.ADD_PROFILE,formData);
        return response.data;
   }
}