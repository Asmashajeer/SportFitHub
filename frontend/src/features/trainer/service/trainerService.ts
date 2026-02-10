import api from "@/api/axiosInstance";
import type { AddTrainerProfileData } from "../types/trainer.profile.schema";
import type { TrainerProfileResponseData } from "../types/trainerprofile.types";
import { TRAINER_ROUTES } from "./trainer.api";

export const trainerService={
        
        addProfile: async (profile:AddTrainerProfileData):Promise<TrainerProfileResponseData> =>{
            const response=await api.post(TRAINER_ROUTES.ADD_PROFILE,profile);
            return response.data;
        }
}