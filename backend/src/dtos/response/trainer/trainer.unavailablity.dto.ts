import { ITimeSlot } from "@/models/trainerProfile.model";

export interface UnavailableDayResponseDto {
  id: string;
  date: string;
  isFullDay:boolean,
  slots:ITimeSlot[],
  reason?: string;
  createdAt: Date;
}