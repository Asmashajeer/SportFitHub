import api from "@/api/axiosInstance";
import type { AddTrainerProfileData } from "../types/trainer.profile.schema";
import type { AvailabiltyPricing, idVerificationwithUrl, paymentInfoData, TrainerProfileResponseData } from "../types/trainerprofile.types";
import { TRAINER_ROUTES } from "./trainer.api";
import type { ProfilePicResponse } from "@/features/user/types/user.types";
import type { ICertification } from "../store/useTrainerStore";
import type { Doc_status_type } from "@/constants/constants";


export const trainerService={
        
        addProfile: async (profile:AddTrainerProfileData):Promise<TrainerProfileResponseData> =>{
            const response=await api.post(TRAINER_ROUTES.ADD_PROFILE,profile);
            return response.data;
        },
         getProfilePic:async():Promise<ProfilePicResponse>=>{
            const response=await api.get(TRAINER_ROUTES.GET_PROFILE_PIC)
            return response.data;
        },
        getProfile: async()=>{
            const response=await api.get(TRAINER_ROUTES.GET_PROFILE);
            return response.data;
        },
        updateCertificationInfo:async(id:string,section:string, documents:ICertification[])=>{
            const response=await api.patch(TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id)+'/'+section,documents);
            return response.data;
        },
        updateTrainerStatus:async(id:string,status:Doc_status_type)=>{
            const response=await api.patch(TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id)+`/trainer-status`,status);
            return response.data;
        } ,
        updateIdverification:async(id:string,data:idVerificationwithUrl)=>{          
            const response=await api.patch(TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/idVerification', data);
             return response.data;
        },
        updateAvailability_Pricing:async(id:string,data:AvailabiltyPricing)=>{
            const response=await api.patch(TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/availability_pricing', data);
             return response.data;
        },
        updatePaymentInfo:async(id:string,data:paymentInfoData)=>{
            const response=await api.patch(TRAINER_ROUTES.UPDATE_PROFILE.BY_ID(id) + '/paymentInfo', data);
             return response.data;
        }
}