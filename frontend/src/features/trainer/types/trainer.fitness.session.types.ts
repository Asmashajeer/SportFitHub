import type {
  AGE_GROUP,
  DayName,
  GenderType,
  Intensity_level_type,  
  Session_Mode_type,
  SESSION_TYPE,
} from '@/constants/constants';
// interface FitnessCategory {
//   id: string;
//   programName: string;
//   slug: string;
//   description: string;
// }

interface Venue {
  name: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

export interface TimeSlot {
  _id?: string;
  day: DayName;
  slots: {
    startTime: string; // "09:00"
    endTime: string; // "10:00"
    _id?: string;
  }[];
}

interface Pricing {
  _id?: string;
  sessionCount: number;
  price: number;
}

export interface FitnessSessionFormValues {
  fitnessCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: (typeof AGE_GROUP)[keyof typeof AGE_GROUP];
  gender: GenderType;
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  enrolledCount: number;
  intensityLevel: Intensity_level_type;
  mode: Session_Mode_type;
  meetingLink?: string;
  venue?: Venue;
  requirements: string;
  images: FileList | null;
  pricing: Pricing[];
  timeSlots: TimeSlot[];
  amenities: string;
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
}
export interface FitnessSessionData extends Omit<
  FitnessSessionFormValues,
  'images' | 'amenities' | 'requirements'
> {
  trainerId: string;
  images: string[];
  requirements: string[];
  amenities: string[];
}