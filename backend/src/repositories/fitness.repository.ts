import { BaseRepository } from './base.repository';

import { FilterQuery, Model } from 'mongoose';

import { IFitnessProgram } from '@/models/fitnessProgram.model';
import { IFitnessRespository } from '@/interfaces/repositories/IFitness.respository';

export class FitnessRepository
  extends BaseRepository<IFitnessProgram>
  implements IFitnessRespository
{
  constructor(model: Model<IFitnessProgram>) {
    super(model);
  }
  async findAll(query:FilterQuery<IFitnessProgram>,options: { skip:number, limit:number }){
          return await this.model.find(query)        
          .sort({programName:1})
          .skip(options.skip)
          .limit(options.limit);
      }
}
