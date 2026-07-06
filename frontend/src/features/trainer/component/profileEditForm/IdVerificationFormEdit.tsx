import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GOVT_ID_TYPE,
  UPLOAD_TYPE,
  type Govt_Id_type,
} from '@/constants/constants';

import { useForm } from 'react-hook-form';
import type { idVerification } from '../../types/trainerprofile.types';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { trainerService } from '../../service/trainerService';
import { useTrainerStore } from '../../store/useTrainerStore';
import { uploadService } from '@/service/upload.service';
import toast from 'react-hot-toast';

interface props {
  initialData: { idType: Govt_Id_type; idNumber: string };
  onCancel: () => void;
}

const IdVerificationFormEdit = ({ initialData, onCancel }: props) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const form = useForm<idVerification>({ defaultValues: initialData });
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = form;

  const selectedIDType = watch('idType');
  const onSubmit = async (data: idVerification) => {
    if (profile) {
      const userId = profile?.userId;
      const folderPath = `trainers/${userId}/${profile?.category}`;

      try {
        if (data.idAttachment?.[0]) {
          const [url] = await uploadService.upload(
            data.idAttachment?.[0],
            folderPath,
            userId,
            UPLOAD_TYPE.ID_ATTACHMENT
          );
          if (url) {
            const idverifcationInfo = {
              idType: data.idType,
              idNumber: data.idNumber,
              idAttachment: url,
            };
            const updatedData = await trainerService.updateIdverification(
            profile?.id,
              idverifcationInfo
            );
            setProfile(updatedData.profile);
            onCancel();
          }
          toast.error('fileupload failed');
        }
      } catch (error) {
        toast.error(error?.toString() || 'Something went wrong');
      }
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-2 border-2 p-4 my-4"
      >
        <p className='text-[10px] text-amber-400'>* changes in ID Document require admin Approval</p>

        <div className=" flex items-start gap-3 p-3">
          <FormField
            control={control}
            name="idType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID Document</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="select ID document Type" />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {Object.values(GOVT_ID_TYPE).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <Label>ID Number</Label>
            <Input
              {...register('idNumber', {
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
            {errors?.idNumber && (
              <p className="text-xs text-red-500">{errors.idNumber.message}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label>Upload ID Proof (Photo/PDF)</Label>
          <input
            type="file"
            className=""
            {...register('idAttachment', {
              required: 'ID attachment is required',
            })}
          />
          {errors?.idAttachment && (
            <p className="text-xs text-red-500">
              {errors.idAttachment.message}
            </p>
          )}
        </div>
        <div className="flex  justify-end gap-3">
          <Button type="submit">Submit</Button>
          <Button type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default IdVerificationFormEdit;
