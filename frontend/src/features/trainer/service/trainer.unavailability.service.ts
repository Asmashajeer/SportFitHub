import api from "@/api/axiosInstance"
import { TRAINER_ROUTES } from "./trainer.api";
import { PUBLIC_ROUTE } from "@/service/public.api";

import type { CancelAvailabilityPayload } from "../types/trainer.availability.exception.types";

export const trainerUnavailabilityService= {
    getUnavailableDays:async ()=>{
        const res=await api.get(TRAINER_ROUTES.UNAVAILABLE_DAYS);
        return res.data
    },
    restoreAvailability:async(d:string)=>{
        const res=await api.delete(TRAINER_ROUTES.UNAVAILABLE_DAYS+`/${d}`);
        return res.data
    },
    cancelAvailability:async( payload:CancelAvailabilityPayload)=>{
        const res=await api.post(TRAINER_ROUTES.UNAVAILABLE_DAYS,payload);
        return res.data
    },
    getUnavailableDates: async (trainerId: string): Promise<string[]> => {
        const { data } = await api.get(PUBLIC_ROUTE.GET_UNAVAILABLE_TRAINER_DATES.BY_TRAINERID(trainerId));
        return data;
    },
    
}