import { ExternalLink, Download } from 'lucide-react';
import { formatDateDDMMYY } from '@/utils/formatDate';

import { PAYMENT_STATUS } from '@/constants/constants';
import type { UserPaymentResponseData } from '../../types/user.payment.type';
import PaymentService from '@/features/booking/service/paymentService';

const statusBadge: Record<string, string> = {
  [PAYMENT_STATUS.SUCCESS]:
    'bg-teal-500/10 text-teal-400 ring-1 ring-teal-500/20',
  [PAYMENT_STATUS.FAILED]: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  [PAYMENT_STATUS.REFUND]:
    'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
  [PAYMENT_STATUS.ACTION_REQUIRED]:
    'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
};

const statusLabel: Record<string, string> = PAYMENT_STATUS;

function PaymentCard({ payment }: { payment: UserPaymentResponseData }) {
  const hasReceipt = !!payment.receiptUrl;

  const handleViewReceipt = () => {
    if (payment.receiptUrl) window.open(payment.receiptUrl, '_blank');
  };

  const handleDownload = async () => {
    if (payment.invoiceId) {
      const data = await PaymentService.getInvoice(payment.invoiceId);
      if (data.pdfUrl) window.open(data.pdfUrl, '_blank');
      return;
    }
  };

  return (
    <div className="bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-4 transition-all duration-200">
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-mono text-zinc-500">
          {payment.transactionId}
        </span>
        <span className="text-xs font-mono text-zinc-600">
          Booking: {payment.bookingId}
        </span>
        <span
          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[payment.status] ?? 'bg-zinc-700/50 text-zinc-400'}`}
        >
          {statusLabel[payment.status] ?? payment.status}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-8 gap-x-4 gap-y-3 mb-2">
        <div>
          <p className="text-xs text-zinc-500 mb-1">Amount</p>
          <p className="text-sm font-medium text-emerald-400">
            ₹ {payment.amount.toFixed(2)}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Currency</p>
          <p className="text-sm text-zinc-400">
            {payment.currency.toUpperCase()}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Method</p>
          <p className="text-sm text-zinc-400">{payment.paymentMethod}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-500 mb-1">Date</p>
          <p className="text-sm text-zinc-400">
            {formatDateDDMMYY(payment.createdAt)}
          </p>
        </div>

        {payment.discount && (
          <div className="col-span-2">
            <p className="text-xs text-zinc-500 mb-1">Discount</p>
            <p className="text-sm text-red-400">
              - ₹ {payment.discount.amountOff?.toFixed(2)}
              <span className="ml-2 text-xs text-zinc-500">
                ({payment.discount.code})
              </span>
            </p>
          </div>
        )}
        <div className="flex gap-2 col-span-2">
          {payment.invoiceId && (
            <button
              onClick={handleDownload}
              disabled={!hasReceipt}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Download className="w-3 h-3" /> Download Invoice
            </button>
          )}
          <button
            onClick={handleViewReceipt}
            disabled={!hasReceipt}
            className="flex items-center  gap-1.5 text-xs px-3 text-center rounded-lg border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ExternalLink className="w-3 h-3" /> View receipt
          </button>
        </div>
      </div>

      {/* Footer */}
      {/* <div className="flex items-center justify-between pt-3 border-t border-zinc-700/40 flex-wrap gap-2">
        <span className="text-xs font-mono text-zinc-600">Booking: {payment.bookingId}</span>
        
      </div> */}
    </div>
  );
}

export default PaymentCard;
