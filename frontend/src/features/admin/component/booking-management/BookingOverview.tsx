import { Calendar, Clock, MapPin, User, UserCog } from "lucide-react"
import type {  AdminBookingListData, } from "../../store/types/booking.types"

interface Props extends  AdminBookingListData{
 
  stripeSessionId?: string;
  paymentId: string;
 }

const BookingOverview=({booking}:{booking:Props})=> {

  return (
   <div className="w-full space-y-3 ">
        <div className="m-2 p-2">
          <div className=" bg-zinc-800 p-2 justify-start rounded-xl  ">
            <p className="flex items-center  gap-1 text-sm text-zinc-400"><span><User className="w-3 h-3"/></span>{booking.userName}</p>
            <p className="text-xs text-start  text-zinc-400">{booking.userEmail}</p>
          </div>
        </div>

        <div className="m-2 p-2">
          <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-xl ">
            <p className="flex items-center  gap-1 text-sm text-zinc-400"><span><Calendar className="w-3 h-3"/></span> {booking.sessionName}</p>
            <p className="text-xs text-zinc-400">{booking.sessionModel} </p>
             <p className="flex items-center  gap-1 text-xs text-zinc400"><span><User className="w-3 h-3"/></span>{booking.sessionType}</p>
          </div>
          {/* <div className="bg-zinc-800 p-2 rounded-xl ">
            <p className="flex items-center  gap-1 text-xs text-zinc-500"><span><UserCog className="w-3 h-3"/></span> {booking.trainerId}</p>        
         </div> */}          
        </div>

      <div className="m-2 p-2">
          <p className="flex items-center  gap-1 text-xs text-zinc-400"> Price Plan</p> 
          <div className="flex items-center justify-between bg-zinc-800 p-2 rounded-xl ">
            
            <p className="text-sm text-zinc-400">{booking.pricePlan.totalSessions} sessions</p> 
            <p className="text-sm text-zinc-400">Total: ₹ {booking.pricePlan.pricePaid.toFixed(2)} </p>
            <p className="text-sm text-zinc-400">₹ {booking.pricePlan.unitPrice.toFixed(2)}  / session</p>
          </div>
      </div>
      <div className="m-2 p-2">
        <p className="flex items-center  gap-1 text-xs text-zinc-400">Venue</p>
          <div className="bg-zinc-800 p-2 rounded-xl ">            
            <p className=" flex items-center gap-1 text-sm text-zinc-400 "><span><MapPin className="w-3 h-3 text-emerald-600"/></span>  {booking.venue.name}  , {booking.venue.address} </p>
          </div>
      </div>
    
    </div>
  )
}

BookingOverview.propTypes = {

}

export default BookingOverview

