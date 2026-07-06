import React, { useState } from 'react';
import {
  useFormContext,
  useFieldArray,
  type FieldArrayPath,
  type FieldPath,
} from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Languages, Trash2,  CornerDownLeftIcon } from 'lucide-react';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';
import { FILE_RULES } from '@/utils/fileValidation';
import { COMMON_LANGUAGES, DISCIPLINE_SPECIALTIES } from '@/constants/constants';


interface ProfessionalInfoFormProps {
  onNext: (fields: any[]) => void;
  onBack: () => void;
}

const ProfessionalInfoForm: React.FC<ProfessionalInfoFormProps> = ({
  onNext,
  onBack,
}) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    getValues,
    control,
    setError,
    clearErrors,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certificationInfo.documents' as FieldArrayPath<TrainerOnboardingFormValues>, //  schema key
  });

 
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newLang, setNewLang] = useState('');

  const specialties = watch('specialties') || [];
  const languages = watch('languages') || [];

  const coreDiscipline = watch('coreDiscipline')||'';
  const suggestions = (
    DISCIPLINE_SPECIALTIES[coreDiscipline?.toLowerCase()] || []
  ).filter((s) => !specialties.includes(s));

  const languageSuggestions = COMMON_LANGUAGES.filter(
  (l) => !languages.includes(l)
);
  

  //  to add to arrays in form state
  const addToArray = (
    field: 'specialties' | 'languages',
    value: string,
    setter: (v: string) => void
  ) => {
    const currentArray = getValues(field) || [];
    if (value.trim() && !currentArray.includes(value.trim())) {
      const val=value.trim()[0].toUpperCase() + value.trim().slice(1);
      setValue(field, [...currentArray, val, ],{
        shouldValidate: true,
        shouldDirty: true,
      });
      setter('');
    }
  };

  const removeFromArray = (
    field: 'specialties' | 'languages',
    item: string
  ) => {
    const currentArray = getValues(field) || [];
  
    const updatedArray = currentArray.filter((i: string) => i !== item);
    setValue(field, updatedArray, { shouldValidate: true, shouldDirty: true });
    if (updatedArray.length === 0) {
      setError(field, { message: 'Add minimum one ' }, { shouldFocus: true });
    } else clearErrors(field);
  };

  const currentFields = [
    'experience',
    'specialties',
    'languages',
    'certificationInfo.documents',
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Professional Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Experience  */}
        <div className="space-y-2">
          <Label htmlFor="experience">Years of Experience</Label>
          <div  className="flex items-center ">
            <Input
              id="experience"
              type="number"
              min={0}
              max={60}
              {...register('experience', {
                valueAsNumber: true,
                required: 'Required',
                min: { value: 0, message: 'Cannot be negative' },
                max: { value: 60, message: 'Enter a valid range' },
              })}
              placeholder="e.g. 5"
            /><span className="text-xs px-1 text-zinc-400">Yrs</span>
            </div>
          {errors.experience && (
            <p className="text-destructive text-sm">
              {errors.experience.message}
            </p>
          )}
        </div>

        {/* Specialties Section */}
        <div className="space-y-3">
          <Label>Specialties</Label>
          {/*  Suggestions based on coreDiscipline */}
            {suggestions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggested for {coreDiscipline}:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() =>
                        addToArray('specialties', suggestion, setNewSpecialty)
                      }
                      className="px-2 py-1 text-xs rounded-full border border-dashed 
                                border-muted-foreground text-muted-foreground 
                                hover:border-primary hover:text-primary transition-colors"
                    >
                      + {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          <div className="flex gap-2">
            <Input
              value={newSpecialty}
              onChange={(e) => {
                clearErrors('specialties');
                setNewSpecialty(e.target.value);
              }}
              placeholder="Add skills and enter..."
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (e.preventDefault(),
                addToArray('specialties', newSpecialty, setNewSpecialty))
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                addToArray('specialties', newSpecialty, setNewSpecialty)
              }
            >
              <CornerDownLeftIcon className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {specialties.map((s) => (
              <Badge key={s} variant="secondary">
                {s}
                <button
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    removeFromArray('specialties', s);
                  }}
                  className="ml-1 focus:outline-none"
                >
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                </button>
              </Badge>
            ))}
          </div>          
          {errors.specialties && (
            <p className="text-destructive text-sm">
              {errors.specialties.message}
            </p>
          )}
        </div>

        {/* Languages Section */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Languages className="h-4 w-4" /> Languages Spoken
          </Label>
          {/* language suggestions */}
           {languageSuggestions.length > 0 && (
            <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {languageSuggestions.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => addToArray('languages', lang, setNewLang)}
                      className="px-2 py-1 text-xs rounded-full border border-dashed
                                border-muted-foreground text-muted-foreground
                                hover:border-primary hover:text-primary transition-colors"
                    >
                      + {lang}
                    </button>
                  ))}
                </div>
              </div>
            )}
          <div className="flex gap-2">
            <Input
              value={newLang}
              onChange={(e) => setNewLang(e.target.value)}
              placeholder="e.g. Hindi, Malayalam"
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (e.preventDefault(),
                addToArray('languages', newLang, setNewLang))
              }
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => addToArray('languages', newLang, setNewLang)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((l) => (
              <Badge  key={l}
                variant="outline"
                className="border-primary/30 "
              >{l}
                <button
                type="button" 
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation(); 
                  removeFromArray('languages', l);
                }}
                className="ml-1 focus:outline-none"
              >
                  <X className="h-3 w-3 cursor-pointer hover:text-destructive" />
                </button>                
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Certifications & Licenses</Label>
            {errors.certificationInfo && (
              <p className="text-xs text-red-500 mt-1">
               upload Certificates and  enter details
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                clearErrors('certificationInfo.documents');
                append({ name: '', file: null });
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="p-4 border rounded-lg bg-card space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <Input
                  placeholder="e.g. CPR Certification"
                  {...register(
                    `certificationInfo.documents.${index}.name` as FieldPath<TrainerOnboardingFormValues>,
                    { required: 'Name is required' }
                  )}
                />

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-start justify-around ">
                {/* issuedAt */}
                <div>
                  <Label>Issued At</Label>
                  <Input
                    type="date"
                    required
                    {...register(
                      `certificationInfo.documents.${index}.issuedAt` as FieldPath<TrainerOnboardingFormValues>,
                      { required: 'Issue date is required' }
                    )}
                    className="w-full pl-12 pr-4 py-3  [&::-webkit-calendar-picker-indicator]:invert rounded-xl bg-secondary/60 border border-[#454c59] text-white"
                  />
                </div>
                {/* Valid upto */}
                <div>
                  <Label>Valid upto</Label>
                  <Input
                    type="date"
                    required
                    {...register(
                      `certificationInfo.documents.${index}.validUpto` as FieldPath<TrainerOnboardingFormValues>,
                      { required: 'Expiry date is required'}
                    )}
                    className="w-full pl-12 pr-4 py-3 rounded-xl [&::-webkit-calendar-picker-indicator]:invert bg-secondary/60 border border-[#454c59] text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept={FILE_RULES.certification.accept}
                  {...register(
                    `certificationInfo.documents.${index}.file` as FieldPath<TrainerOnboardingFormValues>,
                    { required: 'file is required',
                      validate: {
                        fileType: (value) => {
                          const fileList = value as FileList | null;
                          const file = fileList?.[0];
                          if (!file) return true;
                          return file.type==='application/pdf'|| 'Only  pdf  files are allowed';
                        },
                        fileSize: (value) => {
                          const fileList = value as FileList | null;
                          const file = fileList?.[0];
                          if (!file) return true;
                          return file.size <= 5 * 1024 * 1024 || 'File must be under 5MB';
                        },
                      },
                     }
                  )}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button
          onClick={() => {
            if (specialties.length === 0) {
              setError('specialties', {
                type: 'manual',
                message: 'At least one specialty required',
              });
              return;
            }
            const docs = getValues('certificationInfo.documents');
            if (!docs || docs.length === 0) {
              setError('certificationInfo.documents', {
                type: 'manual',
                message: 'please upload certificates',
              });
              return;
            }
            onNext(currentFields);
          }}
          className="flex-1"
        >
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalInfoForm;
