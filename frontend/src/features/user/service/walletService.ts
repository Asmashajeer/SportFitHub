import api from '@/api/axiosInstance';
import { WALLET_ROUTES } from './user.api';

export const WalletService = {
  getBalance: async () => {
    const res = await api.get(WALLET_ROUTES.GET_BALANCE);
    return res.data;
  },
  getWalletTransactions: async () => {
    const res = await api.get(WALLET_ROUTES.GET_WALLET_TRANSACTIONS);
    return res.data;
  },
};
