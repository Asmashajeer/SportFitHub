import { useEffect, useState } from "react";

import { useTrainerStore } from "../store/useTrainerStore";
import { CURRENCY, PAGINATION_DEFAULT_LIMIT, type PayoutBatchStatus } from "@/constants/constants";
import { formatDateReadable } from "@/utils/formatDate";
import { StripeConnectService } from "../service/earningsService/stripeConnect.service";
import { TrainerEarningsService } from "../service/earningsService/trainer.earnings.service";
import Pagination from "@/components/reusable/Pagination";


interface EarningsSummary {
  pendingHold: number;
  payable: number;
  paid: number;
  pendingPenalties: number;
  estimatedNextPayout: number;
}


interface PayoutBatch {
  _id: string;
  earningsTotal: number;
  penaltyTotal: number;
  netAmount: number;
  status:  PayoutBatchStatus
  runAt: string;
}

interface SessionEarning {
  _id: string;
  slotId: string;
  startDateTime: string;
  sessionRevenue: number;
  trainerShare: number;
  status: string;
}



function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
const STATUS_STYLES: Record<string, string> = {
  transferred: 'text-[#7FA66B] bg-[#7FA66B]/10',
  skipped: 'text-[#9A9284] bg-[#9A9284]/10',
  failed: 'text-[#D9704F] bg-[#D9704F]/10',
};
interface PaginationResponseData{
  page:number;
  total:number;
  totalPage:number
}


