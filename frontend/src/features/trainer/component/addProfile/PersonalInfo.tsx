import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { TrainerOnboardingFormValues } from '../../types/trainerprofile.types';
import { GENDER, GOVT_ID_TYPE } from '@/constants/constants';
import { Calendar, MapPin, Upload } from 'lucide-react';

interface PersonalInfoFormProps {
  onNext: (fields: any[]) => void;
  onBack: () => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  onNext,
  onBack,
}) => {
  const form = useFormContext<TrainerOnboardingFormValues>();
  const {
    register,
    watch,
    setValue,
    setError,
    getValues,
    formState: { errors },
  } = form;
  const handleSelectChange = (name: any, value: string) => {
    setValue(name, value, { shouldValidate: true });
  };

  const currentFields = [
    'personalInfo.fullName',
    'personalInfo.DOB',
    'personalInfo.phone',
    'personalInfo.gender',
    'personalInfo.address.street',
    'personalInfo.address.city',
    'personalInfo.address.zip',
    'idVerification.idType',
    'idVerification.idNumber',
  ];
  const selectedIDType = watch('idVerification.idType');
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Identity & Personal Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label> Full Name</Label>
          <Input
            {...register('personalInfo.fullName', {
              required: 'Full name is required',
              pattern: {
                value: /^[A-Za-z][A-Za-z\s]+$/,
                message: 'Discipline should only contain letters',
              },
            })}
            placeholder="As per your ID"
          />
          {errors?.personalInfo?.fullName && (
            <p className="text-xs text-red-500">
              {errors.personalInfo.fullName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Date of Birth
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <Input
              type="date"
              required
              value={watch('personalInfo.DOB')}
              {...register('personalInfo.DOB', {
                required: 'Date of Birth is required',
                validate: (v) =>
                  new Date(v) < new Date() || 'Date cannot be in the future',
              })}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-secondary/60 border border-[#454c59] text-white"
            />
          </div>
          {errors?.personalInfo?.DOB && (
            <p className="text-xs text-red-500">
              {errors.personalInfo.DOB.message}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phone Number */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              {...register('personalInfo.phone', {
                required: 'Phone is required',
                pattern: {
                  value: /^\+?[0-9]{10,15}$/,
                  message:
                    'Please enter a valid phone number (e.g., +1234567890)',
                },
                minLength: {
                  value: 10,
                  message: 'Phone number is too short',
                },
              })}
              placeholder="+91 00000 00000"
            />
            {errors?.personalInfo?.phone && (
              <p className="text-xs text-red-500">
                {errors.personalInfo.phone.message}
              </p>
            )}
          </div>

          {/* Gender  */}
          <div className="space-y-2">
            <Label>Gender</Label>
            <Select
              value={watch('personalInfo.gender')}
              onValueChange={(val) =>
                handleSelectChange('personalInfo.gender', val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(GENDER).map((type) => (
                  <SelectItem value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="pt-4 border-t flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            Address Details
          </span>
        </div>

        {/* Address Row: Street */}
        <div className="space-y-2">
          <Label>Street Address</Label>
          <Input
            {...register('personalInfo.address.street', {
              required: 'Required',
            })}
            placeholder="123 BA St."
          />
          {errors?.personalInfo?.address?.street && (
            <p className="text-xs text-red-500">
              {errors.personalInfo.address.street.message}
            </p>
          )}
        </div>

        {/* Address Row: City & Zip */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>City</Label>
            <Input
              {...register('personalInfo.address.city', {
                required: 'Required',
                minLength: { value: 2, message: 'Too short' },
              })}
              placeholder="City"
            />
            {errors?.personalInfo?.address?.city && (
              <p className="text-xs text-red-500">
                {errors.personalInfo.address.city.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Zip Code</Label>
            <Input
              {...register('personalInfo.address.zip', {
                required: 'Required',
                pattern: {
                  value: /^[0-9\s-]{5,10}$/,
                  message: 'Invalid zip code format',
                },
              })}
              placeholder="Zip eg: 000000"
            />
            {errors?.personalInfo?.address?.zip && (
              <p className="text-xs text-red-500">
                {errors.personalInfo.address.zip.message}
              </p>
            )}
          </div>
        </div>
        <hr className="my-4" />
        {/* ID Verification */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">
            Verification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ID Type */}
            <div className="space-y-2">
              <Label>ID Type</Label>
              <Select
                value={selectedIDType}
                onValueChange={(val) =>
                  handleSelectChange('idVerification.idType', val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="ID Type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(GOVT_ID_TYPE).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>ID Number</Label>
              <Input
                {...register('idVerification.idNumber', {
                  required: 'ID number is required',
                  validate: (value) => {
                    if (selectedIDType === GOVT_ID_TYPE.AADHAR) {
                      return (
                        /^\d{12}$/.test(value) ||
                        'Aadhaar must be exactly 12 digits'
                      );
                    }
                    if (selectedIDType === GOVT_ID_TYPE.PAN) {
                      return (
                        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value) ||
                        'Invalid PAN format (ABCDE1234F)'
                      );
                    }
                    if (selectedIDType === GOVT_ID_TYPE.PASSPORT) {
                      return (
                        value.length === 8 || 'Passport must be 8 characters'
                      );
                    }
                    if (selectedIDType === GOVT_ID_TYPE.DRIVING_LICENSE) {
                      return (
                        value.length === 15 ||
                        'Driving License must be 15 characters'
                      );
                    }
                    return true;
                  },
                })}
                placeholder="Enter ID Number"
              />
              {errors?.idVerification?.idNumber && (
                <p className="text-xs text-red-500">
                  {errors.idVerification.idNumber.message}
                </p>
              )}
            </div>
            {/* ID File Upload */}
            <div className="space-y-2">
              <Label>Upload ID Proof (Photo/PDF)</Label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-3">
                    <Upload className="w-5 h-5 mb-3" />
                    <p
                      className={`text-sm ${watch('idVerification.idAttachment') ? 'text-green-500' : 'text-gray-500'} `}
                    >
                      {watch('idVerification.idAttachment')
                        ? `File Uploaded:${watch('idVerification.idType')} `
                        : 'Click to upload ID attachment'}
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    {...register('idVerification.idAttachment', {
                      required: 'ID attachment is required',
                    })}
                  />
                  {errors?.idVerification?.idAttachment && (
                    <p className="text-xs text-red-500">
                      {errors.idVerification.idAttachment.message}
                    </p>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-4">
        <Button variant="ghost" onClick={onBack} className="w-1/3">
          Back
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            const idDoc = getValues('idVerification.idAttachment');
            if (!idDoc || idDoc.length === 0) {
              setError('idVerification.idAttachment', {
                message: 'please upload Id Document',
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
  );
};

export default PersonalInfoForm;
