import api from '@/api/axiosInstance';
import { PAYMENT_ROUTE } from './booking.api';

const PaymentService = {
  getUserPayments: async () => {
    const res = await api.get(PAYMENT_ROUTE.GET_MY_PAYMENTS);
    return res.data;
  },
  getInvoice: async (invoiceId: string) => {
    const res = await api.get(
      `${PAYMENT_ROUTE.GET_PAYMENT_INVOICE}/${invoiceId}`
    );
    return res.data;
  },
};

export default PaymentService;
