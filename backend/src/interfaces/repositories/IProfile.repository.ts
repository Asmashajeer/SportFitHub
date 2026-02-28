import { IBaseRepository } from './IBase.repository';
import { IProfile } from '@/models/profile.model';
import { Types } from 'mongoose';

export interface IProfileRepository extends IBaseRepository<IProfile> {
  findById(profileId: string | Types.ObjectId): Promise<IProfile | null>;

  AllProfiles(userId: string | Types.ObjectId): Promise<IProfile[]>;
  create(profileData: Partial<IProfile>): Promise<IProfile>;

  // updateProfile(id: string | Types.ObjectId, updateData: Partial<IProfile>): Promise<IProfile>
}
