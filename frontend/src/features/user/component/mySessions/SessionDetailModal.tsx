import type { UserBookedSessionsResponseData } from '../../types/user.booking.types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sessionService } from '@/features/session/service/sessionService';
import { useEffect, useState } from 'react';
import type {
  SportsSessionDetailedPublicResponseData,
  Venue,
} from '@/features/session/store/session.types';
import type { FitnessSessionDetailedPublicResponseData } from '@/features/session/store/fitness.session.types';
import { Button } from '@/components/ui/button';
import { formatDateReadable, formatTo12Hour } from '@/utils/formatDate';

import { MapView } from '@/components/reusable/MapView';
import GetMapsLink from '@/components/reusable/GetMapsLink';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import { BOOKING_SESSION_STATUS } from '@/constants/constants';

const SessionDetailModal = ({
  userSession,
  onClose,
}: {
  userSession: UserBookedSessionsResponseData;
  onClose: () => void;
}) => {
  const [session, setSession] = useState<
    | SportsSessionDetailedPublicResponseData
    | FitnessSessionDetailedPublicResponseData
    | null
  >(null);
  const [venue, setVenue] = useState<Venue | null>(null);
  const { userBookings } = useUserDashboardStore();
  useEffect(() => {
    const filter = {
      id: userSession.sessionId,
      sessionModel: userSession.sessionModel, //sportsSession| fitnessSession
    };
    const getTrainerAndVenue = async () => {
      const { session } =
        await sessionService.getSessionDetailsfiltered(filter);
      setSession(session);

      const [currentBooking] = userBookings.filter(
        (b) => b.id === userSession.bookingId
      );
      setVenue(currentBooking.venue);
    };

    getTrainerAndVenue();
  }, []);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl! ">
        <DialogHeader>
          <DialogTitle>
            {userSession.sessionName}
            <span className="px-2 text-xs bg-black text-gray-400 border">
              {userSession.sessionType}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 text-sm">
          {/* Status Badge */}
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              userSession.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-700'
                : userSession.status === 'CANCELLED'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {userSession.status}
          </span>

          {/* Details */}
        <div className="grid grid-cols-4 gap-1 mt-3">
          <div className=" col-span-2 grid grid-cols-2 gap-3 mt-3">
            <div className=" bg-zinc-800 p-2 w-full rounded-lg">
              <p className="text-gray-400 py-2 text-xs">Date</p>
              <p className="font-medium">
                {formatDateReadable(userSession.date)}
              </p>
            </div>
            <div className=" bg-zinc-800 p-2  rounded-lg">
              <p className="text-gray-400 py-2 text-xs">Time</p>
              <p className="font-medium">
                {formatTo12Hour(userSession.startTime)} -{' '}
                {formatTo12Hour(userSession.endTime)}
              </p>
            </div>
            <div className="col-span-2 bg-zinc-800 p-2 w-full rounded-lg">
              <p className="text-gray-400 py-2 text-xs">Trainer</p>
              <p className="font-medium text-emerald-700">{session?.trainer?.displayName} </p>
              <p className=" flex gap-6 text-gray-500">
                {session?.trainer.coreDiscipline}                
              </p>
              <span className=" text-gray-500 text-xs">                 
                   {session?.trainer.experience} years Experience
                </span>
            </div>
          </div>
          <div className='col-span-2'>
            {userSession.status !== BOOKING_SESSION_STATUS.CANCELLED && (
              <div  className='bg-zinc-800 p-2 w-full rounded-lg'>
                <p className="text-gray-400 text-xs">Venue</p>
                <p className="font-medium p-1">
                  {venue?.name}{' '}
                  <span className="text-xs text-gray-500">{venue?.address}</span>
                </p>
                {venue?.location?.coordinates && (
                  <div>
                  <MapView
                    lat={venue?.location.coordinates[1] }
                    lng={venue?.location.coordinates[0] }
                    label={`${venue?.name}  ${venue?.address}`}
                  />                
                  
                    <GetMapsLink coords={venue.location.coordinates} />
                  </div>
                  )}
              </div>
            )}
            {/* Refund info if cancelled */}
            {userSession.status === BOOKING_SESSION_STATUS.CANCELLED && (
              <div className=" border-2 border-amber-900 bg-neutral-800 rounded-md p-3 mt-2">
                <p className="text-red-600 text-xs font-medium">
                  Cancellation Info
                </p>
                <p className="text-xs mt-1">
                  Reason: {userSession.cancellationReason}
                </p>
                {userSession.refundedToWallet && (
                  <p className="text-medium text-green-600 mt-1">
                    ✅
                    <span className="font-extrabold">
                      {' '}
                      ₹ {userSession.refundAmount.toFixed(2)}
                    </span>{' '}
                    refunded to wallet
                  </p>
                )}
              </div>
            )}

            {/* Rescheduled info */}
            {userSession.status === 'RESCHEDULED' && (
              <div className="bg-yellow-50 rounded-md p-3 mt-2">
                <p className="text-yellow-600 text-xs font-medium">
                  🔄 This session was rescheduled{' '}
                </p>
              </div>
            )}
           </div>
        </div>
      </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default SessionDetailModal;
