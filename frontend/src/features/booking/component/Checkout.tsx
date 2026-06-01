import { useEffect, useState } from 'react';
import OrderSummary from './OrderSummary';
import { sessionService } from '@/features/session/service/sessionService';
import type { FitnessSessionDetailedPublicResponseData } from '@/features/session/store/fitness.session.types';
import type { SportsSessionDetailedPublicResponseData } from '@/features/session/store/session.types';
import type { BookingSlot, DisplayData } from '../store/payment.types';
import { useBookingStore } from '../store/useBookingStore';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import BookingService from '../service/bookingService';
import { Button } from '@/components/ui/button';

import { ArrowLeft, Info } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { formatDateDDMMYY, formatTo12Hour } from '@/utils/formatDate';

import { useCheckAvailability } from '@/hooks/useCheckAvailability';
import { PAYLOAD_MODEL } from '@/constants/constants';
import ToastInfo from '@/components/reusable/ToastInfo';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = useBookingStore((state) => state.payload);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { user } = useAuthStore();
  const [session, setSession] = useState<
    | SportsSessionDetailedPublicResponseData
    | FitnessSessionDetailedPublicResponseData
    | null
  >(null);
  const [displayData, setDisplayData] = useState<DisplayData | null>(null);

  const [bookingSlots, setBookingSlots] = useState<BookingSlot[] | null>(null);
  const { checkAvailability, isChecking } = useCheckAvailability();
  const fallback =
    payload?.sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? '/sports' : '/fitness';
  const redirectTarget = location.state?.from || fallback;

  useEffect(() => {
    if (!payload) return;
    console.log(payload);
    const selectedSlots: BookingSlot[] = payload.sessionsToBook.map((slot) => ({
      sessionId: payload?.sessionId,
      slotId: slot.slotId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
      maxCapacity: session?.maxCapacity || 1,
    }));

    setBookingSlots(selectedSlots);
  }, []);
  
  useEffect(() => {
    const isAvailable = async () => {
      if (bookingSlots && payload) {
        const { occupiedSlots } = await checkAvailability(bookingSlots);
          console.log('occupaidSlots :',occupiedSlots);
        if (occupiedSlots.length > 0) {
          const occupiedSummary = occupiedSlots
            .map(
              (slot) =>
                formatDateDDMMYY(slot.date) +
                ' [ ' +
                (formatTo12Hour(slot.startTime).toString() +
                  ' - ' +
                  formatTo12Hour(slot.endTime).toString()) +
                ' ] '
            ) 
            .join(', ');
           console.log(" slots already occupied.",occupiedSummary) ;
          toast.custom(
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-blue-950 text-blue-400 border-blue-800 text-sm">
                <Info className="w-4 h-4 shrink-0" />
                <span>{occupiedSummary} slots already occupied. Please select New slots.</span>
              </div>
            );
            
          navigate(redirectTarget, { replace: true });
        }
        const filter = {
          id: payload.sessionId,
          sessionModel: payload.sessionModel,
        };
        console.log("filter :",filter)
        try {
          const { session } =
            await sessionService.getSessionDetailsfiltered(filter);
          setSession(session);
          setDisplayData({
            name: session.sessionName,
            venue: payload.venue,
            price: payload.amount,
            sessions: payload.numberOfSessions,
            bookingSlots: bookingSlots,
          });
        } catch (error) {
          toast.error('Failed to load session details.');
          navigate(redirectTarget, { replace: true });
        }
      }
    };

    isAvailable();
  }, [payload, bookingSlots]);

  

  const handleCheckout = async () => {
    if (!payload || !user) return;
    if (bookingSlots) {
      const { occupiedSlots } = await checkAvailability(bookingSlots);
      if (occupiedSlots.length > 0) {
        const occupiedSummary = occupiedSlots
          .map(
            (slot) =>
              formatDateDDMMYY(slot.date) +
              '[' +
              (formatTo12Hour(slot.startTime).toString() +
                '-' +
                formatTo12Hour(slot.endTime).toString()) +
              ']'
          ) // Use your helper function
          .join(', ');
        toast.custom(
          `${occupiedSlots.length} of slots already occupied ${occupiedSummary}.so please select new slots`
        );
        navigate(redirectTarget, { replace: true });
      }
      setIsRedirecting(true);
      try {
        // stripe Checlkout session
        const data = await BookingService.createCheckoutSession(payload);
        //  The backend  return { url: "https://checkout.stripe.com/..." }
        if (data?.url) {
          console.log(data?.url);
          window.location.href = data.url;
        } else {
          throw new Error('No redirect URL received');
        }
      } catch (err) {
        toast.error(
          err?.toString() || 'Payment initialization failed. Please try again.'
        );
        setIsRedirecting(false);
      }
    }
  };

  if (!payload || isChecking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        <p className="mt-4 opacity-70">Loading your booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* LEFT: ORDER SUMMARY (Kept the same for branding) */}
      {session && displayData ? (
        <>
          <div>
            <OrderSummary data={displayData} image={session.images[0]} />
            <Button
              variant="secondary"
              onClick={() => {
                const target =
                  location?.state?.from ||
                  (payload?.sessionModel === PAYLOAD_MODEL.SPORT_SESSION
                    ? '/sports'
                    : '/fitness') ||
                  '/';
                navigate(target);
              }}
              className="my-4 w-full hover:bg-primary"
            >
              <ArrowLeft />
              Back to session page
            </Button>
          </div>
          <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl flex flex-col justify-center items-center text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              Complete Your Booking
            </h2>
            <p className="text-gray-400 mb-8">
              You will be redirected to Stripe's secure payment page to complete
              your transaction with Card or UPI.
            </p>

            <button
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isRedirecting ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  Redirecting...
                </>
              ) : (
                'Proceed to Secure Payment'
              )}
            </button>

            <div className="mt-6 flex gap-4 opacity-50 grayscale">
              {/* Visual trust indicators */}
              <span className="text-xs text-white">🔒 SSL Secured</span>
              <span className="text-xs text-white">💳 Stripe Verified</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center p-10">
          <h2 className="text-xl font-bold">Booking Session Expired</h2>
          <p className="text-gray-600 mb-4">
            For your security and to keep court timings accurate, sessions
            expire after a period of inactivity.
          </p>
          <Button
            onClick={() => {
              const target =
                location?.state?.from ||
                (payload?.sessionModel === PAYLOAD_MODEL.SPORT_SESSION
                  ? '/sports'
                  : '/fitness') ||
                '/';
              navigate(target);
            }}
          >
            Select Slot Again
          </Button>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
