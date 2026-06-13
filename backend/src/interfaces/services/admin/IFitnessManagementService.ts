import { FitnessPgmRequestDTO, getQueryDTO } from '@/dtos/request/admin/admin.category.dto';
import { FitnessProgramResponseDTOWithPagination, ProgramResponseDTO } from '@/dtos/response/admin/fitness.response.dto';

import { Types } from 'mongoose';

export interface IFitnessManagementService {
  addProgram(data: FitnessPgmRequestDTO): Promise<ProgramResponseDTO>;
  getPrograms(filter: getQueryDTO): Promise<FitnessProgramResponseDTOWithPagination>
  getProgram(id: string | Types.ObjectId): Promise<ProgramResponseDTO>;
  toggleProgramStatus(id: string | Types.ObjectId): Promise<ProgramResponseDTO>;
  updateProgram(
    id: string | Types.ObjectId,
    data: FitnessPgmRequestDTO
  ): Promise<ProgramResponseDTO>;
  deleteProgram(id: string | Types.ObjectId): Promise<boolean>;
}
