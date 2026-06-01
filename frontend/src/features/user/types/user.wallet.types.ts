import type {
  TRANSACTION_REASON,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE,
} from '@/constants/constants';

export interface WalletTransactionResponseData {
  id: string;
  userId: string;
  transactionType: (typeof TRANSACTION_TYPE)[keyof typeof TRANSACTION_TYPE];
  amount: number;
  walletTransactionReason: (typeof TRANSACTION_REASON)[keyof typeof TRANSACTION_REASON];
  status: (typeof TRANSACTION_STATUS)[keyof typeof TRANSACTION_STATUS];
  description: string;
  balanceAfter: number;
  // OPTIONAL
  // when transaction is booking-related
  bookingId?: string;
  bookingSessionId?: string;
  createdAt: string;
  updatedAt: string;
}
