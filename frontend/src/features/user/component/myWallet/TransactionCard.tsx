import { CURRENCY, TRANSACTION_TYPE } from '@/constants/constants';
import type { WalletTransactionResponseData } from '../../types/user.wallet.types';
import { ArrowBigDown, ChevronRight } from 'lucide-react';
import { formatDateReadable } from '@/utils/formatDate';
import { Badge } from '@/components/ui/badge';

const TransactionCard = ({
  transaction,
}: {
  transaction: WalletTransactionResponseData;
}) => {
  return (
    //    <div className="bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-3 transition-all duration-200">
    <div className="flex items-center justify-between">
      <div className="flex items-cemter gap-2 ">
        <div className="border-2 rounded-full items-center  p-2 border-zinc-500">
          <ArrowBigDown
            className={`  w-6 h-6 ${transaction.transactionType === TRANSACTION_TYPE.CREDIT ? 'text-emerald-600' : 'text-amber-700'}`}
          />
        </div>
        <div>
          <p className="text-sm text-zinc-300 mb-1">
            {transaction.walletTransactionReason}
          </p>
          <p className="text-sm font-medium text-emerald-400">
            {formatDateReadable(transaction.createdAt)}
          </p>
        </div>
      </div>
      <div className="items-cemter py-1 ">
        <Badge
          className={`text-xs  mb-1 bg-zinc-200 ${transaction.transactionType === TRANSACTION_TYPE.CREDIT ? 'text-emerald-600' : 'text-amber-700'}`}
        >
          {' '}
          {transaction.transactionType}
        </Badge>
        <p
          className={`flex items-center text-sm  ${transaction.transactionType === TRANSACTION_TYPE.CREDIT ? 'text-emerald-600' : 'text-amber-700'}`}
        >
          {CURRENCY.INR} {transaction.amount.toFixed(2)}
          <span className="">
            <ChevronRight className="w-5 h-5  text-gray-400 text-center" />{' '}
          </span>
        </p>
      </div>
    </div>
    // </div>
  );
};

export default TransactionCard;
