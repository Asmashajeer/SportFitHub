import { DAYS_OF_WEEK } from '@/constants/constants';
import { trainerService } from '../../service/trainerService';
import type { AvailabiltyPricing } from '../../types/trainerprofile.types';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTrainerStore } from '../../store/useTrainerStore';
import { Form } from '@/components/ui/form';
import { Calendar, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

import toast from 'react-hot-toast';
import { useState } from 'react';

interface props {
  initialData: AvailabiltyPricing;
  onCancel: () => void;
}

const AvailabilityFormEdit = ({ initialData, onCancel }: props) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const form = useForm<AvailabiltyPricing>({ defaultValues: initialData });
  const [isUpdating, setIsUpdating] = useState(false);
  const { user } = useAuthStore();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;

  const tz = user?.timezone;
  const todayStr = () => new Intl.DateTimeFormat('en-GB', { timeZone: tz }).format(new Date());

  const effectiveFrom = initialData?.availability?.effectiveFrom?.slice(0, 10);
  const hasStarted = effectiveFrom !== undefined && effectiveFrom <= todayStr();

  const onSubmit = async (data: AvailabiltyPricing) => {
    if (!profile) return;
    setIsUpdating(true);
    try {
      const updatedData = await trainerService.updateAvailability_Pricing(profile?.id, data);
      setProfile(updatedData.profile);
      toast.success('Availability updated');
      onCancel();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Cannot update schedule right now, try again');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-[#1e1e1f] border-2 p-4 sm:p-6 my-4 rounded-lg w-full max-w-full overflow-hidden text-xs sm:text-xs">
        
        {/* Top Section: Session Charge & Effective Dates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {/* Session Charge */}
          <div className="space-y-1.5 w-full">
            <Label className="text-xs sm:text-xs font-semibold text-foreground">Session Charge</Label>
            <Input {...register('pricing.sessionCharge', { valueAsNumber: true })} className="text-xs sm:text-xs" />
          </div>

          {/* Effective Dates */}
          <div className="space-y-1.5 w-full">
            <h3 className="text-start text-xs sm:text-xs font-semibold mb-1">Effective Range</h3>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center py-2 px-3 gap-3 bg-zinc-700/60 rounded-md">
              
              {/* From Date */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 w-full">
                <label className="text-xs text-slate-300 font-medium">From</label>
                <div className="relative w-full">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input type="date" readOnly={hasStarted} {...register('availability.effectiveFrom')} className="pl-9 text-xs" />
                </div>
                {errors?.availability?.effectiveFrom && <p className="text-[10px] text-red-500">{errors.availability?.effectiveFrom.message}</p>}
              </div>

              {/* To Date */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1.5 w-full">
                <label className="text-xs text-slate-300 font-medium">To</label>
                <div className="relative w-full">
                  <Input type="date" {...register('availability.effectiveTo')} className="text-xs" />
                </div>
                {errors?.availability?.effectiveTo && <p className="text-[10px] text-red-500">{errors.availability?.effectiveTo.message}</p>}
              </div>

            </div>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* Global Toggle */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <Label className="text-xs sm:text-xs font-medium">Availability Status</Label>
          <input type="checkbox" {...register('availability.isAvailable')} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
        </div>

        {/* Individual Days */}
        <div className="space-y-2">
          {DAYS_OF_WEEK.map((day) => {
            const isDayActive = watch(`availability.${day}.available`);

            return (
              <div key={day} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center border-b border-zinc-800/60 py-2">
                
                {/* Checkbox and Day Name */}
                <div className="flex items-center gap-2">
                  <input type="checkbox" {...register(`availability.${day}.available`)} className="w-4 h-4 accent-emerald-500 cursor-pointer" />
                  <span className="capitalize text-xs sm:text-xs font-medium text-zinc-200">{day}</span>
                </div>

                {/* Time Slots (Start & End) */}
                {isDayActive ? (
                  <div className="col-span-2 grid grid-cols-2 gap-2">
                    <Input type="time" {...register(`availability.${day}.startTime`)} className="text-xs h-8" />
                    <Input type="time" {...register(`availability.${day}.endTime`)} className="text-xs h-8" />
                  </div>
                ) : (
                  <div className="col-span-2">
                    <span className="text-[10px] sm:text-xs text-zinc-500 italic">Unavailable</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto text-xs">
            Cancel
          </Button>
          <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto text-xs">
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? 'Updating...' : 'Save Availability'}
          </Button>
        </div>

      </form>
    </Form>
  );
};

export default AvailabilityFormEdit;