import { useEffect, useState } from "react";
import type { AdminPaymentOverviewResponseData } from "../../store/types/payment.types";
import { PaymentsManagementService } from "../../service/paymentsManagementService ";
import { CURRENCY } from "@/constants/constants";
const PRESETS = [
  { label: 'All time', days: null },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
];
export default function PaymentStats() {
  const [data, setData] = useState<AdminPaymentOverviewResponseData| null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<number | null>(null); // null = all time

  useEffect(() => {
    setLoading(true);
    setError(null);
    const dateRange = activePreset !== null
        ? {
            startDate: new Date(Date.now() - activePreset * 86400000).toISOString(),
            endDate: new Date().toISOString(),
          }
        : {};
    const getPaymentStats=async()=>{
        try{
            const data=await PaymentsManagementService.getOverView(dateRange);      
            setData(data)
        }catch(err)
         { 
            setError('Could not load payment stats.')
        }
        setLoading(false);
    }
    getPaymentStats();
  }, [activePreset]);

  const cards = data
    ? [
        { label: 'Gross revenue', value: data.grossRevenue, tone: 'default' as const },
        { label: 'Refunds', value: data.totalRefunds, tone: 'negative' as const },
        { label: 'Net revenue', value: data.netRevenue, tone: 'default' as const },
        { label: 'Trainer payouts', value: data.totalPayouts, tone: 'default' as const },
        { label: 'Commission earned', value: data.commissionEarned, tone: 'positive' as const },
      ]
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-semibold text-slate-900">Payments overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Revenue, refunds, and trainer payouts at a glance.
          </p>
        </div>

        <div className="flex gap-1 rounded-lg p-1">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setActivePreset(preset.days)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                activePreset === preset.days
                  ?  ' text-slate-100 shadow-sm font-medium'
                  : 'text-slate-200 hover:text-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {cards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-slate-200 p-4"
              >
                <p className="text-xs text-slate-500 mb-1">{card.label}</p>
                <p
                  className={`text-lg font-semibold ${
                    card.tone === 'negative'
                      ? 'text-red-600'
                      : card.tone === 'positive'
                      ? 'text-green-600'
                      : 'text-slate-300'
                  }`}
                  style={{ fontVariantNumeric: 'tabular-nums' }}
                >
                  {card.tone === 'negative' && card.value > 0 ? '−' : ''}
                  {CURRENCY}{ card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Pending liability — separate, since it's a snapshot, not date-scoped */}
          <div className="rounded-xl border border-red-400 bg-[#f5aec2] p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-900">Pending payout liability</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Owed to trainers, not yet transferred — as of right now, not scoped to the selected range.
              </p>
            </div>
            <p
              className="text-lg font-semibold text-amber-900"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
             {CURRENCY}{data.pendingPayoutLiability}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
