import { formatDateReadable, formatTo12Hour } from '@/utils/formatDate';
import type { BookingSlot, IVenueAddress } from '../store/payment.types';
import { MapPin } from 'lucide-react';

interface props {
  data: {
    name: string;
    venue: IVenueAddress;
    bookingSlots: BookingSlot[];
    price: number;
    sessions: number;
  };
  image: string;
}
const OrderSummary = ({ data, image }: props) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Review and Confirm
        </h2>
        <p className="text-zinc-400">
          Review your session details before payment.
        </p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 items-center justify-center">
            <h4 className="text-emerald-500 font-bold uppercase text-xs tracking-widest">
              Selected Session
            </h4>
            <p className="text-xl text-center px- font-semibold text-white">
              {data.name}
            </p>
          </div>
        </div>
        <div className="flex items-center px-8 text-emerald-500 text-xs font-bold">
          <img
            src={image}
            className="w-full h-full object-cover"
            alt="Session image"
          />
        </div>
        <div className="flex  items-center">
          <MapPin size={16} className="text-emerald-500 mx-2 " />{' '}
          <p>
            {' '}
            {data.venue.name} , {data.venue.address}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 py-2 border-y border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase">Date & Day</p>
          <p className="text-zinc-400 text-xs uppercase">Time Slot</p>
        </div>
        {data.bookingSlots.map((slot, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4 py-.5 border-y border-zinc-800"
          >
            <p className="text-white font-medium">
              {formatDateReadable(slot.date)}
            </p>
            <p className="text-white font-medium">
              {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
            </p>
          </div>
        ))}
        <div className="flex justify-between items-center pt-2">
          <p className="text-zinc-400">Number of session</p>
          <p className="text-2xl font-black text-white">{data.sessions}</p>
        </div>
        <div className="flex justify-between items-center pt-2">
          <p className="text-zinc-400">Total to pay</p>
          <p className="text-2xl font-black text-white">
            {data.price.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
