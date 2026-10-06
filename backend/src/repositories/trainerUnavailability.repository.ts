import { IAvailabilityException } from "@/models/availabilityExceptions";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { ITrainerUnavailabilityRepository } from "@/interfaces/repositories/ITrainerUnavalability.repository";

export class TrainerUnavailabilityRepository extends BaseRepository<IAvailabilityException> implements ITrainerUnavailabilityRepository {
  constructor(model: Model<IAvailabilityException>) {
    super(model);
  }




  async createUnavailableDate(trainerId: string, date: Date, reason?: string): Promise<IAvailabilityException> {
    return this.model.create({ trainerId, date, reason });
  }

  async deleteDate(trainerId: string, date: Date): Promise<{ deletedCount: number }> {
    const res = await this.model.deleteOne({ trainerId, date });
    return { deletedCount: res.deletedCount ?? 0 };
  }

  // upcoming = date >= today 
  async findUpcoming(trainerId: string, fromDate: Date): Promise<IAvailabilityException[]> {
    return this.model.find({ trainerId, date: { $gte: fromDate } })
      .sort({ date: 1 })
      .lean<IAvailabilityException[]>();
  }

  // used by the public booking-calendar service
  async findInRange(trainerId: string, from: string, to: string): Promise<{ date: string }[]> {
    return this.model.find({ trainerId, date: { $gte: from, $lte: to } })
      .select('date -_id')
      .lean<{ date: string }[]>();
  }

//   async exists(trainerId: string, date: string): Promise<boolean> {
//     return !!(await this.model.exists({ trainerId, date }));
//   }
}