import { ProgramResponseDTO } from '@/dtos/response/admin/fitness.response.dto';

export interface IFitnessService {
  getActiveFitnessPrograms(): Promise<ProgramResponseDTO[]>;
}
