import {
  PAGINATION_DEFAULT_LIMIT,
  TRANSACTION_TYPE,
} from '@/constants/constants';
import MyBalanceCard from '../component/myWallet/MyBalanceCard';
import TransactionCard from '../component/myWallet/TransactionCard';
import { useEffect, useMemo, useState } from 'react';
import { useUserDashboardStore } from '../store/useUserDashboardStore';
import type { WalletTransactionResponseData } from '../types/user.wallet.types';
import Pagination from '@/components/reusable/Pagination';

import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const MyWallet = () => {
  const navigate = useNavigate();
  const { transactions, fetchWallet } = useUserDashboardStore();
  const filters = ['all', ...Object.values(TRANSACTION_TYPE)];
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] =
    useState<WalletTransactionResponseData | null>(null);
  useEffect(() => {
    fetchWallet();
  }, []);

  const filtered = useMemo(() => {
    return activeFilter === 'all'
      ? transactions
      : transactions.filter(
          (p: WalletTransactionResponseData) => p.status === activeFilter
        );
  }, [transactions, activeFilter]);

  //for pagination
  useEffect(() => setCurrentPage(1), [activeFilter]);
  const totalPages = Math.ceil(filtered.length / PAGINATION_DEFAULT_LIMIT);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGINATION_DEFAULT_LIMIT;
    return filtered.slice(start, start + PAGINATION_DEFAULT_LIMIT);
  }, [filtered, currentPage]);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-100 mb-1">My Wallet</h1>
        <p className="text-sm text-zinc-500">Track and manage your wallet </p>
      </div>
      <MyBalanceCard />

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

      {/* transactions List */}
      <div className="flex flex-col gap-3">
        {paginated.length === 0 ? (
          <div className="text-center py-16 text-zinc-600 text-sm">
            No payments found
          </div>
        ) : (
          paginated.map((transaction) => (
            <div
              className="bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-3 transition-all duration-200"
              onClick={() => setSelectedTx(transaction)}
            >
              <TransactionCard key={transaction.id} transaction={transaction} />
              {selectedTx && (
                <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between border-b text-sm">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="text-emerald-700">{transaction.id}</span>
                  </div>
                  <div className="flex justify-between text-sm border-b">
                    <span className="text-gray-400">Booking ID</span>
                    <span className="text-emerald-700">
                      {transaction.bookingId}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-b">
                    <span className="text-gray-400">Session ID :</span>
                    {/* <span className="text-emerald-700">{transaction.bookingSessionId}</span> */}
                    <Button
                      variant="secondary"
                      onClick={() =>
                        navigate('/user/my-sessions', {
                          state: {
                            bookingSessionId: transaction.bookingSessionId,
                          },
                        })
                      }
                      className="text-xs text-emerald-600 underline hover:text-white border"
                    >
                      {transaction.bookingSessionId}
                    </Button>
                  </div>
                  <div className="flex justify-between text-sm border-b">
                    <span className="text-gray-400">Status</span>
                    <span className="text-emerald-700">
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-b">
                    <span className="text-gray-400">BalanceAfter</span>
                    <span className="text-emerald-700">
                      {transaction.balanceAfter.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
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
export default MyWallet;
