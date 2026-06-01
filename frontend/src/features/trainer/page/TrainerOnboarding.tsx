import { useForm, FormProvider } from 'react-hook-form';

import { useState } from 'react';
import {
  GENDER,
  GOVT_ID_TYPE,
  TRAINER_CATEGORY,
  UPLOAD_TYPE,
} from '@/constants/constants';
import type {
  DocumentValues,
  TrainerOnboardingFormValues,
} from '../types/trainerprofile.types';
import toast from 'react-hot-toast';

import BasicInfoForm from '../component/addProfile/BasicInfo';
import ProfessionalInfoForm from '../component/addProfile/ProfessionalInfoForm';
import PersonalInfoForm from '../component/addProfile/PersonalInfo';
import Rates_ScheduleForm from '../component/addProfile/Rates_ScheduleForm';
import FinancialInfoForm from '../component/addProfile/FinancialInfoForm';
import { trainerService } from '../service/trainerService';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { AddTrainerProfileSchema } from '../types/trainer.profile.schema';
import { uploadService } from '@/service/upload.service';

import { useNavigate } from 'react-router-dom';

const TrainerOnboarding = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const form = useForm<TrainerOnboardingFormValues>({
    defaultValues: {
      // Step 1: Basic info
      displayName: '',
      category: TRAINER_CATEGORY.SPORT,
      coreDiscipline: '',
      bio: '',
      profilePic: null,

      // Step 2: Professional
      specialties: [], //
      experience: 0,
      languages: ['English'],
      certificationInfo: {
        documents: [],
      },

      // Step 3: Identity & Personal
      personalInfo: {
        fullName: '',
        DOB: '',
        gender: GENDER.OTHER,
        phone: '',
        address: {
          street: '',
          city: '',
          state: '',
          zip: '',
        },
      },
      idVerification: {
        idType: GOVT_ID_TYPE.AADHAR,
        idNumber: '',
        idAttachment: null,
      },

      // Step 4: Availability & Price
      currentLocation: {
        type: 'Point',
        coordinates: [0, 0],
      },
      pricing: {
        sessionCharge: undefined,
      },
      availability: {
        isAvailable: false,
        Monday: { available: false, startTime: '09:00', endTime: '17:00' },
        Tuesday: { available: false, startTime: '09:00', endTime: '17:00' },
        Wednesday: { available: false, startTime: '09:00', endTime: '17:00' },
        Thursday: { available: false, startTime: '09:00', endTime: '17:00' },
        Friday: { available: false, startTime: '09:00', endTime: '17:00' },
        Saturday: { available: false, startTime: '09:00', endTime: '17:00' },
        Sunday: { available: false, startTime: '09:00', endTime: '17:00' },
      },
      // Step 5: Financial
      paymentInfo: {
        bankAccount: {
          accountName: '',
          accountNumber: '',
          bankName: '',
          ifscCode: '',
        },
        upiId: '',
      },
    },

    mode: 'onChange', //Validates when a user clicks away from an input
  });

  const nextStep = async (fields: string[]) => {
    // This 'trigger' only checks the fields in the current card
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: TrainerOnboardingFormValues) => {
    setIsSubmitting(true);
    try {
      const userId = user?.id;
      if (!userId) {
        toast.error('User session expired. Please log in again.');
        return;
      }
      const folderPath = `trainers/${userId}/${data.category}`;
      // 1. Upload Profile Picture
      let profilePicUrl = '';
      if (data.profilePic?.[0]) {
        [profilePicUrl] = await uploadService.upload(
          data.profilePic[0],
          `${folderPath}/profiles`,
          userId!,
          UPLOAD_TYPE.PROFILE_PIC
        );
      }

      // 2. Upload ID Attachment
      let idAttachmentUrl = '';
      if (data.idVerification.idAttachment?.[0]) {
        [idAttachmentUrl] = await uploadService.upload(
          data.idVerification.idAttachment?.[0],
          `${folderPath}/idAttachment`,
          userId!,
          UPLOAD_TYPE.ID_ATTACHMENT
        );
      }

      // 3. Upload Certifications Array
      const uploadedCerts = await Promise.all(
        data.certificationInfo.documents.map(async (doc: DocumentValues) => {
          if (doc.file?.[0]) {
            const [url] = await uploadService.upload(
              doc.file[0],
              `${folderPath}/certifications`,
              userId!,
              UPLOAD_TYPE.CERTIFICATES
            );
            return {
              name: doc.name,
              url,
              validUpto: doc.validUpto,
              issuedAt: doc.issuedAt,
            };
          }
          return null;
        })
      );

      const validCerts = uploadedCerts.filter((cert) => {
        return cert !== null;
      });
      // final Payload
      const payload = {
        ...data,
        profilePic: profilePicUrl,
        idVerification: {
          ...data.idVerification,
          idAttachment: idAttachmentUrl,
        },
        personalInfo: {
          ...data.personalInfo,
          DOB: new Date(data.personalInfo.DOB),
        },
        certificationInfo: {
          documents: validCerts,
        },
      };
      const finalPayload = AddTrainerProfileSchema.safeParse(payload);
      if (!finalPayload.success) {
        const errorMessage = finalPayload.error.issues[0].message;
        toast.error(errorMessage);
        console.log(errorMessage);
        setIsSubmitting(false);
        return;
      }
      console.log('Final Payload:', finalPayload.data);
      const result = await trainerService.addProfile(finalPayload.data);
      if (result.success) {
        toast.success('Application submitted successfully!');
        setHasProfile(true);
        navigate('/trainer/dashboard');
      }
    } catch (error) {
      toast.error((error as string) || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 3. Wrap everything in FormProvider */}
      <FormProvider {...form}>
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Become a Trainer
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              "Your skills. Their growth. Start your coaching journey today."
              "Inspire. Train. Transform. Become a{' '}
              <span className="text=primary">SportFit</span>Hub Coach
            </p>
          </div>

          <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {step === 1 && (
              <BasicInfoForm
                previewUrl={previewUrl}
                setPreviewUrl={setPreviewUrl}
                onNext={nextStep}
              />
            )}
            {step === 2 && (
              <ProfessionalInfoForm onNext={nextStep} onBack={prevStep} />
            )}
            {step === 3 && (
              <PersonalInfoForm onNext={nextStep} onBack={prevStep} />
            )}
            {step === 4 && (
              <Rates_ScheduleForm onNext={nextStep} onBack={prevStep} />
            )}
            {step === 5 && (
              <FinancialInfoForm
                onBack={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </div>
      </FormProvider>
    </div>
  );
};

export default TrainerOnboarding;
