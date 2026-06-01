import { Button } from "@/components/ui/button"
import type { AdminFitnessSessionDetails, AdminSportSessionDetails, FitnessSessionDetailsData, SportsSessionDetailsData } from "@/features/admin/store/types/session.types"
import { formatTo12Hour } from "@/utils/formatDate"
import { ClockPlus } from "lucide-react"


const Schedule=({session}:{session:AdminSportSessionDetails | AdminFitnessSessionDetails}) =>{

    // const time=session.timeSlots.flatMap()
  return (
    <div>
        <div className=" justify-start m-2 p-2 w-.5  rounded-xl ">
            <p className="text-zinc-400 text-sm  flex justify-start">Weekly Time Slots</p>
            <div >

                 {session.timeSlots.map((timeSlot)=>(
                timeSlot.slots.map((slot)=>(
                    <div className=" flex items-center text-sm text-zinc-500 gap-2 bg-zinc-800/30 p-1 rounded-xl m-2">
                        {timeSlot.day}   <ClockPlus className="w-3 h-3" />{formatTo12Hour(slot.startTime)} -{formatTo12Hour(slot.endTime)}
                    </div>
                ))
            ))}
            </div>
           
        </div>
         <div className=" justify-start m-2 p-2 w-.5   rounded-xl  ">
            <p className="text-zinc-400 text-sm  flex justify-start">Booking Deadline</p>
            <div className=" flex items-center text-sm text-zinc-500 gap-2 bg-zinc-800/30 p-1 rounded-xl m-2">
                {session.bookingDeadline}   hr
            </div>
        </div>
        <div className=" justify-start m-2 px-2 w-full max-w-md">
            <p className="text-zinc-400 text-sm">Cancellation Policy</p>
            <div className="text-sm text-zinc-500 bg-zinc-800/30 p-3 rounded-xl m-1 whitespace-pre-wrap wrap-break-word">
                {session.cancellationPolicy}
            </div>
        </div>
       
        <div className=" justify-start m-2 px-2 w-.5">
            <p className="text-zinc-400 text-sm  flex justify-start">Cancellation window</p>
            <div className=" flex items-center text-sm text-zinc-500 gap-2 bg-zinc-800/30 p-1 rounded-xl m-2">
                {session.cancellationWindow}   hr
            </div>
        </div>
    </div>
  )
}



export default Schedule