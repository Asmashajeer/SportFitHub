import { BOOKING_SESSION_STATUS, PAGINATION_DEFAULT_LIMIT } from "@/constants/constants";
import { trainerBookingsService } from "../../service/trainer.bookings.service";
import { useTrainerStore } from "../../store/useTrainerStore";
import { useEffect, useMemo, useState } from "react";
import type { BookedSessionResponseDataWithUserInfo } from "../../types/trainer.bookings.types";
import BookingSessionCard from "../bookings/BookingSessionCard";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, ArrowRightCircle } from "lucide-react";
import { divIcon } from "leaflet";
import { Button } from "@/components/ui/button";

interface SessionsDataProps {
  sessions: BookedSessionResponseDataWithUserInfo[] | [];
  totalPages: number;
  total: number;
  page: number;
}
const  NextSessionCard=()=> {
      const navigate=useNavigate()
      const { profile } = useTrainerStore();   
       const [sessionsData, setSessionsData] = useState<SessionsDataProps>({
          sessions: [],
          totalPages: 0,
          total: 0,
          page: 1,
        });
    useEffect(() => {
        if (!profile) return;
        const getBookedSessions = async () => {
          if (profile) {
            const data = await trainerBookingsService.getBookings(profile.id, {
              page: 1,
              limit: PAGINATION_DEFAULT_LIMIT,
              status: BOOKING_SESSION_STATUS.SCHEDULED,
            });
           
            setSessionsData(data);
           
          }
        };
        getBookedSessions();
      }, [ profile]);
    
      // grouping sessions by sessionId
      const groupedSessions = useMemo(() => {
        const sessionMap = new Map<
          string,
          BookedSessionResponseDataWithUserInfo[]
        >();
        sessionsData.sessions.forEach((s) => {
          const key = `${s.sessionId}-${s.date}-${s.slotId}`;
          if (!sessionMap.has(key)) sessionMap.set(key, []);
          sessionMap.get(key)!.push(s);
        });
        return Array.from(sessionMap.values());
      }, [sessionsData.sessions]);
     const nextSession= groupedSessions
     .sort((a, b) => new Date(a[0].date).getTime() - new Date(b[0].date).getTime() )
     .filter(group=>new Date(group[0].date).getTime()>=new Date().getTime())[0];
  return (
      <>
    {nextSession ? 
    <div className="bg-zinc-800/40  hover:bg-zinc-800/70 border border-zinc-700 mt-1 hover:border-emarld-600/60 rounded-xl transition-all w-2xl duration-200">
        <div className="flex items-center justify-between w-full ">
             <p className="text-sm bg-emerald-600 px-2 me-3">Next</p>
             <p className=" flex items-center text-xs text-emerald-600 px-2 me-3 hover:text-emerald-400 " onClick={()=>navigate('/trainer/bookings')}>Upcoming sessions<ArrowRightCircle className="px-1 h-5 w-5"/></p>  
        </div>
        <BookingSessionCard
            key={nextSession[0].sessionId}
            sessions={nextSession}
            type={'upcoming'}
          />          
    </div>     
    :
      <div className=" border border-dashed bg-transparent border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-600 mb-4">
            You haven't created any sessions yet.
          </p>
          <Button variant="outline" onClick={() => navigate('/trainer/sessions')}>
           Start, create a  Session
          </Button>
      </div>
    }
   </>      
   
  )
}



export default NextSessionCard

