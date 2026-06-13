import { ISports } from '@/models/sports.model';
import { IBaseRepository } from './IBase.repository';
import { FilterQuery } from 'mongoose';

export interface ISportsRespository extends IBaseRepository<ISports>{
    findAll(query:FilterQuery<ISports>,options: { skip:number, limit:number })
}
