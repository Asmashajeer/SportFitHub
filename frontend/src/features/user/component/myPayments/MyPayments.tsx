import {
  PAGINATION_DEFAULT_LIMIT,
  PAYMENT_STATUS,
} from '@/constants/constants';
import PaymentCard from './PaymentCard';
import { useEffect, useMemo, useState } from 'react';
import type { UserPaymentResponseData } from '../../types/user.payment.type';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import Pagination from '@/components/reusable/Pagination';

const MyPayments = () => {
  const { userPayments, fetchBookings } = useUserDashboardStore();
  const filters = ['all', ...Object.values(PAYMENT_STATUS)];
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = useMemo(() => {
    return activeFilter === 'all'
      ? userPayments
      : userPayments.filter(
          (p: UserPaymentResponseData) => p.status === activeFilter
        );
  }, [userPayments, activeFilter]);

  //for pagination
  useEffect(() => setCurrentPage(1), [activeFilter]);
  const totalPages = Math.ceil(filtered.length / PAGINATION_DEFAULT_LIMIT);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_DEFAULT_LIMIT;
    return filtered.slice(start, start + PAGINATION_DEFAULT_LIMIT);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-1">
            Payments
          </h1>
          <p className="text-sm text-zinc-500">Track all payments </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs px-4 py-2 rounded-full border transition-all duration-150 font-medium ${
                activeFilter === f
                  ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
                  : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* payment List */}
        <div className="flex flex-col gap-3">
          {paginated.length === 0 ? (
            <div className="text-center py-16 text-zinc-600 text-sm">
              No payments found
            </div>
          ) : (
            paginated.map((payment) => (
              <>
                <PaymentCard key={payment.id} payment={payment} />
              </>
            ))
          )}
        </div>
      </div>
      {/* Pagination */}

      <Pagination
        totalPages={totalPages}
        ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
        currentPage={currentPage}
        totalCount={filtered.length}
        setCurrentPage={setCurrentPage}
        label={'Payments'}
      />
    </div>
  );
};

export default MyPayments;
