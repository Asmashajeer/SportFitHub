import { IFitnessProgram } from '@/models/fitnessProgram.model';
import { IBaseRepository } from './IBase.repository';
import { FilterQuery } from 'mongoose';


export interface IFitnessRespository extends IBaseRepository<IFitnessProgram>{
    findAll(query:FilterQuery<IFitnessProgram>,options: { skip:number, limit:number })
}