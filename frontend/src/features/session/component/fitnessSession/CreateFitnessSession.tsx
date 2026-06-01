import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import {
  Trash2,
  CheckCircle,
  Clock,
  Image as ImageIcon,
  Tag,
  X,
  Minus,
  Plus,
} from 'lucide-react';
import {
  AGE_GROUP,
  DAYS_OF_WEEK,
  GENDER,
  INTENSITY_LEVEL,
  SESSION_MODE,
  SESSION_TYPE,
  TIME_PERIOD,
  type DayName,
} from '@/constants/constants';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

import { uploadService } from '@/service/upload.service';
import { useAuthStore } from '@/features/auth/store/useAuthStore';

import toast from 'react-hot-toast';
import { useEffect, useMemo, useState } from 'react';

import type { FitnessData } from '@/features/admin/store/types';
import { useTrainerStore } from '@/features/trainer/store/useTrainerStore';
import { useSessionStore } from '../../store/useSessionStore';

import SessionMode from '../SessionMode';
import type {
  FitnessSessionFormValues,
  FitnessSessionResponseData,
  TimeSlot,
} from '../../store/fitness.session.types';
import { fitnessSessionService } from '../../service/fitnessSessionService ';
import { formatTo12Hour } from '@/utils/formatDate';

const initialData = {
  fitnessCategory: '',
  sessionName: '',
  slug: '',
  description: '',
  duration: Number(Object.keys(TIME_PERIOD)[0]),
  ageGroup: AGE_GROUP.ALL,
  gender: GENDER.ALL,
  sessionType: SESSION_TYPE.ONE_ONE,
  maxCapacity: 1,
  enrolledCount: 0,
  intensityLevel: INTENSITY_LEVEL.BEGINNER,
  mode: SESSION_MODE.OFFLINE,
  meetingLink: '',

  venue: {
    name: '',
    address: '',
    location: {
      type: 'Point' as const,
      coordinates: [0, 0] as [number, number],
    },
  },
  requirements: '',
  images: null,
  pricing: [{ sessionCount: 1, price: 100 }],
  timeSlots: [
    {
      day: DAYS_OF_WEEK[0],
      slots: [
        {
          startTime: '09:00',
          endTime: '10:00',
        },
      ],
    },
  ],
  amenities: '',
  cancellationPolicy:
    'Full refund available if cancelled at least 24 hours before start time. Late cancellations or no-shows are non-refundable.',
  cancellationWindow: 24,
  bookingDeadline: 2,
};

