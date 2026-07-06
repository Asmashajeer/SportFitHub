import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X } from "lucide-react";
import { formatDateReadable } from "@/utils/formatDate";
import type { AdminBookingDetailData } from "../../store/types/booking.types";
import BookingOverview from "./BookingOverview";
import BookingSessions from "./BookingSessions";

interface BookingDetailModalProps {
  booking: AdminBookingDetailData;
  open: boolean;
  onClose: () => void;
}

const BookingDetailModal = ({ booking, open, onClose }: BookingDetailModalProps) => {
  if (!open) return null;

  return (   
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

      {/* Modal card */}
      <div className="relative bg-zinc-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-700/40 shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-zinc-800">
          <div className="flex flex-col gap-1">
            <h1 className="text-xl font-semibold text-zinc-100">Booking Details</h1>
            <p className="text-xs text-zinc-500">
              <span className="text-zinc-600">#ID: </span>{booking.bookingUId}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-zinc-400">{booking.sessionModel}</span>
              <span className="text-zinc-700">·</span>
              <span className="text-xs text-zinc-400">{formatDateReadable(booking.createdAt)}</span>
            </div>
            <span>
              <Badge className="mt-1 w-fit">{booking.status}</Badge>
              <Badge variant={"outline"} className="m-1  p-1 w-fit border"> {booking.pricePlan.totalSessions} Sessions</Badge>
            </span>
            
          </div>

          {/* Close button top-right */}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 rounded-lg hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="overflow-hidden">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full rounded-none bg-zinc-800/40 h-12 border-b border-zinc-800">
              <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-zinc-900">
                Overview
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex-1 data-[state=active]:bg-zinc-900">
                Sessions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <BookingOverview booking={booking} />
            </TabsContent>

            <TabsContent value="schedule" className="p-6">
              <BookingSessions sessions={booking.sessions} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-zinc-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:bg-zinc-800 transition-colors text-sm"
          >
            <X className="w-3.5 h-3.5" /> Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default BookingDetailModal;