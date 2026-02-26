import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { FitnessPgmRequestDTO, getQueryDTO } from '@/dtos/request/admin/admin.category.dto';
import { ProgramResponseDTO } from '@/dtos/response/admin/fitness.response.dto';

import { IFitnessRespository } from '@/interfaces/repositories/IFitness.respository';
import { IFitnessManagementService } from '@/interfaces/services/admin/IFitnessManagementService';
import { toProgramResponseDTO } from '@/mappers/fitnessProgram.mapper';

import { IFitnessProgram } from '@/models/fitnessProgram.model';
import AppError from '@/utils/AppError';
import { FilterQuery, Types } from 'mongoose';

export class FitnessManagementService implements IFitnessManagementService {
  private _fitnessRepository: IFitnessRespository;
  constructor(fitnessRepository: IFitnessRespository) {
    this._fitnessRepository = fitnessRepository;
  }

  async addProgram(data: FitnessPgmRequestDTO): Promise<ProgramResponseDTO> {
    const existing = await this._fitnessRepository.findOne({ programName: data.programName });
    if (existing)
      throw new AppError(
        `Program Name ${ERROR_MESSAGES.GENERAL.EXISTED}`,
        STATUS_CODE.ERROR.CONFLICT
      );
    const newProgram = await this._fitnessRepository.create(data);
    const program = toProgramResponseDTO(newProgram);
    return program;
  }

  async getPrograms(filter: getQueryDTO): Promise<ProgramResponseDTO[]> {
    const { search, status } = filter;
    const query: FilterQuery<IFitnessProgram> = {};

    if (search) {
      query.programName = { $regex: search, $options: 'i' };
    }
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    const data = await this._fitnessRepository.find(query);

    if (!data.length) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const program = data.map(pgm => toProgramResponseDTO(pgm));
    return program;
  }
  async getProgram(id: string | Types.ObjectId): Promise<ProgramResponseDTO> {
    const data = await this._fitnessRepository.findById(id);
    if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const program = toProgramResponseDTO(data);
    return program;
  }
  async toggleProgramStatus(id: string | Types.ObjectId): Promise<ProgramResponseDTO> {
    const program = await this._fitnessRepository.findById(id);
    if (!program) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const active = !program.isActive;
    const data = await this._fitnessRepository.findOneAndUpdate(id, { isActive: active });
    const updatedProgram = toProgramResponseDTO(data);
    return updatedProgram;
  }
  async updateProgram(
    id: string | Types.ObjectId,
    programData: FitnessPgmRequestDTO
  ): Promise<ProgramResponseDTO> {
    const data = await this._fitnessRepository.findOneAndUpdate(id, programData);
    if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const updatedProgram = toProgramResponseDTO(data);
    return updatedProgram;
  }
  async deleteProgram(id: string | Types.ObjectId): Promise<boolean> {
    const result = await this._fitnessRepository.delete(id);
    if (!result) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    return result;
  }
}