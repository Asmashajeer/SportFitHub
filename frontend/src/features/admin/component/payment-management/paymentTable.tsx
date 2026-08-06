
import { useEffect, useState } from 'react';

import toast from 'react-hot-toast';



import { formatDateDDMMYY } from '@/utils/formatDate';

import type { AdminPaymentResponseData } from '../../store/types/payment.types';
import { PaymentsManagementService } from '../../service/paymentsManagementService ';


const PaymentsTable = () => {
  const [payments, setPayments] = useState< AdminPaymentResponseData[]|null>( ); 
  type PaymentStatusKey = 'requires_action' | 'succeeded' | 'refunded' | 'failed';

  const STATUS_BADGE: Record<PaymentStatusKey, string> = {
   refunded:   'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20',
    succeeded: 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20',
    requires_action: 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20',
    failed: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',
  };

 
  useEffect(() => {
    const getPayments = async () => {
      try {
        const data = await PaymentsManagementService.getPayments( );
        console.log(data);
        setPayments(data);
      } catch (err) {
        toast.error(err?.toString() || 'Failed to fetch payments');
      }
    };
    getPayments();
  }, []);

 

//   const filterBtn = (active: boolean) =>
//     `text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
//       active
//         ? 'bg-zinc-100 text-zinc-900 border-zinc-100'
//         : 'bg-transparent text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-300'
//     }`;

  const thCls =
    'px-4 py-3 text-left text-xs font-medium text-zinc-500 uppercase tracking-wider whitespace-nowrap';
  const tdCls = 'px-4 py-3 text-sm whitespace-nowrap';

  return (
    <div className="flex flex-col gap-4">     
     

      {/* Table */}
      <div className="rounded-xl border border-zinc-700/40 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-zinc-800/60">
              <tr>
                
                {/* <th className={thCls}>ID</th> */}
                <th className={thCls}>Booking ID</th>
                {/* <th className={thCls}>userId</th>                */}
                <th className={thCls}>transactionId</th>
                <th className={thCls}>amount</th>
                <th className={thCls}>paymentMethod</th>
                <th className={thCls}>Discount</th>
                <th className={thCls}>Status</th>
                <th className={thCls}>Paid On</th>
                
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-700/40">
              {!payments ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center text-zinc-600 text-sm">
                    No payments found
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="hover:bg-zinc-800/40 transition-colors"
                  >
                    {/* payment ID */}
                    <td className={tdCls}>
                      <span className="text-zinc-500 font-mono text-xs">
                        #{payment.bookingUID}
                      </span>
                    </td>

                    {/* user */}
                    {/* <td className={tdCls}>
                      <p className="font-medium text-zinc-100">{payment.userId}</p>
                      <p className="text-xs text-zinc-500">{payment.userEmail}</p>
                    </td> */}

                    {/* Session */}
                    <td className={tdCls}>
                      <p className="text-zinc-200">{payment.transactionId}</p>
                      {/* <p className="text-zinc-400">()</p> */}
                    </td>
                    <td className={tdCls}>
                      <span className="text-zinc-400">{payment.amount}</span>
                    </td>
                    
                    <td className={tdCls}>
                      <span className="text-zinc-400">{payment.paymentMethod}</span>
                    </td>

                 

                    {/* Model */}
                    <td className={tdCls}>
                      <span className="text-zinc-400 ">{payment.discount?.amountOff ? payment.discount.amountOff:0}</span>
                    </td>

           

                    {/* Status */}
                    <td className={tdCls}>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          STATUS_BADGE[payment.status as PaymentStatusKey] ?? STATUS_BADGE.succeeded
                        }`}
                      >
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>

                    {/* Booked On */}
                    <td className={tdCls}>
                      <span className="text-zinc-500">
                        {formatDateDDMMYY(payment.createdAt)}
                      </span>
                    </td>

                    {/* Actions */}
                   
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

       

     
        </div>
    </div>
  );
};

export default PaymentsTable;
