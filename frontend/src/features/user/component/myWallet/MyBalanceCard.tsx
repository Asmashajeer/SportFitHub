import { IdCard } from 'lucide-react';
import { useEffect, useMemo } from 'react';
import { useUserDashboardStore } from '../../store/useUserDashboardStore';
import { CURRENCY, TRANSACTION_TYPE } from '@/constants/constants';
import StatCard from '../../../../components/reusable/StatsCard';

const MyBalanceCard = () => {
  const { fetchWallet, myBalance, transactions } = useUserDashboardStore();
  useEffect(() => {
    fetchWallet();
  }, []);

  const [totalDebit, totalCredit] = useMemo(
    () =>
      transactions.reduce<[number, number]>(
        (total, tran) => {
          if (tran.transactionType === TRANSACTION_TYPE.DEBIT)
            total[0] += tran.amount;
          else total[1] += tran.amount;
          return total;
        },
        [0, 0]
      ),
    [transactions]
  );

  return (
    <div className="group  bg-zinc-800/40 hover:bg-zinc-800/70 border border-zinc-700/40 hover:border-zinc-600/60 rounded-xl p-4  transition-all duration-200">
      <div className="flex items-center gap-3 text-left">
        <div className="border-2  p-2 rounded-full border-zinc-500">
          <IdCard />
        </div>

        <div>
          <p>AvailableBalance</p>
          <p className="text-3xl">
            {' '}
            {CURRENCY.INR} {myBalance.toFixed(2)}{' '}
          </p>
        </div>
      </div>
      <div className="flex items-center py-3 gap-4">
        <StatCard
          label={'Total Credited'}
          value={Number(totalCredit.toFixed(2))}
          cls={`text-emerald-600`}
        />
        <StatCard
          label={'Total Spent'}
          value={Number(totalDebit.toFixed(2))}
          cls={`text-amber-600 `}
        />
      </div>

      <div></div>
    </div>
  );
};
export default MyBalanceCard;
