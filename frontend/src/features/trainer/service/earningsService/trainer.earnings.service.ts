import api from "@/api/axiosInstance"
import { TRAINER_EARNINGS_ROUTE } from "../trainer.api";

export const TrainerEarningsService={
    getSummary:async(trainerId:string)=>{
        const res=await api.get(TRAINER_EARNINGS_ROUTE.GET_SUMMARY,{params:{trainerId}});
        return res.data;
    },
    getSessions:async(trainerId:string,page:number)=>{
        const res=await api.get(TRAINER_EARNINGS_ROUTE.GET_SESSIONS,{ params: { trainerId,page } });
        return res.data;
    },
     getHistory:async(trainerId:string)=>{
        const res=await api.get(TRAINER_EARNINGS_ROUTE.GET_HISTORY,{params:{trainerId}});
        return res.data;
    },

}