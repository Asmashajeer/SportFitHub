import { DAYS_OF_WEEK,  } from '@/constants/constants';
import { trainerService } from '../../service/trainerService';
import type { AvailabiltyPricing, dayAvailability } from '../../types/trainerprofile.types';
import { useForm} from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTrainerStore } from '../../store/useTrainerStore';
import { Form } from '@/components/ui/form';
import { Calendar } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

import toast from 'react-hot-toast';

interface AvailabilityFormValues {
  pricing: { sessionCharge: number; currency: string };
  availability: {
    isAvailable: boolean;
    Monday: dayAvailability;
    Tuesday: dayAvailability;
    Wednesday: dayAvailability;
    Thursday: dayAvailability;
    Friday: dayAvailability;
    Saturday: dayAvailability;
    Sunday: dayAvailability;
    effectiveFrom: string;
    effectiveTo: string;
  };
}

interface props {
  initialData: {
    pricing: {
      sessionCharge: number;
      currency: string;
    };
    availability: {
      isAvailable: boolean;
      Monday: dayAvailability;
      Tuesday: dayAvailability;
      Wednesday: dayAvailability;
      Thursday: dayAvailability;
      Friday: dayAvailability;
      Saturday: dayAvailability;
      Sunday: dayAvailability;
      effectiveFrom: string;
      effectiveTo: string;
    };
  };
  onCancel: () => void;
}

const AvailabilityFormEdit = ({ initialData, onCancel }: props) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const form = useForm<AvailabilityFormValues>({ defaultValues: initialData });
  const { user } = useAuthStore();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = form;
  
  // const [conflicts, setConflicts] = useState("");
  // const [serverError, setServerError] = useState<string | null>(null);
  const tz = user?.timezone;
  const todayStr = () => new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date()); // "2026-09-19"

  const hasStarted = initialData.availability.effectiveFrom.slice(0, 10) <= todayStr();


  const onSubmit = async (data: AvailabiltyPricing) => {
    if (!profile) return;
    // setConflicts("");
    console.log(data);
    try {
      const updatedData = await trainerService.updateAvailability_Pricing(profile?.id, data);
      setProfile(updatedData.profile);
      onCancel();
    } catch (err: any) {     
     toast.error(err.response?.data?.message ?? 'Cannot update schedule right now, try again');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-[#1e1e1f]  border-2 p-4 my-4">
        <div className="flex justify-around">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2">SessionCharge</Label>
            <Input {...register('pricing.sessionCharge', { valueAsNumber: true })} />
          </div>

          <div>
            <h3 className="text-start mb-0">Effective</h3>
            <div className=" flex items-center py-1 px-2 gap-2 space-y-2 mb-4 bg-zinc-700/60">
              <div className=" flex items-center  gap-1 space-y-2">
                <label className="block text-sm  text-slate-300 mb-2">From</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <Input
                    type="date"
                    readOnly={hasStarted}
                    {...register('availability.effectiveFrom' )}
                  />
                </div>
                {errors?.availability?.effectiveFrom && <p className=" block text-[10px] text-red-500">{errors.availability?.effectiveFrom.message}</p>}
              </div>
              <div className="flex items-center  gap-2  space-y-2">
                <label className="block text-sm  text-slate-300 mb-2">To</label>
                <div className="relative">
                  
                  <Input
                    type="date"
                    {...register('availability.effectiveTo' )}
                  />
                </div>
                {errors?.availability?.effectiveTo && <p className="text-[10px] text-red-500">{errors.availability?.effectiveTo.message}</p>}
              </div>
            </div>
          </div>
        </div>
        <hr />
        {/* Global Toggle */}
        <div className="flex items-center justify-around border-b p-2">
          <Label className="w-full">Availability Status</Label>
          <input type="checkbox" {...register('availability.isAvailable')} />
        </div>

        {/* Individual Days */}
        {DAYS_OF_WEEK.map((day) => {
          const isDayActive = watch(`availability.${day}.available`);

          return (
            <div key={day} className="grid grid-cols-3 gap-1 items-center border-b  py-2">
              <div className="flex items-center justify-start gap-1 ">
                <input type="checkbox" {...register(`availability.${day}.available`)} className="w-3" />
                <span className="capitalize text-sm w-1">{day}</span>
              </div>

              {isDayActive && (
                <>
                  <Input type="time" {...register(`availability.${day}.startTime`)} className="text-xs  h-6" />
                  <Input type="time" {...register(`availability.${day}.endTime`)} className=" text-xs h-6" />
                </>
              )}
            </div>
          );
        })}

        <div className="flex justify-end gap-2 pt-4">
          <Button type="submit">Save Availability</Button>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AvailabilityFormEdit;
