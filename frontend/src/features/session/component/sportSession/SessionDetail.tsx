import { useParams, useNavigate } from 'react-router-dom';
import { getDay, parse } from 'date-fns';
import {
  Clock,
  MapPin,
  Users,
  Shield,
  ArrowLeft,
  Share2,
  Heart,
  CheckCircle2,
  Trophy,
  Star,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';

import { LoadingScreen } from '@/components/reusable/LoadingScreen';
import { sportSessionService } from '../../service/sportSessionService';
import toast from 'react-hot-toast';
import type {
  ISlots,
  PricePlan,
  Pricing,
  SportsSessionDetailedPublicResponseData,
  TimeSlot,
} from '../../store/session.types';
import {
  BOOKING_TYPE,
  PAYLOAD_MODEL,
  ROLES,
  SESSION_MODE,
} from '@/constants/constants';
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
import { MapView } from '@/components/reusable/MapView';

import { useCheckAvailability } from '@/hooks/useCheckAvailability';

const SessionDetail = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [session, setSession] =    useState<SportsSessionDetailedPublicResponseData | null>(null);
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
    const fetchSession = async () => {
      try {
        const data = await sportSessionService.getSessionById(sessionId!);
        setSession(data.session);
        if (data.session && data.session.timeSlots) {
          const availableDays = data.session.timeSlots.map((slot: TimeSlot) =>
            slot.day.toLowerCase()
          );
          const offdays = [0, 1, 2, 3, 4, 5, 6].filter(
            (i) =>
              !availableDays
                .map((d: string) => getDay(parse(d, 'eeee', new Date())))
                .includes(i)
          );
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
              }).map(([dateKey]) => new Date(dateKey));
            
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

    if (sessionId) fetchSession();
  }, [sessionId]);

  useEffect(() => {
    if (pricePlan) {
      if (
        pricePlan?.sessionCount > 1 &&
        bookingSlots.length === pricePlan.sessionCount
      ) {
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
    if(user && user.role===ROLES.TRAINER){
      toast.error('Trainers cannot book sessions. Switch to a user account to make bookings');
      return;
   }
    const bookingData: Payload = {
      sessionId: session.id,
      sessionModel: PAYLOAD_MODEL.SPORT_SESSION,
      bookingType:
        pricePlan?.sessionCount! > 1
          ? BOOKING_TYPE.MULTIPLE
          : BOOKING_TYPE.SINGLE,
      venue: { name: session.venue.name, address: session.venue.address },
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
    const isDuplicateBooking = await alreadybookedthisDateAndTime(bookingData.sessionId, bookingData.sessionsToBook);
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
        <h2 className="text-4xl font-black italic uppercase text-white mb-4">
          Session Not Found
        </h2>
        <p className="text-zinc-500 mb-8">
          The session intel you're looking for has expired or moved.
        </p>
        <Button
          onClick={() => navigate('/sports')}
          className="bg-emerald-500 text-gray-400 font-bold"
        >
          Back to Sessions
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-emerald-500/30">

      {/* STICKY NAVIGATION */}
      <nav className="sticky top-16 z-40 bg-transparent backdrop-blur-md border-b border-zinc-900 px-4 sm:px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors group"
        >
          <ArrowLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="text-xs font-black uppercase tracking-tighter">
            Back
          </span>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-8 space-y-8 sm:space-y-12">

          {/* Main Image */}
          <section className="relative h-56 sm:h-72 md:h-80 rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-900">
            <ImageCarousel images={session.images} />
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 flex gap-2 sm:gap-3 flex-wrap">
              <Badge className="bg-emerald-500 text-black font-black uppercase italic px-3 sm:px-4 py-1 border-none text-[10px] sm:text-xs">
                {session.sportCategory?.sportName} {session.sportCategory?.icon}
              </Badge>
              <Badge className="bg-zinc-950/60 backdrop-blur-md text-emerald-400 border-zinc-800 uppercase font-bold text-[10px]">
                {session.sessionType}
              </Badge>
            </div>
            {session.mode === SESSION_MODE.ONLINE && (
              <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 gap-3 bg-emerald-500/10 border border-emerald-500/20 px-3 sm:px-4 py-2 rounded-2xl">
                <div className="relative flex h-3 w-3">
                  <span className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
                    Live Session
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-200">
                    Digital Access via Zoom/Meet
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Header Info */}
          <section className="relative space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-3xl font-black italic uppercase tracking-tighter leading-none text-white">
              {session.sessionName}
            </h1>
            <p className="text-zinc-400 text-sm sm:text-md leading-relaxed font-medium max-w-3xl">
              {session.description}
            </p>
            <div className="flex flex-wrap bg-zinc-900 rounded-- gap-x-6 sm:gap-x-10 gap-y-4 sm:gap-y-6 text-zinc-400 border-y border-zinc-900 p-4 sm:p-8">
              <div className="flex items-center gap-2 sm:gap-3">
                <Clock size={20} className="text-emerald-500" />
                <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">
                  {session.duration} MINS
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Users size={20} className="text-emerald-500" />
                <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">
                  {session.ageGroup}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Trophy size={20} className="text-emerald-500" />
                <span className="font-bold text-zinc-400 uppercase tracking-tight text-sm">
                  LIMIT: {session.maxCapacity}
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <Star size={20} className="text-yellow-500" fill="currentColor" />
                <span className="font-bold text-zinc-400 tracking-tight text-sm">
                  {session.rating || 'NEW'}
                </span>
              </div>
            </div>
          </section>

          {/* Time Slots */}
          <section id="timeSlot" className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-500">
              Time slots
            </h3>
            <p className="text-xs left-0 text-gray-500">Select Date and Time</p>
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
          </section>

          {/* Amenities & Venue */}
          {session.mode === SESSION_MODE.OFFLINE && (
            <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-6 sm:gap-8">
              <div className="bg-zinc-900 p-5 rounded-[2rem] border border-zinc-800/50 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 flex items-center gap-2">
                  <Shield size={16} className="text-emerald-500" /> Amenities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {session.amenities?.map((item: string, i: number) => (
                    <span
                      key={i}
                      className="flex items-center gap-2 bg-zinc-950 px-2 py-2 rounded-xl text-xs font-bold text-zinc-200 border border-zinc-800"
                    >
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
                  <p className="font-black italic uppercase text-xl text-white">
                    {session.venue?.name}
                  </p>
                  <p className="text-zinc-500 text-sm mt-1">
                    {session.venue?.address}
                  </p>
                </div>
                <MapView
                  lat={session.venue.location.coordinates[1]}
                  lng={session.venue.location.coordinates[0]}
                  label={`${session.venue.name}  ${session.venue.address}`}
                />
                {session.venue?.location?.coordinates && (
                  <GetMapsLink coords={session.venue.location.coordinates} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — shown below left on mobile, sticky on desktop */}
        <div className="lg:col-span-4 order-first lg:order-0">
          <div className="lg:sticky lg:top-28 space-y-6">

            {/* Pricing Card */}
            <div className="bg-zinc-900 p-6 sm:p-8 rounded-[2.5rem] border border-zinc-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full -mr-16 -mt-16" />
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em] mb-6">
                Select Pricing Plan
              </p>
              <div className="space-y-4 mb-10">
                {session.pricing?.map((plan: PricePlan) => (
                  <ol
                    key={plan._id}
                    className={`p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex justify-between items-center bg-zinc-950/50 
                    ${plan._id === pricePlan?._id
                        ? 'border-emerald-500 bg-emerald-500/5 ring-1 ring-emerald-500'
                        : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    onClick={() => {
                      if (plan._id) {
                        setPricePlan(plan);
                        document.getElementById('timeSlot')?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                  >
                    <div>
                      <p className="font-black text-md italic uppercase text-zinc-300">
                        {plan.sessionCount} Session{plan.sessionCount > 1 ? 's' : ''}
                      </p>
                      <p className="text-[10px] font-bold text-zinc-500 tracking-tighter">
                        CONFIRMED ACCESS
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black tracking-tighter italic text-white">
                        ₹{plan.price}
                      </p>
                    </div>
                  </ol>
                ))}
              </div>
              <p className="text-[9px] text-center text-zinc-600 font-bold uppercase tracking-[0.2em] mt-6">
                Instant Confirmation • Secure Payment
              </p>
            </div>

            {/* Coach Profile Card */}
            <div className="bg-zinc-900/50 p-5 sm:p-6 rounded-[2rem] border border-zinc-800 flex-col items-center gap-4 group cursor-pointer hover:bg-zinc-900 transition-all">
              <div className="flex-col m-1">
                <div className="h-16 w-24 justify-center mx-auto rounded-2xl bg-zinc-800 overflow-hidden border border-zinc-700 group-hover:border-emerald-500/50 transition-colors">
                  <img
                    src={session.trainer?.profilePic || '/coach-placeholder.jpg'}
                    className="w-full h-full object-cover"
                    alt="Coach"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                    Lead Coach
                  </p>
                  <p className="font-black text-white text-xl italic uppercase group-hover:text-emerald-400 transition-colors">
                    {session.trainer?.displayName}
                  </p>
                </div>
              </div>
              <div className="space-y-6 text-sm">
                <div className="flex justify-between border-b border-zinc-900 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Discipline</p>
                    <p className="font-bold text-white">{session.trainer?.coreDiscipline}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Experience</p>
                    <p className="font-bold text-white">{session.trainer?.experience} Years</p>
                  </div>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Rating</p>
                    <p className="font-bold text-emerald-500">★ {session.trainer?.averageRating || 'New'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500">Languages</p>
                    <p className="font-bold text-white">{session.trainer?.languages?.join(', ')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {session.trainer?.specialties?.map((item: string, i: number) => (
                      <span key={i} className="text-[11px] font-medium text-emerald-400">
                        #{item.replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Policies — full width */}
        <div className="col-span-1 lg:col-span-12 text-xs text-zinc-400 bg-zinc-800 rounded-lg text-left p-3 space-y-2">
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

        <StickyBookingBar
          sessionId={session.id}
          selectedDate={
            selectedDate?.toString() ??
            selectedDates?.[0].toString() ??
            undefined
          }
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

const alreadybookedthisDateAndTime = async (sessionId: string, bookingSlots: IBookedSlot[]) => {
  const isDuplicate = await BookingService.isDuplicateBooking(sessionId, bookingSlots);
  return isDuplicate;
};
