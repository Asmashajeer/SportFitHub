import { IAvailabilityException } from "@/models/availabilityExceptions";
import { BaseRepository } from "./base.repository";
import { Model } from "mongoose";
import { ITrainerUnavailabilityRepository } from "@/interfaces/repositories/ITrainerUnavalability.repository";
import { ITimeSlot } from "@/models/trainerProfile.model";

export class TrainerUnavailabilityRepository extends BaseRepository<IAvailabilityException> implements ITrainerUnavailabilityRepository {
  constructor(model: Model<IAvailabilityException>) {
    super(model);
  }




 async upsertUnavailableSlot(trainerId: string, date: Date, slot: ITimeSlot, reason?: string) {
  const cancelledDay=await this.model.findOneAndUpdate(
    { trainerId, date },
    { 
      $set: {
        trainerId, 
        date,
        isFullDay: false, reason }, 
      $addToSet: { slots: slot } 
    },
    { new: true,upsert: true }
  );
  console.log("---------------",cancelledDay);
  return cancelledDay;
}

async upsertFullDayUnavailability(trainerId: string, date: Date, reason?: string) {
  return await this.model.findOneAndUpdate(
    { trainerId, date },
    { 
      $set: {trainerId,date, isFullDay: true, reason ,slots: [] } // Clear slots when full day is marked
    },
    {new: true, upsert: true }
  );
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

  async findByTrainerAndDate(trainerId: string, date: Date) {
    return await this.model.findOne({ trainerId, date });
  }
}