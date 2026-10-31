import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';
import { timeToMinutes } from '@/utils/formatDate';

interface DayRowProps {
  index: number;
  field: any;
}

export const DayRow: React.FC<DayRowProps> = ({ index, field }) => {
  const { control, register, watch, setValue,formState: { errors },
     } = useFormContext<TrainerOnboardingFormValues>();

  // Nested field array for this specific day's slots
  const { fields: slotFields, append: addSlot, remove: removeSlot } = useFieldArray({
    control,
    name: `availability.weeklySchedule.${index}.slots`,
  });

  const isDayEnabled = watch(`availability.weeklySchedule.${index}.isAvailable`);
  const dayName = field.day;
  // Validation logic for slots
  const validateSlotOverlap = ( slotIndex: number, formValues: TrainerOnboardingFormValues) => {
    const slots = formValues.availability.weeklySchedule[index].slots;
    const currentSlot = slots[slotIndex];

    if (!currentSlot.startTime || !currentSlot.endTime) return true;

    const startMin = timeToMinutes(currentSlot.startTime);
    const endMin = timeToMinutes(currentSlot.endTime);

    // 1. Check if end time is after start time
    if (startMin >= endMin) {
      return 'End time must be after start time';
    }

    // 2. Check against all other slots on this same day
    for (let i = 0; i < slots.length; i++) {
      if (i === slotIndex) continue; // Skip self
      const other = slots[i];
      if (!other.startTime || !other.endTime) continue;

      const otherStart = timeToMinutes(other.startTime);
      const otherEnd = timeToMinutes(other.endTime);

      // Check for exact duplicate slot
      if (currentSlot.startTime === other.startTime && currentSlot.endTime === other.endTime) {
        return 'Duplicate time slot';
      }

      // Check for time overlap: (StartA < EndB) and (EndA > StartB)
      if (startMin < otherEnd && endMin > otherStart) {
        return `Overlaps with slot ${other.startTime} - ${other.endTime}`;
      }
    }

    return true;
  };

  return (
    <div className="border-b pb-4 space-y-3 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Switch
            checked={isDayEnabled}
            onCheckedChange={(checked) =>
              setValue(`availability.weeklySchedule.${index}.isAvailable`, checked, { shouldValidate: true,shouldDirty:true })
            }
          />
          <Label className="font-semibold w-20">{dayName}</Label>
        </div>

        {isDayEnabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSlot({ startTime: '09:00', endTime: '17:00' })}
          >
            <Plus className="h-4 w-4 mr-1" /> Slot
          </Button>
        )}
      </div>

      {/* Render Slots for this Day */}
      {isDayEnabled && (
        <div className="space-y-2 pl-12">
          {slotFields.map((slot, slotIndex) =>{
            const startTimeError = errors?.availability?.weeklySchedule?.[index]?.slots?.[slotIndex]?.startTime?.message;
            const endTimeError = errors?.availability?.weeklySchedule?.[index]?.slots?.[slotIndex]?.endTime?.message;
          
             return (
                <div key={slot.id} className="flex items-center space-x-2">
                    <Input
                        type="time"
                        className="w-32"                       
                        {...register(`availability.weeklySchedule.${index}.slots.${slotIndex}.startTime`,
                            {
                            required: 'Required',
                            validate: (_val, formValues) => validateSlotOverlap( slotIndex, formValues),                               
                        }
                        )}
                    />
                    <span className="text-muted-foreground">to</span>
                    <Input
                        type="time"
                        className="w-32"
                        {...register(`availability.weeklySchedule.${index}.slots.${slotIndex}.endTime`,
                        {
                            required: 'Required',
                            validate: (_val, formValues) => validateSlotOverlap( slotIndex, formValues),
                        })}
                    />
                    {slotFields.length > 1 && (
                        <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                        onClick={() => removeSlot(slotIndex)}
                        >
                        <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    {(startTimeError || endTimeError) && (
                        <p className="text-[10px] text-red-500">
                        {startTimeError || endTimeError}
                        </p>
                    )}
                </div>
             )
        })}
        </div>
      )}
    </div>
  );
};