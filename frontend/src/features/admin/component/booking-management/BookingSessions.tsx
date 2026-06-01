import { formatDateReadable, formatTo12Hour } from "@/utils/formatDate";
import type { AdminBookingSessionData } from "../../store/types/booking.types"

interface Props{
    sessions:AdminBookingSessionData[];
}

const BookingSessions=({sessions}:Props)=> {
  return (
   <div className="w-full space-y-3 ">

       {sessions.map((s) => (
            <div key={s.bookingSessionId} className="flex items-center justify-between py-2.5 border-b border-zinc-800">
                <div>
                    <p className="text-sm text-zinc-200">{formatDateReadable(s.date.toString())}</p>
                    <p className="text-xs text-zinc-500">{formatTo12Hour(s.startTime)} – {formatTo12Hour(s.endTime)}</p>
                </div>
                <div className="text-end">
                    <p className="text-sm">{s.status}</p>
                    <div className="text-end">
                        {s.refundedToWallet && (
                            <p className="text-xs text-amber-400">Refunded ₹{s.refundAmount.toFixed(2)}</p>
                        )}
                        {s.cancellationReason && (
                            <span className="text-xs text-zinc-500 italic">Reason : {s.cancellationReason}</span>
                        )}
                    </div>
                    
                    {/* <AttendanceBadge attendance={s.attendance} />
                    <StatusBadge status={s.status} /> */}                    
                </div>
            </div>
         ))}
    </div>
  )
}

BookingSessions.propTypes = {

}

export default BookingSessions

