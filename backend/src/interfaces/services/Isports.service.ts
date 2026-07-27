import { SportsResponseDTO } from '@/dtos/response/admin/sports.response.dto';

export interface ISportsService {
  getActiveSports(): Promise<SportsResponseDTO[]>;  
}
