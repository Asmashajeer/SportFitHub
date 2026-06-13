import { ISports } from '@/models/sports.model';
import { BaseRepository } from './base.repository';
import { ISportsRespository } from '@/interfaces/repositories/ISports.respository';
import { FilterQuery, Model } from 'mongoose';

export class SportsRepository extends BaseRepository<ISports> implements ISportsRespository {
  constructor(model: Model<ISports>) {
    super(model);
  }
    async findAll(query:FilterQuery<ISports>,options: { skip:number, limit:number }){
        return await this.model.find(query)        
        .sort({sportsName:1})
        .skip(options.skip)
        .limit(options.limit);
    }
}
