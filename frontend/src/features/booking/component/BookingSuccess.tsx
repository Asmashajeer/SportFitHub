import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useBookingStore } from '../store/useBookingStore';
import BookingService from '../service/bookingService';
import {
  Calendar,
  Check,
  CheckCheck,
  CheckCircle,
  CheckCircle2,
  CheckIcon,
  CheckSquare,
  Clock,
} from 'lucide-react';
import { BOOKING_STATUS } from '@/constants/constants';
import { Button } from '@/components/ui/button';
import { formatDateReadable, formatTo12Hour } from '@/utils/formatDate';

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
      <div className="p-20 text-center font-bold">Verifying Payment...</div>
    );

  if (status === 'error') {
    return (
      <div className="p-20 text-center">
        <h1 className="text-red-500 text-2xl font-bold">
          Payment Verification Failed
        </h1>
        <p>We couldn't verify your session. Please check your dashboard.</p>
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
    <div className="max-w-xl mx-auto py-16 px-4">
      <div className="  bg-card rounded-2xl shadow-xl overflow-hidden border">
        <div className="bg-primary py-6 text-center text-white">
          <h1 className="text-2xl font-black">BOOKING CONFIRMED!</h1>
          <p className="opacity-90">Get ready for your session </p>
          {/* <CheckIcon className="w-10 h-10 mx-auto mt-4 animate-pulse" /> */}
        </div>

        <div className="p-8 space-y-6">
          <h2 className="text-xl font-bold text-gray-500 border-b pb-4">
            Session Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center  justify-center">
              <Calendar className="text-emerald-500 w-4 h-4 " />
              <span className="text-sm text-gray-500 uppercase font-medium px-1">
                {' '}
                Date{' '}
              </span>
            </div>
            <div className="flex items-center justify-center ">
              <Clock className="text-emerald-500 w-4 h-4 " />
              <span className="text-sm text-gray-500 uppercase font-medium px-1">
                Time Slot{' '}
              </span>
            </div>
          </div>
          {payload?.sessionsToBook.map((slot) => (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <p className="text-sm">{formatDateReadable(slot.date)}</p>
              <p className="text-sm">
                {formatTo12Hour(slot.startTime)}-{' '}
                {formatTo12Hour(slot.endTime)}
              </p>
            </div>
          ))}
          <div className=" p-4 rounded-xl flex justify-between items-center border  border-emerald-500">
            <span className="text-gray-400 font-medium">Amount Paid</span>

            <span className="text-2xl font-black text-emerald-600/70">
              {payload?.numberOfSessions}{' '}
            </span>

            <span className="text-2xl font-black text-primary">
              {payload?.amount}/-
            </span>
          </div>

          <div className="pt-6 flex flex-col gap-3">
            <Button
              variant="secondary"
              onClick={toDashboard}
              className="w-full bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
            >
              GO TO MY DASHBOARD
            </Button>

            <Link
              to="/"
              className="w-full text-center py-2 text-gray-500 hover:text-emerald-600 font-medium"
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
