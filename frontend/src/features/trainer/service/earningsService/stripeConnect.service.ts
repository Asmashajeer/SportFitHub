import api from "@/api/axiosInstance"
import { TRAINER_EARNINGS_ROUTE, } from "../trainer.api"

export const StripeConnectService={
    getStatus:async (trainerId:string)=>{
        const res=await api.get( TRAINER_EARNINGS_ROUTE.GET_STRIPE_STATUS,{params:{trainerId}});
        return res.data;
    },
    connect:async (trainerId:string)=>{
        const res=await api.get( TRAINER_EARNINGS_ROUTE.STRIPE_CONNECT,{params:{trainerId}});
        return res.data;
    },
    regenerateLink: async (trainerId: string) => {
        const res = await api.get( TRAINER_EARNINGS_ROUTE.GENERATE_LINK,{params:{trainerId}});
        return res.data;
    }
}