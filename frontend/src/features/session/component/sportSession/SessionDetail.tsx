import { useParams, useNavigate } from 'react-router-dom';
import { getDay, parse } from 'date-fns';
import { Clock, MapPin, Users, Shield, ArrowLeft, Share2, Heart, CheckCircle2, Trophy, Star } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { lazy, Suspense, useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/reusable/LoadingScreen';
import { sportSessionService } from '../../service/sportSessionService';
import toast from 'react-hot-toast';
import type { ISlots, PricePlan, Pricing, SportsSessionDetailedPublicResponseData, TimeSlot } from '../../store/session.types';
import { BOOKING_TYPE, PAYLOAD_MODEL, Review_Type, ROLES } from '@/constants/constants';
import GetMapsLink from '@/components/reusable/GetMapsLink';

import 'react-day-picker/style.css';
import StickyBookingBar from '../StickyBookingBar';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

import { useBookingStore } from '@/features/booking/store/useBookingStore';

import ImageCarousel from '@/components/reusable/ImageCarousel';
import TimeSlotPicker from '../TimeSlotPicker';
import BookingService from '@/features/booking/service/bookingService';
import type { IBookedSlot } from '@/features/user/types/user.booking.types';
import type { BookingSlot, Payload } from '@/features/booking/store/payment.types';
import { useCheckAvailability } from '@/hooks/useCheckAvailability';
import { reviewService } from '@/features/review/service/reviewService';
import MapSkeleton from '@/components/reusable/MapSkeleton';
import ReviewsSkeleton from '@/components/reusable/ReviewsSkeleton';
const MapView = lazy(() => import('@/components/reusable/MapView'));
const ChatDrawer = lazy(() => import('@/features/chat/component/ChatDrawer'));
const SessionReviews = lazy(() => import('@/features/review/components/session/SessionReviews'));

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();

  const [ratingReview, setRatingReview] = useState({ avgRating: 0, reviewCount: 0 });

  const { user, isAuthenticated, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [session, setSession] = useState<SportsSessionDetailedPublicResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [offDays, setOffDays] = useState<number[]>([]);
  const [filledDates, setFilledDates] = useState<Date[]>([]);
  const [occupiedSlots, setOccupiedSlots] = useState<BookingSlot[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[] | undefined>();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<ISlots | null>(null);
  const [pricePlan, setPricePlan] = useState<Pricing | null>(null);
  const [bookingSlots, setBookingSlots] = useState<IBookedSlot[]>([]);
  const [isReadyToBook, setIsReadyToBook] = useState(false);
  const { setPayload } = useBookingStore();
  const { checkAvailability } = useCheckAvailability();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await sportSessionService.getSessionById(sessionId!);
        setSession(data.session);

        if (data.session && data.session.timeSlots) {
          const availableDays = data.session.timeSlots.map((slot: TimeSlot) => slot.day.toLowerCase());
          const offdays = [0, 1, 2, 3, 4, 5, 6].filter((i) => !availableDays.map((d: string) => getDay(parse(d, 'eeee', new Date()))).includes(i));
          setOffDays(offdays);
          if (data.session && sessionId) {
            const bookings = await BookingService.getBookedSlots(sessionId);
            const bookedSlots = bookings.map((b: BookingSlot) => ({ ...b, maxCapacity: data.session.maxCapacity }));
            const { occupiedSlots } = await checkAvailability(bookedSlots);
            setOccupiedSlots(occupiedSlots);
            //Group occupied slots by date
            const occupiedByDate = occupiedSlots.reduce((acc: Record<string, number>, slot: IBookedSlot) => {
              const dateKey = new Date(slot.date).toDateString();
              acc[dateKey] = (acc[dateKey] || 0) + 1;
              return acc;
            }, {});

            //  Get total slots per day from session timeSlots
            const totalSlotsPerDay = data.session.timeSlots.reduce((acc: Record<string, number>, timeSlot: TimeSlot) => {
              timeSlot.slots.forEach(() => {
                acc[timeSlot.day] = (acc[timeSlot.day] || 0) + 1;
              });
              return acc;
            }, {});

            //   fully filled if ALL slots in that day are occupied
            const fullyFilledDates = Object.entries(occupiedByDate)
              .filter(([dateKey, occupiedCount]) => {
                const date = new Date(dateKey);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
                const totalSlots = totalSlotsPerDay[dayName] || 0;
                return occupiedCount >= totalSlots; // all slots filled
              })
              .map(([dateKey]) => new Date(dateKey));

            setFilledDates(fullyFilledDates);
          }
        }
      } catch (error) {
        toast.error(error?.toString() || 'Failed to load session');
        console.log(error?.toString());
      } finally {
        setLoading(false);
      }
    };
    const getRating = async () => {
      try {
        if (!sessionId) return;
        const ratingData = await reviewService.getAvgRatingAndCount(sessionId, Review_Type.SPORTS_SESSION);
        setRatingReview({ avgRating: ratingData.averageRating, reviewCount: ratingData.totalReviews });
      } catch (err) {
        console.error('Failed to fetch rating:', err);
      }
    };
    if (sessionId) {
      fetchSession();
      getRating();
    }
  }, [sessionId]);

  useEffect(() => {
    if (pricePlan) {
      if (pricePlan?.sessionCount > 1 && bookingSlots.length === pricePlan.sessionCount) {
        setIsReadyToBook(true);
      } else if (selectedDate && selectedSlot) {
        setIsReadyToBook(true);
      }
    } else setIsReadyToBook(false);
    console.log('isReadyToBook', isReadyToBook);
  }, [selectedDate, selectedDates, selectedSlot, pricePlan, bookingSlots]);

  const handleBooking = async () => {
    if (!session || !isReadyToBook) {
      toast.custom('Select Date, Timeslot and Price plan to book');
      return;
    }
    if (user && user.activeRole === ROLES.TRAINER) {
      toast.error('Trainers cannot book sessions. Switch to a user account to make bookings');
      return;
    }
    const bookingData: Payload = {
      sessionId: session.id,
      sessionTimezone: session.timezone,
      trainerId: session.trainer.id,
      sessionModel: PAYLOAD_MODEL.SPORT_SESSION,
      bookingType: pricePlan?.sessionCount! > 1 ? BOOKING_TYPE.MULTIPLE : BOOKING_TYPE.SINGLE,
      venue: { name: session.venue.name, address: session.venue.address, location: session.venue.location },
      planId: pricePlan?._id!,
      numberOfSessions: pricePlan?.sessionCount!,
      amount: pricePlan?.price!,
      sessionsToBook:
        pricePlan?.sessionCount! > 1
          ? bookingSlots
          : [
              {
                date: selectedDate!.toString(),
                slotId: selectedSlot?._id!,
                startTime: selectedSlot?.startTime!,
                endTime: selectedSlot?.endTime!,
              },
            ],
    };
    setPayload(bookingData);
    if (!user || !isAuthenticated) {
      navigate('/login', {
        state: {
          from: window.location.pathname,
        },
      });
      return;
    }
    const userInfo = {
      userId: user?.id,
      name: user?.name,
      email: user?.email,
    };
    setPayload({ user: userInfo, ...bookingData });
    console.log('  bookingData---', bookingData);
    const isDuplicateBooking = await alreadybookedthisDateAndTime(bookingData.sessionId, bookingData.sessionsToBook, bookingData.sessionTimezone);
    if (isDuplicateBooking) {
      toast.error(isDuplicateBooking);
      return;
    }
    navigate('/checkout', {
      state: { from: location.pathname },
      replace: true,
    });
  };

  if (loading) <LoadingScreen />;
  if (!session) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-black italic uppercase text-white mb-4">Session Not Found</h2>
        <p className="text-zinc-500 mb-8">The session intel you're looking for has expired or moved.</p>
        <Button onClick={() => navigate('/sports')} className="bg-emerald-500 text-gray-400 font-bold">
          Back to Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30">
      {/* STICKY NAVIGATION */}
      <nav className="sticky top-16 z-40 bg-transparent backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group">
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-tighter">Back</span>
        </button>
        <div className="flex gap-4">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-full border border-zinc-800 transition-all ${isFavorite ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-zinc-400 hover:text-white'}`}
          >
            <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button className="p-2 rounded-full border border-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <Share2 size={20} />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl  px-4 sm:px-6 py-6 sm:py-10 space-y-8 sm:space-y-12">
        <h1 className="text-2xl sm:text-2xl lg:text-3xl font-black  uppercase tracking-tighter leading-none text-white">{session.sessionName}</h1>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Main Image / Banner */}
          <div className="lg:col-span-8">
            <div className="relative h-64 sm:h-80 lg:h-96 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-900">
              <ImageCarousel images={session.images} />
              <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex gap-2 sm:gap-3 flex-wrap">
                <Badge className="bg-emerald-500 text-black font-black uppercase italic px-3 sm:px-4 py-1 border-none text-[10px] sm:text-xs">
                  {session.sportCategory?.sportName} {session.sportCategory?.icon}
                </Badge>
                <Badge className="bg-zinc-950/60 backdrop-blur-md text-emerald-400 border-zinc-800 uppercase font-bold text-[10px]">{session.sessionType}</Badge>
              </div>
            </div>
          </div>

          {/* Coach / Trainer Profile Card */}
          <div className="lg:col-span-4">
            <div className="bg-zinc-900/50 p-5 sm:p-6 rounded-[2rem] border border-zinc-800 flex flex-col gap-5 group cursor-pointer hover:bg-zinc-900 transition-all">
              {/* Header: avatar + name + rating */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-full bg-zinc-800 overflow-hidden border-2 border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
                  <img src={`${session.trainer?.profilePic}?v={${new Date()}}` || '/coach-placeholder.jpg'} className="w-full h-full object-cover" alt="Coach" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Lead Coach</p>
                  <p className="font-black text-white text-lg sm:text-xl italic uppercase leading-tight truncate group-hover:text-emerald-400 transition-colors">{session.trainer?.displayName}</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4 text-sm border-y border-zinc-900 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Discipline</p>
                  <p className="font-bold text-white truncate">{session.trainer?.coreDiscipline}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Experience</p>
                  <p className="font-bold text-white">{session.trainer?.experience} Years</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">Languages</p>
                  <p className="font-bold text-white truncate">{session.trainer?.languages?.join(', ')}</p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {session.trainer?.specialties?.map((item: string, i: number) => (
                    <span key={i} className="text-[11px] font-medium text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-2 py-1 rounded-lg">
                      #{item.replace(/\s+/g, '')}
                    </span>
                  ))}
                </div>
              </div>

              {/* Chat action */}
              {!isLoading && isAuthenticated && (
                <div className="mt-auto pt-1">
                  <Suspense fallback={null}>
                    <ChatDrawer userId={session.trainer.userId} trainerName={session.trainer.displayName} contextSessionId={session.id} contextSessionModel={PAYLOAD_MODEL.SPORT_SESSION} />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* -------------DESCRIPTION + QUICK STATS ---------- */}
        <section className="space-y-4 sm:space-y-6">
          <p className="text-zinc-400 text-sm sm:text-md leading-relaxed font-medium max-w-3xl">{session.description}</p>
          <div className="flex flex-wrap bg-zinc-900 rounded-2xl gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6 text-zinc-400 border-y border-zinc-900 p-4 sm:p-8">
            <div className="flex items-center gap-2 sm:gap-3">
              <Clock size={20} className="text-emerald-500" />
              <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">{session.duration} MINS</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Users size={20} className="text-emerald-500" />
              <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">{session.ageGroup}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Trophy size={20} className="text-emerald-500" />
              <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">LIMIT: {session.maxCapacity}</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Star size={20} className="text-yellow-500" fill="currentColor" />
              <span className="font-bold text-zinc-400 tracking-tight text-sm">{ratingReview.avgRating || 'NEW'}</span>
            </div>
          </div>
        </section>

        {/* ----------------PRICE DETAILS + CALENDAR / TIME SLOTS -------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
          {/* Pricing Card */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 h-full flex flex-col bg-zinc-900 p-5 sm:p-6 rounded-[1.75rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full -mr-16 -mt-16 pointer-events-none" />

              <p className="text-[11px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-10 relative">Select Pricing Plan</p>

              <div className="space-y-3 flex-1 relative">
                {session.pricing?.map((plan: PricePlan) => (
                  <ol
                    key={plan._id}
                    className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between gap-3 bg-zinc-950/50
                    ${plan._id === pricePlan?._id ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500' : 'border-zinc-800 hover:border-zinc-700'}`}
                    onClick={() => {
                      if (plan._id) {
                        setPricePlan(plan);                       
                      }
                    }}
                  >
                    <div className="min-w-0">
                      <p className="font-black text-sm italic uppercase text-zinc-200 truncate">
                        {plan.sessionCount} Session{plan.sessionCount > 1 ? 's' : ''}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500 tracking-tighter mt-0.5">CONFIRMED ACCESS</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xl sm:text-2xl font-black tracking-tighter italic text-white leading-none">₹{plan.price}</p>
                    </div>
                  </ol>
                ))}
              </div>

              <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-[0.2em] mt-6 pt-4 border-t border-zinc-800/70 relative">Instant Confirmation • Secure Payment</p>
            </div>
          </div>

          {/* Time Slots / Calendar Availability */}
          <div id="timeSlot" className="lg:col-span-8">
            <div className="h-full bg-zinc-900 p-5 sm:p-6 rounded-[1.75rem] border border-zinc-800/50 flex flex-col gap-4">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-500">Time Slots</h3>
                <p className="text-xs text-zinc-500 mt-1">Select a date and time to continue</p>
              </div>
              <div className="flex-1">
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedDates={selectedDates}
                  setSelectedDates={setSelectedDates}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  pricePlan={pricePlan}
                  offDays={offDays}
                  session={session}
                  occupiedSlots={occupiedSlots}
                  filledDates={filledDates}
                  bookingSlots={bookingSlots}
                  setBookingSlots={setBookingSlots}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ================= ROW 3: LOCATION + AMENITIES / OTHER DETAILS ================= */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 sm:gap-8">
          <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800/50 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <Shield size={16} className="text-emerald-500" /> Amenities
            </h3>
            <div className="flex flex-wrap gap-3">
              {session.amenities?.map((item: string, i: number) => (
                <span key={i} className="flex items-center gap-2 bg-zinc-950 px-2 py-2 rounded-xl text-xs font-bold text-zinc-200 border border-zinc-800">
                  <CheckCircle2 size={14} className="text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800/50 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
              <MapPin size={16} className="text-emerald-500" /> Location
            </h3>
            <div>
              <p className="font-black italic uppercase text-xl text-white">{session.venue.name}</p>
              <p className="text-zinc-500 text-sm mt-1">{session.venue.address}</p>
            </div>
            <Suspense fallback={<MapSkeleton />}>
              <MapView lat={session.venue.location.coordinates[1]} lng={session.venue.location.coordinates[0]} label={`${session.venue.name}  ${session.venue.address}`} />
            </Suspense>
            {session.venue.location?.coordinates && <GetMapsLink coords={session.venue.location.coordinates} />}
          </div>
        </section>

        {/* Policies — full width */}
        <div className="text-xs text-zinc-400 bg-zinc-800 rounded-lg text-left p-3 space-y-2">
          <p className="text-zinc-300 text-sm font-medium mb-2">Policies</p>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">▫️ Booking Deadline</span>
            <span className="text-zinc-300">{session.bookingDeadline} hrs before</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">▫️ Cancellation Policy</span>
            <span className="text-zinc-300">{session.cancellationPolicy}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-zinc-400">▫️ Cancellation Window</span>
            <span className="text-zinc-300">{session.cancellationWindow} hrs before</span>
          </div>
        </div>

        {/* Reviews summary */}
        <div className="pt-3 border-t border-zinc-800">
          <Suspense fallback={<ReviewsSkeleton />}>
            <SessionReviews reviewableId={sessionId!} reviewableType={Review_Type.SPORTS_SESSION} />
          </Suspense>
        </div>

        <StickyBookingBar
          sessionId={session.id}
          selectedDate={selectedDate?.toString() ?? selectedDates?.[0].toString() ?? undefined}
          selectedSlot={selectedSlot}
          pricePlan={pricePlan}
          bookingSlots={bookingSlots}
          onBooking={handleBooking}
        />
      </main>
    </div>
  );
};

export default SessionDetail;

const alreadybookedthisDateAndTime = async (sessionId: string, bookingSlots: IBookedSlot[], timezone: string) => {
  const isDuplicate = await BookingService.isDuplicateBooking(sessionId, bookingSlots, timezone);
  return isDuplicate;
};
