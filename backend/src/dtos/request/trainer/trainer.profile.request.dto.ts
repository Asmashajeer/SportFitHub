import { CURRENCY, GENDER, GOVT_ID_TYPE, TRAINER_CATEGORY } from "@/constants/enums";
import z from "zod";
const MAX_FILE_SIZE= 2*1024*1024;
// 1.
export const step1Schema = z.object({
  category: z.enum(['sport', 'fitness', 'both']),
  displayName: z.string().min(3, "Name must be at least 3 characters"),
  coreDiscipline: z.string().min(1, "Main discipline is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(1000),
  // Note: profilePic is validated as a File object on frontend

profilePic: z
  .instanceof(File, { message: "Please upload an image" })
  .refine((file) => file.size <= MAX_FILE_SIZE, "File too large")
});
export const step2Schema = z.object({
  specialties: z.array(z.string()).nonempty("Select at least one specialty"),
  experience: z.coerce.number().min(0, "Experience cannot be negative"),
  languages: z.array(z.string()).nonempty("Select at least one language"),
  // Note: certifications (Files) are handled by the form state
});

export const step3Schema = z.object({
  personalInfo: z.object({
    fullName: z.string().min(3, "Full name is required"),
    DOB: z.coerce.date().refine(data => data < new Date(), "Date of birth must be in the past"),
    gender: z.nativeEnum(GENDER),
    phone: z.string().min(10, "Valid phone number is required"),
    address: z.object({
      street: z.string().optional(),
      city: z.string().min(1, "City is required"),
      state: z.string().min(1, "State is required"),
      zip: z.string().min(1, "Zip code is required"),
    }),
  }),
  idVerification: z.object({
    idType: z.nativeEnum(GOVT_ID_TYPE),
    idNumber: z.string().min(1, "ID Number is required"),
  })
});


const daySchema = z.object({
  available: z.boolean(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

export const step4Schema = z.object({
  pricePerHour: z.coerce.number().positive("Price must be greater than 0"),
  availability: z.object({
    isAvailable: z.boolean().default(true),
    Monday: daySchema,
    Tuesday: daySchema,
    Wednesday: daySchema,
    Thursday: daySchema,
    Friday: daySchema,
    Saturday: daySchema,
    Sunday: daySchema,
  }),
  // currentLocation coordinates usually handled by a Map picker
});


export const step5Schema = z.object({
  paymentInfo: z.object({
    bankAccount: z.object({
      accountName: z.string().min(1, "Account holder name is required"),
      accountNumber: z.string().min(1, "Account number is required"),
      bankName: z.string().min(1, "Bank name is required"),
      ifscCode: z.string().min(1, "IFSC code is required"),
    }),
    upiId: z.string().optional(),
  })
});

























const dayAvailabilitySchema = z.object({
  available: z.boolean().default(false),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

const  documents=z.object({
  name:z.string(),
  url:z.url(),
  validUpto:  z.coerce.date() ,
  issuedAt:  z.coerce.date()
}).refine((data)=>{                             //check for validity of document
  return data.validUpto>new Date();
},{
  message:'This document is expired',
  path:['validUpto'],
});


export const AddTrainerProfileSchema=z.object({
    // --- Basic Info ---
  displayName: z.string().min(3, "Display name must be at least 3 characters"),
  category:z.enum(TRAINER_CATEGORY),
  mainDiscipline: z.string().min(1, "Main discipline is required"),
  bio: z.string().min(10, "Bio should be at least 10 characters").max(500),  
  profilePic: z.url(),
  //professionalInfo
  specialties: z.array(z.string()).min(1,"Select at least one specialty"),
  experience:z.number().min(0, "Experience cannot be negative"),
  languages:  z.array(z.string()).min(1,"Select at least one language"),
  certificationInfo:z.object({
      documents: z.array(documents),
  }),


  // Personal Info
  personalInfo:  z.object({
        fullName: z.string().min(3),
        DOB: z.coerce.date(), // Automatically converts date strings to Date objects
        gender: z.enum(GENDER),
        phone: z.string().min(10),
        address: z.object({
            street: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            zip: z.string().optional(),
        }).optional(),
  }),

  // ID Verification Info 
  idVerification: z.object({
      idType:z.enum(GOVT_ID_TYPE) , 
      idNumber: z.string().min(1, "ID Number is required"),
      idAttachment:z.url(),
  }),
  // Location
  currentLocation: z.object({
    type: z.literal('Point').default('Point'),
    coordinates: z.array(z.number()).length(2), // [lng, lat]
  }).optional(),

  // Availability
  availability:  z.object({
    isAvailable: z.boolean().default(true),
    Monday: dayAvailabilitySchema,
    Tuesday: dayAvailabilitySchema,
    Wednesday: dayAvailabilitySchema,
    Thursday: dayAvailabilitySchema,
    Friday: dayAvailabilitySchema,
    Saturday: dayAvailabilitySchema,
    Sunday: dayAvailabilitySchema,
  }),
  pricing: z.object({
    sessionCharge: z.coerce
      .number()
      .min(1, "Price must be at least 1")
      .max(10000, "Price seems too high"),
    currency: z.enum(CURRENCY),
}),
  
  paymentInfo:z.object({
    bankAccount: z.object({
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      bankName: z.string().optional(),
      ifscCode: z.string().optional(),
    }).optional(),
    upiId: z.string().optional(),
  }).optional(), 
  
});
export type AddTrainerProfileDTO=z.infer<typeof AddTrainerProfileSchema>