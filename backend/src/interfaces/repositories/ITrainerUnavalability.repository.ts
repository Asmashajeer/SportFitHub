import { IAvailabilityException } from "@/models/availabilityExceptions";
import { IBaseRepository } from "./IBase.repository";

export interface ITrainerUnavailabilityRepository  extends IBaseRepository<IAvailabilityException>{
  createUnavailableDate(trainerId: string, date: Date, reason?: string): Promise<IAvailabilityException>;
  deleteDate(trainerId: string, date: Date): Promise<{ deletedCount: number }>;
  findUpcoming(trainerId: string, fromDate: Date): Promise<IAvailabilityException[]>;
  findInRange(trainerId: string, from: string, to: string): Promise<{ date: string }[]>;
//   exists(trainerId: string, date: string): Promise<boolean>;
}