import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import BookingService from '../service/bookingService';
import { Calendar, Clock } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { formatDateReadable, formatTo12Hour } from '@/utils/formatDate';
import { CURRENCY } from '@/constants/constants';

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { payload, clearPayload } = useBookingStore();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    // 1. Check for session_id in the URL
    const stripeSessionId = searchParams.get('stripeSession_id');

    if (!stripeSessionId) {
      setStatus('error');
      console.log("no stripeSessionId");
      return;
    }
    const verifyPayment = async () => {
      try {
        const data = await BookingService.getBookingStatus(stripeSessionId);
        setStatus(data.status);
      } catch (err) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams, clearPayload]);

  const toDashboard = () => {
    clearPayload();
    navigate('/user/dashboard', { replace: true });
  };

  if (status === 'loading')
    return (
      <div className="p-20 text-center font-bold text-zinc-300">Verifying Payment...</div>
    );

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto p-6 md:p-20 text-center space-y-4">
        <h1 className="text-red-500 text-2xl font-bold">
          Payment Verification Failed
        </h1>
        <p className="text-zinc-400 text-sm">We couldn't verify your session. Please check your dashboard.</p>
        <Button
          variant="secondary"
          onClick={toDashboard}
          className="w-full bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
        >
          GO TO MY DASHBOARD
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 md:py-16 px-4">
      <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-zinc-800">
        <div className="bg-primary py-5 px-4 text-center text-white">
          <h1 className="text-lg md:text-2xl font-black tracking-wide">BOOKING CONFIRMED!</h1>
          <p className="text-xs md:text-sm opacity-90 mt-1">Get ready for your session</p>
        </div>

        <div className="p-4 md:p-6 space-y-2">
          <h2 className="text-lg md:text-xl font-bold text-zinc-400 border-b border-zinc-800 pb-3">
            Session Details
          </h2>

          {/* Table Headers */}
          <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar className="text-emerald-500 w-4 h-4 shrink-0" />
              <span className="text-zinc-400 uppercase font-semibold tracking-wider">Date</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="text-emerald-500 w-4 h-4 shrink-0" />
              <span className="text-zinc-400 uppercase font-semibold tracking-wider">Time Slot</span>
            </div>
          </div>

          {/* Mapped Sessions */}
          <div className="space-y-1">
            {payload?.sessionsToBook.map((slot, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 text-left bg-zinc-900/50 p-3 rounded-xl border border-zinc-800/60 text-xs md:text-sm">
                <p className="font-medium text-zinc-200 ">{formatDateReadable(slot.date)}</p>
                <p className="text-zinc-300 ">
                  {formatTo12Hour(slot.startTime)} - {formatTo12Hour(slot.endTime)}
                </p>
              </div>
            ))}
          </div>

          {/* Amount Paid Box */}
          <div className="p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border border-emerald-500/50 bg-emerald-500/5">
            <span className="text-zinc-400 font-medium text-sm">Amount Paid</span>
            <div className="flex items-baseline gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xs md:text-sm text-zinc-400">
                ({payload?.numberOfSessions} {payload?.numberOfSessions === 1 ? 'session' : 'sessions'})
              </span>
              <span className="text-xl md:text-2xl font-black text-emerald-500">
                {payload?.amount} {CURRENCY}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={toDashboard}
              className="w-full bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors"
            >
              GO TO MY DASHBOARD
            </Button>

            <Link
              to="/"
              className="w-full text-center py-2 text-xs md:text-sm text-zinc-400 hover:text-emerald-500 font-medium transition-colors"
            >
              Book another session
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;