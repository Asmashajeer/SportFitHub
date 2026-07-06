import { CURRENCY, DAYS_OF_WEEK } from '@/constants/constants';
import { trainerService } from '../../service/trainerService';
import type {
  AvailabiltyPricing,
  dayAvailability,
} from '../../types/trainerprofile.types';
import { useForm } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useTrainerStore } from '../../store/useTrainerStore';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
    };
  };
  onCancel: () => void;
}

const AvailabilityFormEdit = ({ initialData, onCancel }: props) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const form = useForm<AvailabilityFormValues>({ defaultValues: initialData });
  const { register, watch, handleSubmit, control } = form;
  // const { control } = useForm<AvailabilityFormValues>({...});

  const onSubmit = async (data: AvailabiltyPricing) => {
    if (profile) {
      const updatedData = await trainerService.updateAvailability_Pricing(
        profile?.id,
        data
      );
      setProfile( updatedData.profile);
      onCancel();
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 bg-[#1e1e1f]  border-2 p-4 my-4"
      >
        <div className="flex justify-around">
          <div>
            <Label className="text-xs font-semibold text-foreground mb-2">
              SessionCharge
            </Label>
            <Input
              {...register('pricing.sessionCharge', { valueAsNumber: true })}
            />
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
            <div
              key={day}
              className="grid grid-cols-3 gap-1 items-center border-b  py-2"
            >
              <div className="flex items-center justify-start gap-1 ">
                <input
                  type="checkbox"
                  {...register(`availability.${day}.available`)}
                  className="w-3"
                />
                <span className="capitalize text-sm w-1">{day}</span>
              </div>

              {isDayActive && (
                <>
                  <Input
                    type="time"
                    {...register(`availability.${day}.startTime`)}
                    className="text-xs  h-6"
                  />
                  <Input
                    type="time"
                    {...register(`availability.${day}.endTime`)}
                    className=" text-xs h-6"
                  />
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
