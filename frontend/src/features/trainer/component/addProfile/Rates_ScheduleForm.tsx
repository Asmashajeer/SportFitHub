import { useFieldArray, useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';
import { Button } from '@/components/ui/Button';
import { Calendar, Loader2, MapPin, Target } from 'lucide-react';
import { END_OF_TODAY } from '@/constants/constants';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { DayRow } from './DayRow';

interface Rates_ScheduleFormProps {
  onBack: () => void;
  isSubmitting: boolean;
}

const Rates_ScheduleForm: React.FC<Rates_ScheduleFormProps> = ({ onBack, isSubmitting }) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    watch,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = form;
  const [isLoading, setIsLoading] = useState(false);
  const [showSchedule, setShowSchedule] = useState(true);
  const [trainerLocation, setTrainerLocation] = useState('');
  const location = watch('currentLocation.coordinates');

  const { fields: scheduleFields } = useFieldArray({
    control,
    name: 'availability.weeklySchedule',
  });

  useEffect(() => {
    register('currentLocation.coordinates', {
      validate: (coords) => {
        if (!coords || !Array.isArray(coords) || coords.length !== 2) {
          ('Location is required');
        }
        if (coords[0] === 0 && coords[1] === 0) {
          return 'Please click "Get Location" to capture coordinates';
        }
        return true;
      },
    });
  }, [register]);
  
  const showPickedAddress = async (lat: number, lng: number) => {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
    const data = await res.json();
    setTrainerLocation(data.display_name); // selected location  display only
  };

  const handleGetLocation = () => {
    setIsLoading(true);
    clearErrors('currentLocation.coordinates');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //  [longitude, latitude]
          setValue('currentLocation.coordinates', [position.coords.longitude, position.coords.latitude], { shouldValidate: true });
          showPickedAddress(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          toast.custom('Location access denied');
          console.error('Location access denied', error);
          setIsLoading(false);
        }
      );
    }
    setIsLoading(false);
  };
  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Rates & Availability</CardTitle>
          <CardDescription>Set your standard hourly rate for training sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Base Rate</Label>
          <div className="flex items-center space-between gap-2 py-2 max-w-50">
            {/* pricePerHour */}

            <div className="relative w-full">
              <span className="absolute left-3 top-2.5 text-xl text- text-muted-foreground">₹</span>
              <Input
                type="number"
                min={100}
                max={1000}
                className="  pl-7 w-32"
                placeholder="0.00"
                {...register('pricing.sessionCharge', {
                  valueAsNumber: true,
                  required: 'Base rate required ',
                  min: { value: 1, message: 'Price may not be zero' },
                })}
              />
            </div>
            {errors?.pricing?.sessionCharge && <p className="text-xs  text-red-500">{errors.pricing.sessionCharge.message}</p>}
          </div>

          {/* Location Section */}
          <div className="space-y-4 pt-4 border-t">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Service Location
            </Label>
            <div className="p-4 bg-muted/30 rounded-lg flex items-center justify-between">
              <div className="text-sm">
                <p className="font-medium text-start ">Current location </p>
                <div className="text-muted-foreground font-mono">
                  {location && location[0] !== 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      <p>{trainerLocation}</p>
                    </div>
                  ) : (
                    'Not set, click  Get Location'
                  )}
                </div>
              </div>
              {errors?.currentLocation?.coordinates && <p className="text-xs text-red-500">{errors.currentLocation.coordinates.message}</p>}
              <Button type="button" variant="secondary" size="sm" onClick={handleGetLocation} disabled={isLoading}>
                <Target className="h-4 w-4 mr-2" />
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? 'getting Location' : 'Get Location'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Select your available days and working hours.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="toggleSchedule" checked={showSchedule} onCheckedChange={setShowSchedule} />
            <Label htmlFor="toggleSchedule"> Configure Weekly Working Hours</Label>
          </div>
          {showSchedule && (
            <>
              <h3 className="text-start mb-0">Effective</h3>
              <div className=" flex items-center py-1 px-2 gap-2 space-y-2 mb-4 bg-zinc-700/60">
                <div className=" flex items-center  gap-1 space-y-2">
                  <label className="block text-sm  text-slate-300 mb-2">From</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="date"
                      required
                      value={watch('availability.effectiveFrom')}
                      {...register('availability.effectiveFrom', {
                        required: 'Date is required',
                        validate: (v) => new Date(v) > new Date() || 'Date cannot be in the past',
                      })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl [&::-webkit-calendar-picker-indicator]:invert bg-secondary/60 border border-[#454c59] text-white"
                    />
                  </div>
                  {errors?.availability?.effectiveFrom && <p className=" block text-[10px] text-red-500">{errors.availability?.effectiveFrom.message}</p>}
                </div>
                <div className="flex items-center  gap-2  space-y-2">
                  <label className="block text-sm  text-slate-300 mb-2">To</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input
                      type="date"
                      required
                      value={watch('availability.effectiveTo')}
                      {...register('availability.effectiveTo', {
                        required: 'Date is required',
                        validate: {
                          notInPast: (v) => new Date(v) >= END_OF_TODAY || 'Date cannot be in the past',
                          afterEffectiveFrom: (v, formValues) => {
                            const effectiveFrom = formValues?.availability?.effectiveFrom;
                            if (!effectiveFrom) return true;
                            return new Date(v) > new Date(effectiveFrom) || 'Effective To date must be after Effective From date';
                          },
                        },
                      })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl [&::-webkit-calendar-picker-indicator]:invert bg-secondary/60 border border-[#454c59] text-white"
                    />
                  </div>
                  {errors?.availability?.effectiveTo && <p className="text-[10px] text-red-500">{errors.availability?.effectiveTo.message}</p>}
                </div>
              </div>

              {scheduleFields.map((field, index) => (
                <DayRow key={field.id} index={index} field={field} />
              ))}
            </>
          )}
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>

          <Button
            type="submit" // This triggers the root form's onSubmit
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Submitting Application...' : 'Complete Onboarding'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Rates_ScheduleForm;
