import api from "@/api/axiosInstance";
import { ADMIN_ROUTES } from "./admin.api"
import type { UpdateSettingsData } from "../store/types/settings.schema";


export const PlatformSettingsService={
    getSettings:async ()=>{
        const res=await api.get(ADMIN_ROUTES.SETTINGS);
        return res.data;
    },
    updateSettings:async (data:UpdateSettingsData)=>{
        console.log('data  :',data);
        const res=await api.patch(ADMIN_ROUTES.SETTINGS,data);
        return res.data;
    }
}