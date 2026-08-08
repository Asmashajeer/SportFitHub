import { MapPicker } from '@/components/reusable/MapPicker';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SESSION_MODE } from '@/constants/constants';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  useFormContext,
  type FieldValues,
  type Path,
  type PathValue,
} from 'react-hook-form';

const SessionMode = <T extends FieldValues>({offlineOnly=false}:{offlineOnly?:boolean}) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
    clearErrors,
  } = useFormContext<T>();
   const currentMode = offlineOnly     ? SESSION_MODE.OFFLINE 
    : watch('mode' as Path<T>) || SESSION_MODE.OFFLINE;

  const [venueLocation, setVenueLocation] = useState(''); // Location address display only
  useEffect(() => {
    if (offlineOnly) {
      setValue('mode' as Path<T>, SESSION_MODE.OFFLINE as PathValue<T, Path<T>>);
    }
    showPickedAddress(
      watch('venue.location.coordinates.1' as Path<T>),
      watch('venue.location.coordinates.0' as Path<T>)
    );
  }, []);
  const handleLocationSelect = async (lat: number, lng: number) => {
    setValue(
      'venue.location.coordinates.0' as Path<T>,
      lng as PathValue<T, Path<T>>
    );
    setValue(
      'venue.location.coordinates.1' as Path<T>,
      lat as PathValue<T, Path<T>>
    );
    showPickedAddress(lat, lng);
  };
  const showPickedAddress = async (lat: number, lng: number) => {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await res.json();
    setVenueLocation(data.display_name); // selected location  display only
  };

  return (
    <div className="space-y-4">
      {!offlineOnly && (
        <>       
          <Label>Session Mode</Label>
          <Tabs
            value={currentMode}
            onValueChange={(val) => {
              setValue('mode' as Path<T>, val as PathValue<T, Path<T>>);

              clearErrors(['venue' as Path<T>, 'meetingLink' as Path<T>]);
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value={SESSION_MODE.OFFLINE}>
                In-Person (Offline)
              </TabsTrigger>
              <TabsTrigger value={SESSION_MODE.ONLINE}>Remote (Online)</TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      )}

      {currentMode === SESSION_MODE.OFFLINE ?(
        /* venue Details */
        <section className="space-y-4 p-5 rounded-xl  bg-card">
          <h3 className="flex items-center gap-2 font-bold text-primary">
            <MapPin size={18} /> 2. Venue 
          </h3>
          <Label>Name</Label>
          <Input
            {...register('venue.name' as Path<T>, {
              required: 'Vevue Name required',
            })}
            placeholder="Venue Name"
            className="w-full p-2.5 border rounded-lg"
          />
          {(errors as any)?.venue?.name && (
            <p className="text-xs text-red-500">
              {(errors as any).venue.name.message}
            </p>
          )}
          <Label>Address</Label>
          <Input
            {...register('venue.address' as Path<T>, {
              required: 'Venue Address required',
            })}
            placeholder="Full Address"
            className="w-full p-2.5 border rounded-lg"
          />
          {(errors as any)?.venue?.address && (
            <p className="text-xs text-red-500">
              {(errors as any).venue.address.message}
            </p>
          )}

          <div className="  gap-4">
            <label className="block text-sm font-medium">
              Select Location on Map{' '}
              <span className="text-sm text-primary font-bold">
                {' '}
                : {venueLocation}{' '}
              </span>
            </label>
            <p className="text-xs text-muted-foreground">
              Click the map to set the venue location.
            </p>
            <MapPicker onLocationSelect={handleLocationSelect} />
            <div className="flex gap-4 text-xs bg-muted p-2 rounded">
              <Input
                className="hidden"
                {...register('venue.location.coordinates.0' as Path<T>, {
                  valueAsNumber: true,
                })}
              />
              <Input
                className="hidden"
                {...register('venue.location.coordinates.1' as Path<T>, {
                  valueAsNumber: true,
                })}
              />
            </div>
          </div>
          {/* Aminities */}
          <div className="p-4 border round'ed-lg">
            <span className="text-xs font-bold text-slate-400 block mb-2">
              AMENITIES
            </span>
            <Input
              {...register('amenities' as Path<T>, {
                required: 'add  amenitites  ',
              })}
              placeholder="Parking, Water..."
              className="w-full text-sm outline-none"
            />
            {(errors as any)?.amenities && (
              <p className="text-xs text-red-500">
                {(errors as any).amenities.message}
              </p>
            )}
          </div>
        </section>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-500">
        <Label>Meeting Link</Label>
          <p className="text-sm text-muted-foreground">
            You will get the link to join on the day of the session.
          </p>
        </div>
      )}
    </div>
  );
};
export default SessionMode;
