import type {
  AGE_GROUP,
  DayName,
 
  SESSION_TYPE,
} from '@/constants/constants';
// interface SportsCategory {
//   id: string;
//   sportName: string;
//   icon: string;
//   slug: string;
// }

export interface Venue {
  name: string;
  address: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}
export interface ISlots {
  startTime: string; // "09:00"
  endTime: string; // "10:00"
  _id?: string;
}
export interface TimeSlot {
  _id?: string;
  day: DayName;
  slots: ISlots[];
}

export interface Pricing {
  _id?: string;
  sessionCount: number;
  price: number;
}
export interface SportsSessionFormValues {
  sportCategory: string;
  sessionName: string;
  slug: string;
  description: string;
  duration: number;
  ageGroup: (typeof AGE_GROUP)[keyof typeof AGE_GROUP];
  sessionType: (typeof SESSION_TYPE)[keyof typeof SESSION_TYPE];
  maxCapacity: number;
  enrolledCount: number;
  venue: Venue;
  images: FileList | null;
  pricing: Pricing[];

  timeSlots: TimeSlot[];
  amenities: string;
  cancellationPolicy: string;
  cancellationWindow: number;
  bookingDeadline: number;
}

export interface SportsSessionData extends Omit<
  SportsSessionFormValues,
  'images' | 'amenities'
> {
  trainerId: string;
  images: string[];
  amenities: string[];
}