interface Props {
  isOpen: boolean;
  isEditing: boolean;
  onSuccess: () => void;
  onClose: () => void;
  sessionToEdit?: FitnessSessionResponseData | null;
}
const CreateFitnessSessionModal = ({
  isOpen,
  isEditing,
  sessionToEdit,
  onSuccess,
  onClose,
}: Props) => {
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const { profile, fetchProfile } = useTrainerStore();
  const { user } = useAuthStore();
  const { fitness, setFitness } = useSessionStore();
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [fitnessId,setFitnessId]=useState('');   //fitness category id to add to slug
  const form = useForm<FitnessSessionFormValues>({
    defaultValues: initialData,
  });
  const {
    reset,
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const {
    fields: pricingFields,
    append: addPrice,
    remove: removePrice,
  } = useFieldArray({ control, name: 'pricing' });
  const {
    fields: slotFields,
    append: addSlot,
    remove: removeSlot,
  } = useFieldArray({ control, name: 'timeSlots' });

  //  to get available programs
  useEffect(() => {
    fetchProfile();
    const getFitnessCategory = async () => {
      const data = await fitnessSessionService.getAvailableFitnessPgms();
      setFitness(data.fitnessPgms);
    };
    getFitnessCategory();
  }, []);

  //to get trainer working day
  useEffect(() => {
    if (profile) {
      const workingDays = DAYS_OF_WEEK.filter((day) => {
        return profile?.availability?.[day]?.available === true;
      });
      console.log('AvailableDays:    ', workingDays);
      setAvailableDays(workingDays);
    }
  }, [profile]);

  useEffect(() => {
    console.log(sessionToEdit);
    if (isEditing && sessionToEdit) {
      setExistingImages(sessionToEdit.images || []);
      const initialAmenities = Array.isArray(sessionToEdit.amenities)
        ? sessionToEdit.amenities.join(', ')
        : '';
      const initialRequirements = Array.isArray(sessionToEdit.requirements)
        ? sessionToEdit.requirements.join(', ')
        : '';

      const flattenedSlots = sessionToEdit.timeSlots.flatMap((dayGroup) =>
        dayGroup.slots.map((slot) => ({
          day: dayGroup.day,
          slots: [slot], // Keep as array to match your register path: .slots.0.startTime
        }))
      );

      reset({
        ...sessionToEdit,
        amenities: initialAmenities, //convert string of aminities into a string eg: water,restroom
        requirements: initialRequirements,
        images: null,
        timeSlots: flattenedSlots,
      });
    } else {
      setExistingImages([]);
      reset(initialData);
    }
  }, [isEditing, sessionToEdit, reset]);

  // to get fitness program and add to slug
  const fitpgm = useMemo(() => 
        fitness.find(ft => ft.id === fitnessId), 
      [fitness, fitnessId]);
  const handleSlug = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const session_slug = value+'-'+fitpgm?.programName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces with hyphens
      .replace(/^-+|-+$/g, ''); // Trim hyphens from ends
    setValue('slug', session_slug, { shouldValidate: true });
  };

  const timeToMinutes = (time: string) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  const checkInWorkingHours = (
    day: DayName,
    startTime: string,
    endTime: string
  ) => {
    const workingDay = profile?.availability?.[day];

    if (!workingDay || !workingDay.available) return false;

    if (workingDay.startTime && workingDay.endTime) {
      const sessionStart = timeToMinutes(startTime);
      const sessionEnd = timeToMinutes(endTime);
      const trainerStart = timeToMinutes(workingDay.startTime);
      const trainerEnd = timeToMinutes(workingDay.endTime);
      // Check if session start is >= trainer start AND session end is <= trainer end
      return sessionStart >= trainerStart && sessionEnd <= trainerEnd;
    }
  };

  //  check sessions are overlaped each other
  const checkInternalOverlap = (timeSlots: any[]) => {
    const dayGroups = timeSlots.reduce((acc, curr) => {
      acc[curr.day] = acc[curr.day] || [];
      acc[curr.day].push(curr.slots[0]);
      return acc;
    }, {});

    for (const day in dayGroups) {
      const sorted = dayGroups[day].sort((a: any, b: any) =>
        a.startTime.localeCompare(b.startTime)
      );
      for (let i = 0; i < sorted.length - 1; i++) {
        if (sorted[i].endTime > sorted[i + 1].startTime) {
          return {
            hasConflict: true,
            message: `Time conflict on ${day} - ${sorted[i].endTime} & ${sorted[i + 1].startTime}`,
          };
        }
      }
    }
    return { hasConflict: false };
  };

  const onSubmit = async (formData: FitnessSessionFormValues) => {
    fetchProfile();
    if (!profile) {
      toast.error(' trainer data not available');
      return;
    }
    const conflict = checkInternalOverlap(watch('timeSlots'));
    if (conflict.hasConflict) {
      toast.error(conflict?.message || 'Time overlap');
    }
    const formattedAmenities = formData.amenities
      ? formData.amenities
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item !== '')
      : [];
    const formattedRequirements = formData.requirements
      ? formData.requirements
          .split(',')
          .map((item: string) => item.trim())
          .filter((item: string) => item !== '')
      : [];
      if(formData.mode===SESSION_MODE.OFFLINE && !formData.venue?.location){
        toast.error("select location from map");
        return;
      }
      else if(formData.mode===SESSION_MODE.ONLINE &&! formData.meetingLink){
         toast.error("Add online meetlink");return;
      }
    if (user) {
      //grouping timeslotsby day
      const groupedSlots = formData.timeSlots.reduce<TimeSlot[]>(
        (acc, curr) => {
          const newSlot = Array.isArray(curr.slots)
            ? curr.slots[0]
            : curr.slots;

          // Check if we already have this day
          const existingDay = acc.find((item) => item.day === curr.day);

          if (existingDay) {
            // If Monday already exists, just push the new time slot into its array
            existingDay.slots.push(newSlot);
          } else {
            // If this is the first time seeing this day, create the entry
            acc.push({
              day: curr.day,
              slots: [newSlot],
            });
          }
          return acc;
        },
        []
      );
      try {
        let finalImageUrls = [...existingImages];

        if (formData.images && formData.images.length > 0) {
          const userId = user?.id;
          const folderPath = `fitness/${userId}`;
          const newUrls = await uploadService.upload(
            formData.images,
            folderPath,
            userId,
            'session_gallery'
          );
          finalImageUrls = [...finalImageUrls, ...newUrls];
        }
        if (finalImageUrls.length) {
          const sessionData = {
            ...formData,
            amenities: formattedAmenities,
            requirements: formattedRequirements,
            trainerId: profile.id,
            images: finalImageUrls,
            timeSlots: groupedSlots,
          };

          if (isEditing && sessionToEdit) {
            await fitnessSessionService.updateSession(
              sessionToEdit?.id,
              sessionData
            );
            toast.success('A fitness session Updated');
          } else {
            await fitnessSessionService.addSession(sessionData);
            toast.success('A fitness  session Added');
          }
          onSuccess();
          onClose();
        } else toast.error('failed to create session');
      } catch (error) {
        toast.error(error?.toString() || 'failed to create session');
      }
    }

    // onClose();
  };
  const handleSelectChange = (name: any, value: string) => {
    setValue(name, value, { shouldValidate: true });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className=" w-full max-w-6xl max-h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-card">
          <div>
            <h2 className="text-xl font-bold text-slate-400">
              {isEditing ? 'Edit fitness Session' : 'Create Fitness Session'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isEditing ? 'update the ' : 'Fill in all'} details to publish
              your coaching program.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form Content - Scrollable Area */}
        <FormProvider {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="overflow-y-auto p-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Identity */}
                <section className="space-y-4 bg-card p-5">
                  <h3 className="flex items-center gap-2 font-bold text-green-600">
                    <Tag size={18} /> 1. Identity
                  </h3>
                  {/* fitnessCategory */}
                  <div className="flex items-center gap-2">
                    <Label className=" text-slate-400">Fitness category</Label>
                    <Select
                      key={watch('fitnessCategory') || 'new-session'}
                      value={watch('fitnessCategory') || ''}
                      onValueChange={(val) =>{
                        setFitnessId(val)
                        handleSelectChange('fitnessCategory', val)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select fitness program " />
                      </SelectTrigger>
                      <SelectContent>
                        {fitness.length &&
                          fitness.map((program: FitnessData) => (
                            <SelectItem key={program.id} value={program.id}>
                              {program.programName}{' '}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* sessionName */}
                  <div className="flex items-center gap-2">
                    <Label>SessionName</Label>
                    <Input
                      {...register('sessionName', {
                        required: 'Session Name required',
                        minLength: {
                          value: 5,
                          message:
                            'Please enter a valid program name (min 5 chars)',
                        },
                      })}
                      onChange={(e) => handleSlug(e)}
                      placeholder="Session Name"
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    {errors?.sessionName && (
                      <p className="text-xs text-red-500">
                        {errors.sessionName.message}
                      </p>
                    )}
                  </div>
                  {/* slug */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor="slug" className="text-muted-foreground">
                      <span className="text-xs">Slug (Auto-generated</span> )
                    </Label>
                    <Input
                      {...register('slug')}
                      name="slug"
                      value={watch('slug')}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <Label>Description</Label>
                  <Textarea
                    {...register('description', {
                      required: 'Description required',
                    })}
                    placeholder="Describe the session experience..."
                    className="w-full p-2.5 border rounded-lg h-24"
                  />
                  {errors?.description && (
                    <p className="text-xs text-red-500">
                      {errors.description.message}
                    </p>
                  )}

                  <div className="  grid grid-cols-2 gap-8">
                    {/* duration */}
                    <div className="flex items-center gap-4">
                      <Label>Duration</Label>
                      <Select
                        key={watch('duration') || Object.keys(TIME_PERIOD)[0]}
                        value={watch('duration').toString() || ''}
                        onValueChange={(val) =>
                          setValue('duration', Number(val))
                        }
                        defaultValue={Object.keys(TIME_PERIOD)[0]}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TIME_PERIOD).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {/* age group */}
                    <div className="flex items-center gap-2">
                      <Label className=" text-slate-400">Age group</Label>
                      <Select
                        key={watch('ageGroup') || ''}
                        value={watch('ageGroup') || ''}
                        onValueChange={(val) =>
                          handleSelectChange('ageGroup', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Age Group" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(AGE_GROUP).map((age) => (
                            <SelectItem key={age} value={age}>
                              {age}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="  grid grid-cols-2 gap-8">
                    {/* session type-grup/one to one */}
                    <div className="flex items-center gap-2 ">
                      <Label className=" text-slate-400">Type</Label>
                      <Select
                        key={watch('sessionType') || ''}
                        value={watch('sessionType') || ''}
                        onValueChange={(val) =>
                          handleSelectChange('sessionType', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(SESSION_TYPE).map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {watch('sessionType') === SESSION_TYPE.GROUP && (
                        <div className="flex items-center gap-1 bg-card">
                          <Label className="text-xs text-slate-400">Max </Label>
                          <Input
                            {...register('maxCapacity', {
                              valueAsNumber: true,
                            })}
                            placeholder="Maximum Capacity"
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                          />
                          {errors?.maxCapacity && (
                            <p className="text-xs text-red-500">
                              {errors.maxCapacity.message}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    {/* gender           */}
                    <div className="flex items-center gap-2">
                      <Label className=" text-slate-400">Gender</Label>
                      <Select
                        key={watch('gender') || ''}
                        value={watch('gender') || ''}
                        onValueChange={(val) =>
                          handleSelectChange('gender', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(GENDER).map((gen) => (
                            <SelectItem key={gen} value={gen}>
                              {gen}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {/* intensity */}
                  <div className="  grid grid-cols-2 gap-8">
                    <div className="flex items-center gap-2">
                      <Label className=" text-slate-400">Intensity </Label>
                      <Select
                        key={watch('intensityLevel') || ''}
                        value={watch('intensityLevel') || ''}
                        onValueChange={(val) =>
                          handleSelectChange('intensityLevel', val)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select intensity Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(INTENSITY_LEVEL).map((lev) => (
                            <SelectItem key={lev} value={lev}>
                              {lev}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </section>
                {isEditing ? (
                  <SessionMode<FitnessSessionResponseData> />
                ) : (
                  <SessionMode<FitnessSessionFormValues> />
                )}
                <div className="p-2 border bg-card round'ed-lg">
                  <span className="text-xs font-bold text-slate-400 block mb-2">
                    Requirements
                  </span>
                  <Input
                    {...register('requirements', {
                      required: 'add   requirements  ',
                    })}
                    placeholder="Towel, yoga Mat..."
                    className="w-full text-sm outline-none"
                  />
                  {(errors as any)?.requirements && (
                    <p className="text-xs text-red-500">
                      {(errors as any).requirements.message}
                    </p>
                  )}
                </div>
              </div>

              {/* RIGHT COLUMN: The images,"When" and "How Much" */}
              <div className="space-y-8">
                <section className="grid gap-4 bg-card">
                  <Label> Images</Label>
                  {/* 1. Show existing images from the DB */}
                  {isEditing && existingImages.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {existingImages.map((url, index) => (
                        <div
                          key={url}
                          className="relative group aspect-square rounded-lg overflow-hidden border"
                        >
                          <img
                            src={url}
                            alt="Session"
                            className="object-cover w-full h-full"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setExistingImages((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 2. The File Input for NEW images */}
                  <div className="p-4 border border-gray-600 border-dashed rounded-lg text-center cursor-pointer hover:border-2 hover:border-green-800">
                    <ImageIcon className="mx-auto text-slate-300 mb-2" />
                    <span className="text-xs text-slate-500">
                      {isEditing ? 'Add more images' : 'Upload images'}
                    </span>
                    <Input
                      type="File"
                      {...register('images', {
                        required:
                          !isEditing && 'At least one image is required',
                      })}
                      multiple //  multi-selection
                      accept="image/*"
                      className="cursor-pointer"
                    />
                    {errors?.images && (
                      <p className="text-xs text-red-500">
                        {errors.images.message}
                      </p>
                    )}
                  </div>
                </section>
                {/* Pricing */}
                <section className="space-y-4 bg-card p-5">
                  <h3 className="flex items-center gap-2 font-bold text-primary">
                    3. Pricing Packages
                  </h3>
                  <div className="space-y-3">
                    <div className=" px-2 flex items-baseline gap-10 text-sm ">
                      <p>No: of Session</p>
                      <p>Price</p>
                    </div>

                    {pricingFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex gap-2 items-center border p-2 rounded-lg  shadow-sm animate-in slide-in-from-right-4"
                      >
                        <Input
                          type="number"
                          {...register(
                            `pricing.${index}.sessionCount` as const,
                            {
                              valueAsNumber: true,
                              required: 'please enter no. of session',
                            }
                          )}
                          placeholder="Qty"
                          className="w-16 p-1 border-b outline-none"
                        />

                        <span className="text-xs text-slate-400">sessions</span>

                        <Input
                          type="number"
                          {...register(`pricing.${index}.price` as const, {
                            valueAsNumber: true,
                            required: 'please enter price of session',
                          })}
                          placeholder="Price"
                          className="flex-1 p-1 border-b outline-none font-bold"
                        />
                        <Button
                          variant="ghost"
                          type="button"
                          onClick={() => removePrice(index)}
                          className="text-red-400"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addPrice({ sessionCount: 1, price: 0 })}
                      className="text-xs font-bold text-green-800"
                    >
                      + Add more Pricing{' '}
                    </button>
                  </div>
                </section>

                {/* Time Slots */}
                <section className="space-y-4 p-5 bg-card rounded-xl ">
                  <h3 className="flex items-center gap-2 font-bold text-green-700">
                    <Clock size={18} /> 4. Availability
                  </h3>
                  {slotFields.map((field, index) => {
                    const day = watch(`timeSlots.${index}.day`);
                    const start = watch(`timeSlots.${index}.slots.0.startTime`);
                    const end = watch(`timeSlots.${index}.slots.0.endTime`);
                    // Validation
                    const isWithinHours = checkInWorkingHours(day, start, end);
                    const hasError = start && end && !isWithinHours;
                    return (
                      <div
                        key={field.id}
                        className="grid grid-cols-2 gap-2 pb-2 border-b border-blue-100 last:border-0"
                      >
                        <Select
                          key={watch(`timeSlots.${index}.day` || '')}
                          value={watch(`timeSlots.${index}.day`) || ''}
                          onValueChange={(val) =>
                            handleSelectChange(`timeSlots.${index}.day`, val)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select day" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDays.map((day, index) => (
                              <SelectItem key={index} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Start Time Input */}
                        <div className="col-span-3 flex  justify-between">
                          <Label className="w-30">Start Time</Label>

                          <Input
                            type="time"
                            className="h-9"
                            {...register(
                              `timeSlots.${index}.slots.0.startTime` as const,
                              {
                                required: true,
                                onChange: (e) => {
                                  const newStart = e.target.value;
                                  const duration = watch('duration');
                                  const endTime = calculateEndTime(
                                    newStart,
                                    duration
                                  );
                                  setValue(
                                    `timeSlots.${index}.slots.0.endTime`,
                                    endTime
                                  );
                                },
                              }
                            )}
                          />
                        </div>
                        {hasError && (
                          <p className="text-[10px] text-red-600 font-bold ml-2">
                            ⚠️ Outside working hours (
                            {formatTo12Hour(
                              profile?.availability[day].startTime
                            )}{' '}
                            -{' '}
                            {formatTo12Hour(profile?.availability[day].endTime)}
                            )
                          </p>
                        )}
                        {/* End Time (Read Only) */}
                        <div className="col-span-3 flex  justify-between ;">
                          <Label className="w-30">End Time</Label>
                          <Input
                            type="time"
                            readOnly
                            placeholder="End Time"
                            className="h-9 border-dashed"
                            {...register(
                              `timeSlots.${index}.slots.0.endTime` as const
                            )}
                          />
                        </div>

                        <div className="col-span-2 flex justify-end">
                          <Button
                            variant="ghost"
                            type="button"
                            onClick={() => removeSlot(index)}
                            className="text-red-400 h-9"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => addSlot({ day: 'Monday', slots: [] })}
                    className="text-xs font-bold text-primary"
                  >
                    + Add Day Slot
                  </Button>
                </section>
                <section>
                  {/* Booking Deadline Field */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Booking Deadline (Hours)
                      </label>
                      <span className="text-xl font-black italic text-white leading-none">
                        {watch('bookingDeadline')}h
                      </span>
                    </div>

                    <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-2xl p-1 shadow-inner">
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            'bookingDeadline',
                            Math.max(0, watch('bookingDeadline') - 1)
                          )
                        }
                        className="flex-1 py-3 flex justify-center hover:bg-zinc-800 rounded-xl transition-colors text-zinc-400 hover:text-white"
                      >
                        <Minus size={18} />
                      </button>
                      <div className="w-0.5 h-6 bg-zinc-800" />
                      <button
                        type="button"
                        onClick={() =>
                          setValue(
                            'bookingDeadline',
                            watch('bookingDeadline') + 1
                          )
                        }
                        className="flex-1 py-3 flex justify-center hover:bg-zinc-800 rounded-xl transition-colors text-emerald-500"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <p className="text-[10px] text-zinc-600 font-medium">
                      Booking will close {watch('bookingDeadline')} hours before
                      the start time.
                    </p>
                  </div>
                  {/* Cancellation Policy Field */}
                  <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      Cancellation Policy
                    </label>
                    <textarea
                      {...register('cancellationPolicy')}
                      rows={3}
                      className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 text-sm text-zinc-300 placeholder:text-zinc-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all resize-none"
                      placeholder="Describe your refund rules..."
                    />
                    {errors.cancellationPolicy && (
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
                        {errors.cancellationPolicy.message}
                      </span>
                    )}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                      Cancellation Window
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[12, 24, 48].map((hrs) => (
                        <button
                          key={hrs}
                          type="button"
                          onClick={() => {
                            setValue('cancellationWindow', hrs);
                            setValue(
                              'cancellationPolicy',
                              `Full refund if cancelled at least ${hrs} hours before start.`
                            );
                          }}
                          className={`py-2 rounded-xl border text-[10px] font-black uppercase transition-all
                              ${
                                watch('cancellationWindow') === hrs
                                  ? 'bg-emerald-500 border-emerald-500 text-black'
                                  : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                              }`}
                        >
                          {hrs}h
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-12 flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-1.5 font-medium text-slate-600 hover:bg-slate-600 hover:text-black rounded-lg transition-all"
              >
                Cancel
              </button>
              <Button
                type="submit"
                className="px-10 py-2.5 text-white font-bold  hover:bg-green-600 shadow-sm rounded-lg shadow-green-500 transition-all flex items-center gap-2"
              >
                <CheckCircle size={18} />{' '}
                {isEditing ? 'Update Changes' : 'Publish Session'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
};
const calculateEndTime = (startTime: string, duration: number): string => {
  if (!startTime) return '';
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + duration;

  const endHours = Math.floor(totalMinutes / 60) % 24;
  const endMins = totalMinutes % 60;

  return `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
};
export default CreateFitnessSessionModal;
