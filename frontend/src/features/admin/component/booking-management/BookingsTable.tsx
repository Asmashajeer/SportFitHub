import {
    BOOKING_STATUS,

  PAGINATION_DEFAULT_LIMIT,
  PAYLOAD_MODEL,
  type BookingStatus,
} from '@/constants/constants';
import {
  Eye,
  Search,
} from 'lucide-react';
import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Pagination from '@/components/reusable/Pagination';



import { formatDateDDMMYY } from '@/utils/formatDate';
import type { AdminBookingDetailData, AdminBookingListData } from '../../store/types/booking.types';
import { BookingsManagementService } from '../../service/bookingsManagementService';
import BookingDetailModal from './BookingDetailModal';


interface BookingsDataState {
  bookings: AdminBookingListData[];
  totalPages: number;
  total: number;
  page: number;
}

const BookingsTable = () => {
  const [bookingsData, setBookingsData] = useState<BookingsDataState>({
    bookings: [],
    totalPages: 0,
    total: 0,
    page: 1,
  });

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sessionModel, setsessionModel] = useState('all');

  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingDetailData| null>(null);
  const [loading, setLoading] = useState(false);

  type BookingStatusKey =  BookingStatus

  const STATUS_BADGE: Record<BookingStatusKey, string> = {
    pending:   'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    confirmed: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    completed: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    cancelled: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { bookingsData } = await BookingsManagementService.getBookings(         
          {
            page: currentPage,
            limit: PAGINATION_DEFAULT_LIMIT,
            search,
            status: statusFilter,
            sessionModel: sessionModel,
          }
        );
        setBookingsData(bookingsData);
        setCurrentPage(bookingsData.page);
      } catch (err) {
        toast.error(err?.toString() || 'Failed to fetch bookings');
      }
    };
    getBookings();
  }, [currentPage, search, statusFilter,  refreshKey, sessionModel]);

  const handleView = async (    bookingId: string     ) => {
    setLoading(true);
    try {
      const data = await BookingsManagementService.getBookingDetail(bookingId);
      setSelectedBooking(data.booking);
    } catch (err) {
      toast.error('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const filterBtn = (active: boolean) =>
    `text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
      active
        ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
        : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
    }`;

  const thCls =
    'px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap';
  const tdCls = 'px-4 py-3 text-sm whitespace-nowrap';

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 flex-wrap items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search user, session, trainer..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
            />
          </div>

          {/* Session model filter */}
          {(['all', ...Object.values(PAYLOAD_MODEL)] as string[]).map((m) => (
            <button
              key={m}
              onClick={() => setsessionModel(m)}
              className={filterBtn(sessionModel === m)}
            >
              {m === 'all' ? 'All' : m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {/* Status filter */}
          <Select
            value={statusFilter}
            onValueChange={(value) => {
              setStatusFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 text-xs w-36 border-zinc-700 bg-zinc-800/40 text-zinc-400">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              {Object.values(BOOKING_STATUS).map((s) => (
                <SelectItem key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>         
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-800/60">
              <tr>
                <th className={thCls}>Booking ID</th>
                <th className={thCls}>user</th>
                <th className={thCls}>Session</th>               
                {/* <th className={thCls}>Type</th> */}
                <th className={thCls}>Model</th>
                <th className={thCls}>Sessions</th>
                <th className={thCls}>Amount Paid</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Booked On</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/40">
              {!bookingsData.bookings ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center text-zinc-600 text-sm">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookingsData.bookings.map((booking) => (
                  <tr
                    key={booking.bookingId}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* Booking ID */}
                    <td className={tdCls}>
                      <span className="text-zinc-500 font-mono text-xs">
                        #{booking.bookingUId}
                      </span>
                    </td>

                    {/* user */}
                    <td className={tdCls}>
                      <p className="font-medium text-zinc-100">{booking.userName}</p>
                      <p className="text-xs text-zinc-500">{booking.userEmail}</p>
                    </td>

                    {/* Session */}
                    <td className={tdCls}>
                      <p className="text-zinc-200">{booking.sessionName}</p>
                      <p className="text-zinc-400">({booking.sessionType})</p>
                    </td>

                    {/* Trainer
                    <td className={tdCls}>
                      <span className="text-zinc-400">{booking.trainerId}</span>
                    </td>

                 

                    {/* Model */}
                    <td className={tdCls}>
                      <span className="text-zinc-400 capitalize">{booking.sessionModel}</span>
                    </td>

                    {/* Sessions total */}
                    <td className={tdCls}>
                      <span className="text-zinc-300">
                    {booking.pricePlan.totalSessions}
                      </span>
                      
                    </td>

                    {/* Amount */}
                    <td className={tdCls}>
                      <span className="text-emerald-400 font-medium">
                        ₹{booking.pricePlan.pricePaid}
                      </span>
                    </td>

                    {/* Status */}
                    <td className={tdCls}>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          STATUS_BADGE[booking.status as BookingStatusKey] ?? STATUS_BADGE.pending
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>

                    {/* Booked On */}
                    <td className={tdCls}>
                      <span className="text-zinc-500">
                        {formatDateDDMMYY(booking.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleView(booking.bookingId)}
                          title="View details"
                          className="p-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200 transition-colors"
                        >
                          {loading ? (
                            <span className="w-3.5 h-3.5 block animate-spin rounded-full border border-zinc-500 border-t-transparent" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination
          totalPages={bookingsData.totalPages}
          ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
          currentPage={bookingsData.page}
          totalCount={bookingsData.total}
          setCurrentPage={setCurrentPage}
          label="Bookings"
        />
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          open={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default BookingsTable;
