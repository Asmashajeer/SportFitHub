import { ERROR_MESSAGES } from '@/constants/messages';
import { ProgramResponseDTO } from '@/dtos/response/admin/fitness.response.dto';

import { IFitnessRespository } from '@/interfaces/repositories/IFitness.respository';

import { IFitnessService } from '@/interfaces/services/Ifitness.service';
import { toProgramResponseDTO } from '@/mappers/fitnessProgram.mapper';

import AppError from '@/utils/AppError';

export class FitnessService implements IFitnessService {
  private _fitnessRepo: IFitnessRespository;
  constructor(fitnessRepo: IFitnessRespository) {
    this._fitnessRepo = fitnessRepo;
  }

  async getActiveFitnessPrograms(): Promise<ProgramResponseDTO[]> {
    const filter = {
      isActive: true,
    };
    const data = await this._fitnessRepo.find(filter);
    if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const fitnessPgms = data.map((pgm) => toProgramResponseDTO(pgm));
    return fitnessPgms;
  }
}
