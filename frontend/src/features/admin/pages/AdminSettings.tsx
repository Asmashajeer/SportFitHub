// import { useState, useEffect, useCallback } from 'react';
// import { Percent, Clock, ShieldAlert, RotateCcw, Save, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
// import { PlatformSettingsService } from '../service/platformSettingsService';
// import toast from 'react-hot-toast';
// import { updateSettingsSchema, type UpdateSettingsData } from '../store/types/settings.Schema';

// type SettingsKey = 'commissionPercent' | 'payoutHoldHours' | 'cancellationPenaltyPercent' | 'strikeResetDays';

// type SettingsValues = Record<SettingsKey, number | string>;

// const FIELD_CONFIG: {
//   key: SettingsKey;
//   label: string;
//   description: string;
//   icon: typeof Percent;
//   unit: string;
//   min: number;
//   max: number;
//   step: number;
// }[] = [
//   {
//     key: 'commissionPercent',
//     label: 'Commission',
//     description: 'Percentage the platform keeps from every completed booking.',
//     icon: Percent,
//     unit: '%',
//     min: 0,
//     max: 100,
//     step: 0.5,
//   },
//   {
//     key: 'payoutHoldHours',
//     label: 'Payout hold',
//     description: 'How long funds are held after a booking completes before payout is released.',
//     icon: Clock,
//     unit: 'hrs',
//     min: 0,
//     max: 720,
//     step: 1,
//   },
//   {
//     key: 'cancellationPenaltyPercent',
//     label: 'Cancellation penalty',
//     description: 'Percentage withheld when a provider cancels a confirmed booking.',
//     icon: ShieldAlert,
//     unit: '%',
//     min: 0,
//     max: 100,
//     step: 0.5,
//   },
//   {
//     key: 'strikeResetDays',
//     label: 'Strike reset',
//     description: "Days of clean history required before a strike is cleared from a provider's record.",
//     icon: RotateCcw,
//     unit: 'days',
//     min: 1,
//     max: 365,
//     step: 1,
//   },
// ];


import { useEffect, useState } from 'react';
import { PlatformSettingsService } from '../service/platformSettingsService';



interface PlatformSettings {
  commissionPercent: number;
  payoutHoldHours: number;
  cancellationPenaltyPercent: number;
  strikeResetDays: number;
  updatedAt:string
}


const FIELD_CONFIG: {
  key: keyof PlatformSettings;
  label: string;
  hint: string;
  suffix: string;
  group: 'payout' | 'penalty';
}[] = [
  {
    key: 'commissionPercent',
    label: 'Platform commission',
    hint: 'Percentage the platform keeps from each completed session.',
    suffix: '%',
    group: 'payout',
  },
  {
    key: 'payoutHoldHours',
    label: 'Payout hold period',
    hint: 'Hours after a session completes before earnings are eligible for payout.',
    suffix: 'hrs',
    group: 'payout',
  },
  {
    key: 'cancellationPenaltyPercent',
    label: 'Cancellation penalty',
    hint: 'Percentage of session revenue deducted when a trainer cancels late.',
    suffix: '%',
    group: 'penalty',
  },
  {
    key: 'strikeResetDays',
    label: 'Strike reset window',
    hint: 'Days of good standing before a trainer\u2019s strike count resets to zero.',
    suffix: 'days',
    group: 'penalty',
  },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<PlatformSettings| null>(null);
  const [draft, setDraft] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadSettings=async()=>{
        try{
        const data=await PlatformSettingsService.getSettings();        
        setSettings(data);
        setDraft(data);
      }
      catch(err){
          setError('Could not load settings. Try refreshing the page.');
      }finally{
         setLoading(false);
      } 
    }
    loadSettings();
  }, []);
 
  const isDirty = settings && draft && JSON.stringify(settings) !== JSON.stringify(draft);

  const handleChange = (key: keyof PlatformSettings, value: string) => {
    if (!draft) return;
    const num = value === '' ? 0 : Number(value);
    setDraft({ ...draft, [key]: num });
    setSaved(false);
  };

  const handleSave = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    try {
       const {updatedAt,...newSettings}=draft;
      const data = await PlatformSettingsService.updateSettings(newSettings);
        console.log("------",data);
      setSettings(data);
      console.log(draft);
      setDraft(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Could not save changes. Check your values and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (settings) setDraft(settings);
    setSaved(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-slate-600 rounded" />
          <div className="h-24 bg-zinc-500 rounded-xl" />
          <div className="h-24 bg-zinc-500 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-sm text-slate-500">
        Settings couldn't be loaded. Refresh the page to try again.
      </div>
    );
  }

  const groups: { key: 'payout' | 'penalty'; title: string; description: string }[] = [
    {
      key: 'payout',
      title: 'Payout',
      description: 'Controls how trainer earnings are calculated and released each week.',
    },
    {
      key: 'penalty',
      title: 'Cancellation penalty',
      description: 'Controls the financial consequence when a trainer cancels a booked session.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Platform settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Changes apply to sessions and payouts going forward — not retroactively.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {groups.map((group) => (
        <section key={group.key} className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100 uppercase tracking-wide">
              {group.title}
            </h2>
            <p className="text-sm text-zinc-500">{group.description}</p>
          </div>

          <div className="rounded-xl border border-zinc-400 divide-y divide-slate-400 bg-zinc-900">
            {FIELD_CONFIG.filter((f) => f.group === group.key).map((field) => (
              <div key={field.key} className="flex items-center justify-between gap-4 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-800">{field.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{field.hint}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <input
                    type="number"
                    min={0}
                    value={draft[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-20 rounded-lg border border-slate-500 px-2 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
                  />
                  <span className="text-sm text-slate-300 w-8">{field.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={!isDirty || saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-green-500 transition"
        >
          {saving ? 'Saving\u2026' : 'Save changes'}
        </button>

        {isDirty && !saving && (
          <button
            onClick={handleReset}
            className="text-sm text-slate-200 hover:text-slate-700"
          >
            Discard changes
          </button>
        )}

        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Platform settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Changes apply to sessions and payouts going forward — not retroactively.
        </p>
        {settings?.updatedAt && (
          <p className="text-xs text-slate-400 mt-1">
            Last updated {new Date(settings.updatedAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        )}
      </div>
    </div>
  );
}