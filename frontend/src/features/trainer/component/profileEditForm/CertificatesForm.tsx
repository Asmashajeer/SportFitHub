import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
  useTrainerStore,
  type ICertification,
} from '../../store/useTrainerStore';
import { uploadService } from '@/service/upload.service';
import { TRAINER_STATUS, UPLOAD_TYPE } from '@/constants/constants';
import { trainerService } from '../../service/trainerService';
import toast from 'react-hot-toast';

interface CertificatesFormValues {
  documents: ICertificate[];
}
interface ICertificate {
  name: string;
  issuedAt: string | Date;
  validUpto: string | Date;
  url: string;
  file?: File;
}
interface FormValues {
  documents: ICertificate[];
}
interface Props {
  initialData: ICertificate[];
  onCancel: () => void;

  onSuccess: () => void;
}

const CertificatesForm = ({ initialData, onCancel, onSuccess }: Props) => {
  const profile = useTrainerStore((state) => state.profile);
  const setProfile = useTrainerStore((state) => state.setProfile);
  const { register, control, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      documents: initialData || [],
    },
  });

  const isApproved = profile?.status === TRAINER_STATUS.APPROVED;
  const isRejected = profile?.status === TRAINER_STATUS.REJECTED;
  const isVerificationRequired = profile?.status === TRAINER_STATUS.VARIFICATION_REQUIRED;
  const canEditExisting = isRejected;
   const canAdd = isApproved || isRejected || isVerificationRequired; 

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  });

  const onSubmit = async (data: CertificatesFormValues) => {
    if (profile?.userId) {
      const userId = profile?.userId;
      const folderPath = `trainers/${userId}/${profile?.category}`;

      const uploadedCerts = await Promise.all(
        data.documents.map(async (doc: any) => {
          const newFile =  doc.file instanceof File ? doc.file : null;
          if (newFile) {
            console.log('New file detected for:', doc.name);
            const [url] = await uploadService.upload(
              newFile,
              `${folderPath}/certifications`,
              userId,
              UPLOAD_TYPE.CERTIFICATES
            );
            return {
              name: doc.name,
              url: url,
              validUpto: doc.validUpto,
              issuedAt: doc.issuedAt,
            };
          }
          if (doc.url) {
          // if(url){
            return {
              name: doc.name,
              url: doc.url,
              validUpto: doc.validUpto,
              issuedAt: doc.issuedAt,
            };
          }
          return null;
        })
      );
      console.log(uploadedCerts);
      if (uploadedCerts === null) {
        toast.custom('please add atleast  oneCertificate');
        return;
      } else {
        const cleanCerts: ICertification[] = uploadedCerts.map((cert) => ({
          name: cert!.name,
          url: cert!.url,
          validUpto: cert!.validUpto,
          issuedAt: cert!.issuedAt,
        }));

        try {
          if (profile) {
            const updatedData = await trainerService.updateCertificationInfo(
              profile?.id,
              cleanCerts
            );
            toast.success('Certificates updated ');
            setProfile(updatedData.profile);
            onSuccess();
          }
        } catch (error) {
          toast.error(error?.toString() || 'Something went wrong');
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
     
        {fields.map((field, index) => {
          const isExisting = index < initialData.length; // existing cert
          const isLocked =  isExisting && !canEditExisting; 
          return( 
            <div
              key={field.id}
              className="p-4 border rounded-lg relative space-y-4 bg-background/50"
            >
              <p className='text-[10px] text-amber-400'>* changes in certificates require admin Approval</p>
              {!isLocked &&(
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <Trash2 size={16} />
                </Button>
              )}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="hidden"
                  {...register(`documents.${index}.url` as const)}
                />
                {/* Certificate Name */}
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input {...register(`documents.${index}.name` as const)} 
                  disabled={isLocked}/>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Document</Label>
                  <Input
                    type="file"
                     disabled={isLocked}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue(`documents.${index}.file`, file);
                      }
                    }}
                  />
                </div>

                {/* Dates */}
                <div className="space-y-2">
                  <Label>Issued At</Label>
                  <Input
                    type="date"
                    {...register(`documents.${index}.issuedAt` as const)}
                     disabled={isLocked}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Valid Until</Label>
                  <Input
                    type="date"
                    {...register(`documents.${index}.validUpto` as const)}
                     disabled={isLocked}
                  />
                </div>
              </div>
               {isLocked && (
                <p className="text-[10px] text-muted-foreground">
                  Existing certificates cannot be edited after approval.
                </p>
              )}
            </div>
        )})}
      {/* } */}
      <div className="flex justify-between mt-4">
        {canAdd && 
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({ name: '', issuedAt: '', validUpto: '', url: '' })
            }
          >
            <Plus size={16} className="mr-2" /> Add Certificate
          </Button>
        }
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-trainer-primary">
            Save Changes
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CertificatesForm;
