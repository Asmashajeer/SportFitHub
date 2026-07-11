import { useForm, FormProvider } from 'react-hook-form';

import { useEffect, useState } from 'react';
import {
  AppName,
  GENDER,
  GOVT_ID_TYPE,  
  TRAINER_CATEGORY,
  UPLOAD_TYPE,
  USER_ROLES,
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
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

const TrainerOnboarding = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const setHasProfile = useAuthStore((state) => state.setHasProfile);
  const userId = user?.id;
  const CACHE_KEY = `trainer_onboarding_cache_${userId}`;
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasCachedData, setHasCachedData] = useState(false);

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



  useEffect(() => {
    if (!userId) return;
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { formData, savedStep } = JSON.parse(cached);
        form.reset(formData);
        setStep(savedStep || 1);
        setHasCachedData(true);
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }, [userId]);


    // save for each form change
    useEffect(() => {
    const subscription = form.watch((formData) => {     
      const cacheable = {
        ...formData,
        profilePic: null,                      //remove profilePic
        idVerification: {
          ...formData.idVerification,
          idAttachment: null,                         // remove idAttachment
        },
        certificationInfo: {
          documents: formData.certificationInfo?.documents?.map((doc: any) => ({
            ...doc,
            file: null,                         // remove certificateFile
          })),
        },
      };
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ formData: cacheable, savedStep: step })
      );
    });
    return () => subscription.unsubscribe();
  }, [form, step]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);


  const nextStep = async (fields: string[]) => {
    // This 'trigger' only checks the fields in the current card
    const isValid = await form.trigger(fields as any);
    if (isValid) {
      setStep((prev) => prev + 1);
      setHasCachedData(false); 
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
        localStorage.removeItem(CACHE_KEY);
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
        {user?.activeRole===USER_ROLES.USER && <Button  variant='ghost'onClick={()=>navigate('/user/dashboard')} className='flex justify-start'> <X className="w-6 h-6" />Close</Button>}
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Become a Trainer
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              "Your skills. Their growth. Start your coaching journey today."
              "Inspire. Train. Transform. Become a{' '}
              <span className="text=primary">{AppName}</span> Coach
            </p>
          </div>
          {hasCachedData && (
            <div className=" items-center justify-between p-3 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-600">
                You have an unfinished application. Resuming from step {step}.
              </p>
              <p className="text-xs text-amber-600 mt-1">
                ⚠️ Please re-upload any files (profile photo, ID, certificates) as they cannot be saved.
              </p>
              <button
                onClick={() => {
                  localStorage.removeItem(CACHE_KEY);
                  form.reset();
                  setStep(1);
                  setPreviewUrl(null);
                  setHasCachedData(false);
                }}
                className="text-xs text-red-300 underline ml-4"
              >
                Start fresh
              </button>
            </div>
          )}
         <div className="w-full">
            {/* Step Counter Text */}
            <div className="flex justify-between items-center mb-1 text-sm font-medium text-muted-foreground">
              <span>Progress</span>
              <span>Step {step} of 5</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
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
