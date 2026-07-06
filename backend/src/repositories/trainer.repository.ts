import { ITrainerProfile } from '@/models/trainerProfile.model';
import { BaseRepository } from './base.repository';
import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { ITrainerPopulated } from '@/dtos/response/admin/trainer.response.dto';

export class TrainerRepository
  extends BaseRepository<ITrainerProfile>
  implements ITrainerRepository
{
  constructor(model: Model<ITrainerProfile>) {
    super(model);
  }  
  async findAll(query:FilterQuery<ITrainerProfile>,options: { skip:number, limit:number }){
      return await this.model.find(query)
      .populate('userId','_id name email')
      .sort({createdAt:-1})
      .skip(options.skip)
      .limit(options.limit);
  }
  async findByUserId(userId: Types.ObjectId | string): Promise<ITrainerProfile> {
    return await this.model.findOne({ userId: userId });
    
  }
  async findUserIdByTrainerId(trainerId: string): Promise<string | null> {
    const trainer = await this.model.findById(trainerId).select('userId');
    return trainer?.userId?.toString() ?? null;
  }

 async findTrainerPopulatedUserId(trainerId: Types.ObjectId | string) {
    return await this.model
      .findById(trainerId)
      .populate('userId')    ;
  }

//  async findByCertId(certId: Types.ObjectId | string){
//       return await this.model    .findOne({certificateInfo.documents})
//     .populate('userId') 
//  }

  async updateSection(id:string|Types.ObjectId,updateData:UpdateQuery<ITrainerProfile>,changedField:string):Promise<ITrainerProfile | null>{
    const updateQuery = {
      $set: {
        ...updateData,
        ...(changedField && {
                'verificationRemarks.changedAt': new Date()  
            })          
      },
    ...(changedField &&{ $addToSet: {
        'verificationRemarks.fields': changedField,       
       }
      })
      
    };
    return await this.model.findByIdAndUpdate(id,updateQuery, { new: true });
  }


  
  async reSubmitApplication(id:string|Types.ObjectId,updateData:UpdateQuery<ITrainerProfile>){
       const updateQuery = {
          $set: {
            ...updateData,
          },
          $inc:{
            applicationCount:1
          }
        }
     return await this.model.findByIdAndUpdate(id,updateQuery, { new: true }); 
  }
}
