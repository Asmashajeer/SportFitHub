import { IAvailabilityException } from '@/models/availabilityExceptions';
import { IBaseRepository } from './IBase.repository';
import { ITimeSlot } from '@/models/trainerProfile.model';

export interface ITrainerUnavailabilityRepository extends IBaseRepository<IAvailabilityException> {
  upsertUnavailableSlot(trainerId: string, date: Date, slot: ITimeSlot, reason?: string);
  upsertFullDayUnavailability(trainerId: string, date: Date, reason?: string);
  // createUnavailableDate(trainerId: string, date: Date,isFullDay:boolean,slots:ITimeSlot[],reason?: string): Promise<IAvailabilityException>;
  deleteDate(trainerId: string, date: Date): Promise<{ deletedCount: number }>;
  findUpcoming(trainerId: string, fromDate: Date): Promise<IAvailabilityException[]>;
  findInRange(trainerId: string, from: string, to: string): Promise<{ date: string }[]>;
  findByTrainerAndDate(trainerId: string, date: Date);
}
