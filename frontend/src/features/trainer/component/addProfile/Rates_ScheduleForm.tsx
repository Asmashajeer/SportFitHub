import { useFormContext } from 'react-hook-form';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';
import { Button } from '@/components/ui/Button';
import { MapPin, Target } from 'lucide-react';
import {  DAYS_OF_WEEK, type DayName } from '@/constants/constants';

import { useState } from 'react';
import toast from 'react-hot-toast';

interface Rates_ScheduleFormProps {
  onNext: (fields: any[]) => void;
  onBack: () => void;
}

const Rates_ScheduleForm: React.FC<Rates_ScheduleFormProps> = ({
  onNext,
  onBack,
}) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = form;
  const [loading, setLoading] = useState(false);
  const [trainerLocation,setTrainerLocation]=useState("");
  const location = watch('currentLocation.coordinates');
  const availability = watch('availability');

  const currentFields = ['pricePerHour', 'availability', 'currentLocation'];

  const showPickedAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    setTrainerLocation(data.display_name); // selected location  display only
  };

  const handleGetLocation = () => {
    setLoading(true);
    clearErrors('currentLocation.coordinates');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          //  [longitude, latitude]
          setValue(
            'currentLocation.coordinates',
            [position.coords.longitude, position.coords.latitude],
            { shouldValidate: true }
          );
            showPickedAddress( position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          toast.custom('Location access denied');
          console.error('Location access denied', error);
        }
      );
    }
    setLoading(false);
  };
  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <Card>
        <CardHeader>
          <CardTitle>Rates & Availability</CardTitle>
          <CardDescription>
            Set your standard hourly rate for training sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label>Base Rate</Label>
          <div className="flex items-center space-between gap-2 py-2 max-w-50">
            {/* pricePerHour */}

            <div className="relative w-full">
              <span className="absolute left-3 top-2.5 text-xl text- text-muted-foreground">
                ₹
              </span>
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
            {errors?.pricing?.sessionCharge && (
              <p className="text-xs  text-red-500">
                {errors.pricing.sessionCharge.message}
              </p>
            )}
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
                  {location && location[0] !== 0
                    ? <div className="grid grid-cols-2 gap-4">
                        <p>{trainerLocation}</p>
                      </div>
                    : 'Not set, click  Get Location'}
                </div>
              </div>
              {errors?.currentLocation?.coordinates && (
                <p className="text-xs text-red-500">
                  {errors.currentLocation.coordinates.message}
                </p>
              )}
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleGetLocation}
              >
                <Target className="h-4 w-4 mr-2" /> Get Location
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Availability Schedule Section */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>
            Select your available days and working hours.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="isAvailable"
              checked={availability?.isAvailable}
              onCheckedChange={(checked) =>
                setValue('availability.isAvailable', checked)
              }
            />
            <Label htmlFor="isAvailable"> Availabile on</Label>
          </div>

          {availability?.isAvailable &&
            DAYS_OF_WEEK.map((day) => {
              const dayKey = day as DayName;
              // Access the specific day data
              const isDayEnabled = availability[dayKey]?.available;

              return (
                <div
                  key={dayKey}
                  className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    <Switch
                      id={`available-${dayKey}`}
                      checked={isDayEnabled}
                      onCheckedChange={(checked) =>
                        setValue(`availability.${dayKey}.available`, checked)
                      }
                    />
                    <Label
                      htmlFor={`available-${dayKey}`}
                      className="font-semibold w-20"
                    >
                      {day}
                    </Label>
                  </div>

                  {isDayEnabled ? (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        className="w-32"
                        {...register(`availability.${dayKey}.startTime`)}
                      />
                      <span className="text-muted-foreground">to</span>
                      <Input
                        type="time"
                        className="w-32"
                        {...register(`availability.${dayKey}.endTime`)}
                      />
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground italic">
                      Unavailable for bookings
                    </span>
                  )}
                </div>
              );
            })}
        </CardContent>

        <CardFooter>
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            disabled={loading}
            className="flex-1"
            onClick={() => {
              if (!location || location[0] === 0) {
                setError('currentLocation.coordinates', {
                  message: ' Location not Set',
                });
                return;
              }
              onNext(currentFields);
            }}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Rates_ScheduleForm;
