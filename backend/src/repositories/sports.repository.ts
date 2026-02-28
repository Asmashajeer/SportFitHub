import { ISports } from '@/models/sports.model';
import { BaseRepository } from './base.repository';
import { ISportsRespository } from '@/interfaces/repositories/ISports.respository';
import { Model } from 'mongoose';

export class SportsRepository extends BaseRepository<ISports> implements ISportsRespository {
  constructor(model: Model<ISports>) {
    super(model);
  }
}
