import api from "@/api/axiosInstance";
import type { queryParamsOptions } from "../types/trainer.bookings.types";

import { TRAINER_ATTENDACE_ROUTE } from "./trainer.api";
import type { AttendanceMarkingData } from "../types/trainer.attendance schema";

export const trainerAttendanceService = {
     getSessionOccurance:async (trainerId:string,queryParams:queryParamsOptions )=>{   
          
        const res = await api.get(TRAINER_ATTENDACE_ROUTE.GET_BOOKED_SESSIONS_OCCURANCES ,{params:{...queryParams,trainerId}});
        return res.data;
    },

    markAttendance:async(sessionId:string,attendanceData:AttendanceMarkingData[])=>{
         const res = await api.patch(TRAINER_ATTENDACE_ROUTE.MARK_ATTENDANCE(sessionId) ,{attendanceData});
        return res.data;
    }


}