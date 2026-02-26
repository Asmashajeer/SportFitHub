import api from "@/api/axiosInstance"
import { USER_ROUTES } from "./user.api"
import type { ProfilePicResponse } from "../types/user.types";
import type { CreateProfileData } from "../types/user.schema";


export const userService={
   addProfile:async(data:CreateProfileData)=>{
        const response=await api.post(USER_ROUTES.ADD_PROFILE,data);
        return response.data;
   },
   getProfilePic:async(userId:string):Promise<ProfilePicResponse>=>{
      const response=await api.get(USER_ROUTES.GET_PROFILE_PIC+`/${userId}`)
      return response.data;
   }
}