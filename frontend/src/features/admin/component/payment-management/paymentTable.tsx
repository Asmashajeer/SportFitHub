
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { formatDateDDMMYY } from '@/utils/formatDate';
import type { AdminPaymentResponseData } from '../../store/types/payment.types';
import { PaymentsManagementService } from '../../service/paymentsManagementService ';
import { CURRENCY, PAGINATION_DEFAULT_LIMIT, PAYMENT_STATUS, type PaymentStatus } from '@/constants/constants';
import { format } from 'date-fns';
import {  CalendarIcon, Search } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import Pagination from '@/components/reusable/Pagination';

interface PaymentDataState {
  payments:  AdminPaymentResponseData[];
  totalPages: number;
  total: number;
  page: number;
}

const PaymentsTable = () => {
   const [paymentData, setPaymentData] = useState<PaymentDataState>({
      payments: [],
      totalPages: 0,
      total: 0,
      page: 1,
    });
  const [search, setSearch] = useState('');
   const [filters, setFilters] = useState({      
      date: '',
      status: PAYMENT_STATUS.SUCCESS,
    }); 
  const [currentPage, setCurrentPage] = useState(1); 

  type PaymentStatusKey = PaymentStatus

  const STATUS_BADGE: Record<PaymentStatusKey, string> = {
   refunded:   'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    succeeded: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    requires_action: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    failed: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };
 
  useEffect(() => {
    const getPayments = async () => {
      console.log(search);
      try {
        const data = await PaymentsManagementService.getPayments( 
          {  page: currentPage,
            limit: PAGINATION_DEFAULT_LIMIT,
            search,
            ...filters,            
          });
        console.log(data);
        setPaymentData(data);
        setCurrentPage(paymentData.page);
      } catch (err) {
        toast.error(err?.toString() || 'Failed to fetch payments');
      }
    };
    getPayments();
  }, [currentPage,search,filters]);

  const thCls =
    'px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap';
  const tdCls = 'px-4 py-3 text-sm whitespace-nowrap';

  return (
    <div className="flex flex-col gap-4"> 
      <div className="flex gap-2 flex-wrap mb-6">
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
              placeholder="method, session, trainer..."
              className="text-xs pl-8 pr-3 py-1.5 rounded-lg border border-zinc-700 bg-zinc-800/40 text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 w-56"
            />
          </div>
        </div>
        <button
          onClick={() =>
            setFilters({             
              date: '',
              status: PAYMENT_STATUS.SUCCESS
            })
          }
          className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
            filters.date === '' &&search === ""
              ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
              : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
          }`}
        >
          All
        </button>      
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors">
              <CalendarIcon className="w-3 h-3" />
              {filters.date
                ? format(new Date(filters.date), 'dd MMM yyyy')
                : 'Pick a date'}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.date ? new Date(filters.date) : new Date()}
              onSelect={(d) => {
                // setDate(d);
                setFilters((prev) => ({
                  ...prev,
                  date: d ? format(d, 'yyyy-MM-dd') : '',
                }));
              }}
              disabled={(d) => d >new Date(new Date().setHours(0, 0, 0, 0))} // disable future dates
            />
          </PopoverContent>
        </Popover>

        {/* Clear button */}
        {filters.date && (
          <button
            onClick={() => {
              setFilters((prev) => ({ ...prev, date: '' }));
            }}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Clear
          </button>
        )}
      </div>   
      {/* Table */}
      <div className="rounded-xl border border-zinc-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-800/60">
             <tr>
                <th className={thCls}>Booking ID</th>
                <th className={thCls}>Transaction ID</th>
                <th className={thCls}>Amount</th>
                <th className={thCls}>Payment Method</th>
                {/* <th className={thCls}>Discount</th> */}
                <th className={thCls}>Status</th>
                <th className={thCls}>Paid On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/40">
              {!paymentData.payments ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center text-zinc-600 text-sm">
                    No payments found
                  </td>
                </tr>
              ) : (
                paymentData.payments.map((payment) => (
                  <tr
                    key={payment.id ?? payment.transactionId}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    <td className={tdCls}>
                      <span className="text-zinc-500 font-mono text-xs">
                        #{payment.bookingUID}
                      </span>
                    </td>

                    <td className={tdCls}>
                      <p className="text-zinc-200 font-mono text-xs">{payment.transactionId}</p>
                    </td>

                    <td className={tdCls}>
                      <span className="text-zinc-400">
                        { payment.amount} {CURRENCY}
                      </span>
                    </td>

                    <td className={tdCls}>
                      <span className="text-zinc-400">{payment.paymentMethod}</span>
                    </td>

                    {/* <td className={tdCls}>
                      <span className="text-zinc-400">
                        {payment.discount?.amountOff
                          ? `-${ payment.discount.amountOff} {CURRENCY}`
                          : '—'}
                      </span>
                    </td> */}

                    <td className={tdCls}>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          STATUS_BADGE[payment.status as PaymentStatusKey] ?? STATUS_BADGE.succeeded
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>

                    <td className={tdCls}>
                      <span className="text-zinc-500">{formatDateDDMMYY(payment.createdAt)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
          {/* Pagination */}
                <Pagination
                  totalPages={paymentData.totalPages}
                  ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
                  currentPage={paymentData.page}
                  totalCount={paymentData.total}
                  setCurrentPage={setCurrentPage}
                  label="Payments"
                />
       

     
      </div>
    </div>
  );
};

export default PaymentsTable;
