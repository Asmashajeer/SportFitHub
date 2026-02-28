import { BaseRepository } from './base.repository';

import { Model } from 'mongoose';

import { IFitnessProgram } from '@/models/fitnessProgram.model';
import { IFitnessRespository } from '@/interfaces/repositories/IFitness.respository';

export class FitnessRepository
  extends BaseRepository<IFitnessProgram>
  implements IFitnessRespository
{
  constructor(model: Model<IFitnessProgram>) {
    super(model);
  }
}
