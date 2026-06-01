import { motion, AnimatePresence } from 'framer-motion';
import type { ISlots, Pricing } from '../store/session.types';
import { formatDateReadable, formatTo12Hour } from '@/utils/formatDate';
import type { IBookedSlot } from '@/features/user/types/user.booking.types';
interface props {
  sessionId: string;
  selectedDate: string | undefined;
  selectedSlot: ISlots | null;
  pricePlan: Pricing | null;
  bookingSlots: IBookedSlot[];
  onBooking: () => void;
}
const StickyBookingBar = ({
  sessionId,
  selectedDate,
  selectedSlot,
  pricePlan,
  bookingSlots,
  onBooking,
}: props) => {
  let isReady = false;
  if (sessionId && pricePlan) {
    if (selectedDate && selectedSlot) isReady = true;
    else if (bookingSlots.length === pricePlan.sessionCount) {
      isReady = true;
    } else isReady = false;
  }
  // const isReady = sessionId  && pricePlan||(selectedDate && selectedSlot)||bookingSlots;

  return (
    <AnimatePresence>
      {isReady && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 border bg-emerald-800 backdrop-blur-lg border-t  px-6 py-4 pb-8 md:pb-4 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]"
        >
          <div className="max-w-5xl mx-auto flex items-center  justify-between gap-4">
            {/* Left Side: Summary Info */}
            <div className="flex flex-col overflow-hidden">
              <span className="text-emerald-500 text-[10px] uppercase font-black tracking-widest mb-0.5">
                Ready to Book
              </span>
              <h4 className="text-white font-bold text-sm truncate">
                {formatDateReadable(selectedDate)} •{' '}
                {formatTo12Hour(selectedSlot?.startTime)}
              </h4>
              <p className="text-zinc-500 text-xs truncate">
                {pricePlan?.sessionCount} sessions
              </p>
            </div>

            {/* Right Side: Price & Action */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-zinc-500 text-[10px] uppercase font-bold">
                  Total
                </p>
                <p className="text-white font-black text-xl">
                  ${pricePlan?.price}
                </p>
              </div>

              <button
                onClick={() => {
                  if (isReady) {
                    // if(pricePlan?.sessionCount>1){
                    //   const data: IPayload = {
                    //       sessionId: sessionId,
                    //       date: selectedDate!,
                    //       slotId: selectedSlot!._id,
                    //       slotTime: `${selectedSlot!.startTime} - ${selectedSlot!.endTime}`,
                    //       planId: pricePlan!._id!,
                    //       numberOfSessions:  pricePlan!.sessionCount,
                    //       amount: pricePlan!.price,
                    //       type: 'SESSION'
                    //   }
                    // else{
                    //   const data: IPayload = {
                    //       sessionId: sessionId,
                    //       date: selectedDate!,
                    //       slotId: selectedSlot!._id,
                    //       slotTime: `${selectedSlot!.startTime} - ${selectedSlot!.endTime}`,
                    //       planId: pricePlan!._id!,
                    //       numberOfSessions:  pricePlan!.sessionCount,
                    //       amount: pricePlan!.price,
                    //       type: 'SESSION'
                    // }
                    onBooking();
                  }
                }}
                className="bg-emerald-500 hover:bg-emerald-400 text-black px-8 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                BookNow
                <span className="sm:hidden">— ${pricePlan?.price}</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBookingBar;