export default function TrainerEarningsPage() {
  const {profile}=useTrainerStore();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [history, setHistory] = useState<PayoutBatch[]>([]);
  const [sessions, setSessions] = useState<SessionEarning[]>([]);
  const [sessionsPagination, setSessionsPagination] = useState<PaginationResponseData>({
    page: 1,
    total: 0,
    totalPage: 0,
  });
  const [currentPage,setCurrentPage]=useState(1);
  const [tab, setTab] = useState<'history' | 'sessions'>('history');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessBanner,setShowSuccessBanner]=useState(false);


  useEffect(() => {
     if(!profile) return;
    const getEarnings= async()=>{
        try{          
        
        const [s,h,sess]=await Promise.all([
            TrainerEarningsService.getSummary(profile.id),           
            TrainerEarningsService.getHistory(profile.id),
            TrainerEarningsService.getSessions(profile.id,currentPage),
        ]);       
        setSummary(s);
        setHistory(h);
        setSessions(sess.sessionsData.sessions);
        setSessionsPagination({
          page: sess.page,
          total: sess.total,
          totalPage: sess.totalPage,
        });
        }
        catch(err) {
            console.log(err instanceof Error ?err.message:'Could not load your earnings.');
            setError('Could not load your earnings. Try refreshing.'); 
            }
        finally{
            setLoading(false);
        }
    }
    const getStripeStatus=async ()=>{
        const isOnboardingComplete= await  StripeConnectService.getStatus(profile?.id);
        console.log('is onbording:' ,isOnboardingComplete);
        if (isOnboardingComplete) {
          setShowSuccessBanner(true);
          setTimeout(() => setShowSuccessBanner(false), 4000);
        }
        setOnboardingComplete(isOnboardingComplete);
    }
    getStripeStatus();
    getEarnings();
  }, [profile, currentPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#16140F] text-[#F5F1E8] p-6">
        <div className="max-w-3xl mx-auto animate-pulse space-y-6">
          <div className="h-8 w-56 bg-[#231F17] rounded" />
          <div className="h-32 bg-[#1F1B14] rounded-2xl" />
          <div className="h-64 bg-[#1F1B14] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (onboardingComplete === false) {
    return (
      <div className="min-h-screen bg-[#16140F] text-[#F5F1E8] flex items-center justify-center p-6">
        <div className="max-w-sm text-center rounded-2xl bg-[#1F1B14] border border-[#2C2719] p-8">
          <p className="text-lg font-semibold mb-2">Set up payouts</p>
          <p className="text-sm text-[#9A9284] mb-6">
            Connect a bank account with Stripe to start receiving your session earnings.
          </p>
          <button
            onClick={async () => {
              const { url } = profile && await StripeConnectService.connect(profile?.id);
              console.log(url);
              window.location.href = url;
            }}
            className="bg-[#E3A339] text-[#16140F] font-medium px-5 py-2.5 rounded-lg"
          >
            Connect with Stripe
          </button>
        </div>
      </div>
    );
  }
  if (error || !summary) {
    return (
      <div className="min-h-screen bg-[#16140F] text-[#F5F1E8] p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#D9704F] text-sm mb-3">{error ?? 'Something went wrong.'}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-[#E3A339] underline underline-offset-2"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  const total = summary.pendingHold + summary.payable + summary.paid;
  const holdPct = total ? (summary.pendingHold / total) * 100 : 0;
  const payablePct = total ? (summary.payable / total) * 100 : 0;
  const paidPct = total ? (summary.paid / total) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#16140F] text-[#F5F1E8]">
      <div className="max-w-3xl mx-auto px-5 py-8 space-y-10">
        {showSuccessBanner && (
          <div className="rounded-lg bg-[#7FA66B]/10 border border-[#7FA66B]/30 px-4 py-3 text-sm text-[#7FA66B] mb-4">
            You're all set — payouts will now be sent to your connected bank account.
          </div>
        )}
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-widest text-[#9A9284] mb-1">Trainer earnings</p>
          <h1 className="text-2xl font-semibold tracking-tight">Your payouts</h1>
        </div>

        {/* Estimated next payout — hero */}
        <div className="rounded-2xl bg-[#1F1B14] border border-[#2C2719] p-6">
          <p className="text-xs uppercase tracking-widest text-[#9A9284] mb-2">Estimated next payout</p>
          <p
            className="text-4xl font-semibold text-[#E3A339] mb-4"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {summary.estimatedNextPayout.toFixed(2)} {CURRENCY}
          </p>

          {summary.pendingPenalties > 0 && (
            <div className="flex items-center gap-2 text-sm text-[#D9704F] bg-[#D9704F]/10 rounded-lg px-3 py-2 mb-4">
              <span>−{summary.pendingPenalties.toFixed(2)} {CURRENCY}in pending cancellation penalties</span>
            </div>
          )}

          {/* Signature element — money pipeline */}
          <div className="space-y-2">
            <div className="flex h-2.5 rounded-full overflow-hidden bg-[#16140F]">
              <div
                className="bg-[#9A9284]/50 transition-all"
                style={{ width: `${holdPct}%` }}
                title={`On hold: ${summary.pendingHold.toFixed(2)} {CURRENCY}}`}
              />
              <div
                className="bg-[#E3A339] transition-all"
                style={{ width: `${payablePct}%` }}
                title={`Payable: ${summary.payable.toFixed(2)} {CURRENCY}}`}
              />
              <div
                className="bg-[#7FA66B] transition-all"
                style={{ width: `${paidPct}%` }}
                title={`Paid: ${summary.paid.toFixed(2)} {CURRENCY}`}
              />
            </div>
            <div className="flex justify-between text-xs text-[#9A9284]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9A9284]/50" />
                On hold · {CURRENCY} {summary.pendingHold.toFixed(2)} 
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#E3A339]" />
                Payable · {CURRENCY} {summary.payable.toFixed(2)}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#7FA66B]" />
                Paid ·  {CURRENCY} {summary.paid.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-6 border-b border-[#2C2719] mb-4">
            {(['history', 'sessions'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'text-[#F5F1E8] border-[#E3A339]'
                    : 'text-[#9A9284] border-transparent hover:text-[#F5F1E8]'
                }`}
              >
                {t === 'history' ? 'Payout history' : 'Session breakdown'}
              </button>
            ))}
          </div>

          {tab === 'history' && (
            <div className="space-y-2">
              {history.length === 0 && (
                <p className="text-sm text-[#9A9284] py-8 text-center">No payouts yet — your first one lands after your next completed session clears the hold period.</p>
              )}
              {history.map((batch) => (
                <div
                  key={batch._id}
                  className="flex items-center justify-between rounded-xl bg-[#1F1B14] border border-[#2C2719] px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-[#F5F1E8]">{formatDateReadable (batch.runAt)}</p>
                    {batch.penaltyTotal > 0 && (
                      <p className="text-xs text-[#9A9284] mt-0.5">
                        {/* {CURRENCY}{batch.earningsTotal} − {batch.penaltyTotal} penalty */}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p
                      className="text-sm font-semibold"
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {/* {CURRENCY} {batch.netAmount} */}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[batch.status]}`}>
                      {batch.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === 'sessions' && (
            <div className="space-y-2">
              {sessions.length === 0 && (
                <p className="text-sm text-[#9A9284] py-8 text-center">No sessions recorded yet.</p>
              )}
              {sessions.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-xl bg-[#1F1B14] border border-[#2C2719] px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-[#F5F1E8]">{CURRENCY} {formatDate(s.startDateTime)}</p>
                    <p className="text-xs text-[#9A9284] mt-0.5 capitalize">{s.status.replace('_', ' ')}</p>
                  </div>
                  <p className="text-sm font-semibold" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {CURRENCY} {s.trainerShare.toFixed(2)}
                  </p>
                </div>
              ))}
             <Pagination
               totalPages={sessionsPagination.totalPage}
               ITEMS_PER_PAGE={PAGINATION_DEFAULT_LIMIT}
                currentPage={currentPage}
               totalCount={sessionsPagination.total}
                setCurrentPage={setCurrentPage}
                label="Sessions"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}