import { ITrainerProfile } from '@/models/trainerProfile.model';
import { IBaseRepository } from './IBase.repository';
import { Types, UpdateQuery } from 'mongoose';
import { FilterQuery } from 'mongoose';
import { stripeData } from '@/dtos/request/trainer/trainer.profile.request.dto';


export interface ITrainerRepository extends IBaseRepository<ITrainerProfile> {
  findAll(query: FilterQuery<ITrainerProfile>, options: { skip: number; limit: number });
  findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile>;
  findUserIdByTrainerId(trainerId: string): Promise<string | null>;
  findTrainerPopulatedUserId(trainerId: string);
  updateSection(id: string | Types.ObjectId, updateData: UpdateQuery<ITrainerProfile>, changedField: string): Promise<ITrainerProfile | null>;
  reSubmitApplication(id: string | Types.ObjectId, updateData: UpdateQuery<ITrainerProfile>);
  updateTrainerStripeAC(trainerId: string, updateData: stripeData): Promise<Partial<ITrainerProfile>>;
  countActiveTrainers(): Promise<number>
}
