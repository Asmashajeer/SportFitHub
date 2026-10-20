import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Loader2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useTrainerStore, type ICertification } from '../../store/useTrainerStore';
import { uploadService } from '@/service/upload.service';
import { TRAINER_STATUS, UPLOAD_TYPE } from '@/constants/constants';
import { trainerService } from '../../service/trainerService';
import toast from 'react-hot-toast';
import { useState } from 'react';

interface CertificatesFormValues {
  documents: ICertificate[];
}
interface ICertificate {
  id?: string;
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
  const [isUpdating, setIsUpdating] = useState(false);
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'documents',
  });

  const onSubmit = async (data: CertificatesFormValues) => {
    setIsUpdating(true);
    if (profile?.userId) {
      const userId = profile?.userId;
      const folderPath = `trainers/${userId}/${profile?.category}`;

      const uploadedCerts = await Promise.all(
        data.documents.map(async (doc: any) => {
          const newFile = doc.file instanceof File ? doc.file : null;
          if (newFile) {
            console.log('New file detected for:', doc.name);
            const [url] = await uploadService.upload(newFile, `${folderPath}/certifications`, userId, UPLOAD_TYPE.CERTIFICATES);
            return {
              id: doc.id ?? crypto.randomUUID(),
              name: doc.name,
              url: url,
              validUpto: doc.validUpto,
              issuedAt: doc.issuedAt,
            };
          }
          if (doc.url) {
            return {
              id: doc.id ?? crypto.randomUUID(),
              name: doc.name,
              url: doc.url,
              validUpto: doc.validUpto,
              issuedAt: doc.issuedAt,
            };
          }
          return null;
        })
      );
      
      if (uploadedCerts === null) {
        toast.custom('Please add at least one certificate');
        setIsUpdating(false);
        return;
      } else {
        const cleanCerts: ICertification[] = uploadedCerts.map((cert) => ({
          id: cert!.id,
          name: cert!.name,
          url: cert!.url,
          validUpto: cert!.validUpto,
          issuedAt: cert!.issuedAt,
        }));

        try {
          if (profile) {
            const updatedData = await trainerService.updateCertificationInfo(profile?.id, cleanCerts);
            toast.success('Certificates updated');
            setProfile(updatedData.profile);
            onSuccess();
          }
        } catch (error) {
          toast.error(error?.toString() || 'Something went wrong');
        } finally {
          setIsUpdating(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-xs sm:text-xs w-full max-w-full overflow-hidden">
      {fields.map((field, index) => {
        const isExisting = index < initialData.length; // existing cert
        const isLocked = isExisting && !canEditExisting;
        return (
          <div key={field.id} className="p-4 sm:p-5 border rounded-lg relative space-y-4 bg-background/50">
            <p className="text-[10px] sm:text-xs text-amber-400">
              Changes in certificates require admin approval
            </p>
            {!isLocked && (
              <Button type="button" variant="ghost" onClick={() => remove(index)} className="absolute top-2 right-2 text-red-500 h-8 w-8 p-0">
                <Trash2 size={16} />
              </Button>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="hidden" {...register(`documents.${index}.url` as const)} />
              
              {/* Certificate Name */}
              <div className="space-y-1.5">
                <Label className="text-[10px] sm:text-xs uppercase">Name</Label>
                <Input {...register(`documents.${index}.name` as const)} disabled={isLocked} className="text-xs" />
              </div>

              {/* File Upload */}
              <div className="space-y-1.5">
                <Label className="text-[10px] sm:text-xs uppercase">Document</Label>
                <Input
                  type="file"
                  disabled={isLocked}
                  className="text-xs file:text-xs file:text-foreground"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setValue(`documents.${index}.file`, file);
                    }
                  }}
                />
              </div>

              {/* Dates */}
              <div className="space-y-1.5">
                <Label className="text-[10px] sm:text-xs uppercase">Issued At</Label>
                <Input type="date" {...register(`documents.${index}.issuedAt` as const)} disabled={isLocked} className="text-xs" />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] sm:text-xs uppercase">Valid Until</Label>
                <Input type="date" {...register(`documents.${index}.validUpto` as const)} disabled={isLocked} className="text-xs" />
              </div>
            </div>

            {isLocked && <p className="text-[10px] sm:text-xs text-muted-foreground">Existing certificates cannot be edited after approval.</p>}
          </div>
        );
      })}

      {/* Footer / Buttons */}
      <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 mt-4">
        {canAdd && (
          <Button type="button" variant="outline" onClick={() => append({ name: '', issuedAt: '', validUpto: '', url: '' })} className="w-full sm:w-auto text-xs">
            <Plus size={16} className="mr-2" /> Add Certificate
          </Button>
        )}
        <div className="flex flex-col-reverse sm:flex-row gap-2 w-full sm:w-auto">
          <Button type="button" variant="ghost" onClick={onCancel} className="w-full sm:w-auto text-xs">
            Cancel
          </Button>
          <Button type="submit" className="bg-trainer-primary w-full sm:w-auto text-xs" disabled={isUpdating}>
            {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isUpdating ? "Updating..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CertificatesForm;