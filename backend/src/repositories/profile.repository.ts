import Profile from '../models/profile.model';
import { IProfileRepository } from '@/interfaces/repositories/IProfile.repository';
import { IProfile } from '../models/profile.model';
import { FilterQuery, Model, Types } from 'mongoose';
import { BaseRepository } from './base.repository';


export class ProfileRepository extends BaseRepository<IProfile> implements IProfileRepository  {

  constructor(model:Model<IProfile>){
      super(model);
  }


   // create Profile
  // async create(profileData: Partial<IProfile>): Promise<IProfile> {
  //   return await this.model.create(profileData);
  // }

  // find by profileId
  async findById(profileId: string | Types.ObjectId): Promise<IProfile | null> {
    return await this.model.findOne({ profileId });
  }
  // async findProfile(filter:{name:string,userId: string | Types.ObjectId}): Promise<IProfile | null> {
  //   return await this.model.findOne(filter);
  // }
  async AllProfiles(userId:string | Types.ObjectId):Promise<IProfile[]>{
        return await this.model.find({userId});       
  }
 

  //update profile
  async update(userId: string | Types.ObjectId, updateData: Partial<IProfile>) {
    return await this.model.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true },
    );
  }

  
}
