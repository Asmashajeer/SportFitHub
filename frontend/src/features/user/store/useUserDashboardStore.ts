import { create } from 'zustand';
import type {
  UserBookedSessionsResponseData,
  UserBookingResponseData,
} from '../types/user.booking.types';
import BookingService from '@/features/booking/service/bookingService';
import toast from 'react-hot-toast';
import PaymentService from '@/features/booking/service/paymentService';
import type { UserPaymentResponseData } from '../types/user.payment.type';
import { WalletService } from '../service/walletService';
import type { WalletTransactionResponseData } from '../types/user.wallet.types';

interface UserDashboardState {
  userSessions: UserBookedSessionsResponseData[];
  userBookings: UserBookingResponseData[];
  userPayments: UserPaymentResponseData[];
  isLoading: boolean;
  myBalance: number;
  transactions: WalletTransactionResponseData[];
  fetchBookings: () => Promise<void>;
  fetchWallet: () => Promise<void>;
}

export const useUserDashboardStore = create<UserDashboardState>((set) => ({
  userSessions: [],
  userBookings: [],
  userPayments: [],
  isLoading: false,
  myBalance: 0,
  transactions: [],

  fetchBookings: async () => {
    set({ isLoading: true });
    try {
      const [bookings, sessions, payments] = await Promise.all([
        BookingService.getMyBookings(),
        BookingService.getMySessions(),
        PaymentService.getUserPayments(),
      ]);
      set({
        userSessions: sessions,
        userBookings: bookings,
        userPayments: payments,
        isLoading: false,
      });
    } catch (error) {
      set({ isLoading: false });
      toast.error(error?.toString() || 'Failed to load your sessions:');
    }
  },
  fetchWallet: async () => {
    set({ isLoading: true });
    try {
      const [wallet, transactions] = await Promise.all([
        WalletService.getBalance(),
        WalletService.getWalletTransactions(),
      ]);
      set({ myBalance: wallet.balance, transactions: transactions });
    } catch (error) {
      set({ isLoading: false });
      toast.error(
        error?.toString() || 'Failed to fetch balance and transactions'
      );
    }
  },
}));
