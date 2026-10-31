import type { TimeSlot } from './trainerprofile.types';

export interface CancelAvailabilityPayload {
  date: string;
  selectedSlot: TimeSlot | null;
  isFullDay: boolean;
  reason: string | undefined;
}
export interface DayOffData
 { id: string;
  date: string;
  isFullDay:boolean,
  slots:TimeSlot[],
  reason?: string;
  createdAt: Date;
 }