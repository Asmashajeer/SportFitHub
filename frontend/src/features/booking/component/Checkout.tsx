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
import { useUserDashboardStore } from '@/features/user/store/useUserDashboardStore';

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

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('stripe');
  const { fetchWallet,myBalance } = useUserDashboardStore(); // fetch wallet balance
  
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
    fetchWallet();
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
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg border bg-blue-400 text-blue-950 border-blue-800 text-sm">
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

  

  const handleWalletBooking = async () => {
    if (!payload || !user) return;
    if (myBalance < payload.amount) {
      toast.error('Insufficient wallet balance');
      return;
    }
    if (bookingSlots) {
      const { occupiedSlots } = await checkAvailability(bookingSlots);
      if (occupiedSlots.length > 0) {
        toast.error('Some slots are already occupied');
        navigate(redirectTarget, { replace: true });
        return;
      }
      setIsRedirecting(true);
      try {
        const data = await BookingService.createBookingWithWallet(payload);
        if (data) {
          toast.success('Booking confirmed!');
          navigate('/user/my-sessions');
        }
      } catch (err) {
        toast.error(err?.toString() || 'Booking failed');
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
    <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* LEFT: ORDER SUMMARY  */}
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
              {/* RIGHT */}
          {/* <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl flex flex-col justify-center items-center text-center">
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
            
              <span className="text-xs text-white">🔒 SSL Secured</span>
              <span className="text-xs text-white">💳 Stripe Verified</span>
            </div>
          </div> */}
           <div className="bg-[#1a1a1a] rounded-2xl p-8 shadow-2xl flex flex-col justify-start items-center text-center">
      <h2 className="text-2xl font-bold text-white mb-4">
        Complete Your Booking
      </h2>

      {/* Payment method toggle */}
      <div className="flex w-full rounded-xl overflow-hidden border border-zinc-700 mb-6">
        <button
          onClick={() => setPaymentMethod('stripe')}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            paymentMethod === 'stripe'
              ? 'bg-emerald-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
          💳 Card / UPI
        </button>
        <button
          onClick={() => setPaymentMethod('wallet')}
          className={`flex-1 py-3 text-sm font-semibold transition-all ${
            paymentMethod === 'wallet'
              ? 'bg-emerald-500 text-white'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
          }`}
        >
           Wallet
        </button>
      </div>

      {/* Wallet balance info */}
      {paymentMethod === 'wallet' && (
        <div className={`w-full mb-6 p-4 rounded-xl border text-sm ${
          myBalance >= payload.amount
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          <p>Wallet Balance: <span className="font-bold">₹{myBalance ?? 0}</span></p>
          <p>Amount to pay: <span className="font-bold">₹{payload.amount}</span></p>
          {myBalance < payload.amount && (
            <p className="mt-1 text-xs">Insufficient balance. Please use card or top up wallet.</p>
          )}
        </div>
      )}

      {/* Stripe description */}
      {paymentMethod === 'stripe' && (
        <p className="text-gray-400 mb-8 text-sm">
          You will be redirected to Stripe's secure payment page to complete
          your transaction with Card or UPI.
        </p>
      )}

      {/* Action button */}
      <button
        onClick={paymentMethod === 'stripe' ? handleCheckout : handleWalletBooking}
        disabled={
          isRedirecting ||
          (paymentMethod === 'wallet' && myBalance< payload.amount)
        }
        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
      >
        {isRedirecting ? (
          <>
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
            {paymentMethod === 'wallet' ? 'Processing...' : 'Redirecting...'}
          </>
        ) : paymentMethod === 'stripe' ? (
          'Proceed to Secure Payment'
        ) : (
          'Pay with Wallet'
        )}
      </button>

      <div className="mt-6 flex gap-4 opacity-50 grayscale">
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
