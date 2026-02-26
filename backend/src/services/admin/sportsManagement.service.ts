import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { getQueryDTO, SportRequestDTO } from '@/dtos/request/admin/admin.category.dto';
import { SportsResponseDTO } from '@/dtos/response/admin/sports.response.dto';
import { ISportsRespository } from '@/interfaces/repositories/ISports.respository';
import { ISportsManagementService } from '@/interfaces/services/admin/ISportsManagementService';
import { toSportsResponseDTO } from '@/mappers/sports.mapper';
import { ISports } from '@/models/sports.model';
import AppError from '@/utils/AppError';
import { FilterQuery, Types } from 'mongoose';

export class SportsManagementService implements ISportsManagementService {
  private _sportsRepository: ISportsRespository;
  constructor(sportsRepository: ISportsRespository) {
    this._sportsRepository = sportsRepository;
  }

  async addSports(data: SportRequestDTO): Promise<SportsResponseDTO> {
    const existing = await this._sportsRepository.findOne({ sportName: data.sportName });
    if (existing)
      throw new AppError(
        `sports Name +${ERROR_MESSAGES.GENERAL.EXISTED}`,
        STATUS_CODE.ERROR.CONFLICT
      );
    const newSport = await this._sportsRepository.create(data);
    const sport = toSportsResponseDTO(newSport);
    return sport;
  }

  async getSports(filter: getQueryDTO): Promise<SportsResponseDTO[]> {
    const { search, status } = filter;
    const query: FilterQuery<ISports> = {};

    if (search) {
      query.sportName = { $regex: search, $options: 'i' };
    }
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    const data = await this._sportsRepository.find(query);
    if (!data.length) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const sports = data.map(sport => toSportsResponseDTO(sport));
    return sports;
  }

  async getSport(id: string | Types.ObjectId): Promise<SportsResponseDTO> {
    const data = await this._sportsRepository.findById(id);
    if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const sport = toSportsResponseDTO(data);
    return sport;
  }

  async toggleSportStatus(id: string | Types.ObjectId): Promise<SportsResponseDTO> {
    const sport = await this._sportsRepository.findById(id);
    if (!sport) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const active = !sport.isActive;
    const data = await this._sportsRepository.findOneAndUpdate(id, { isActive: active });
    const updatedSport = toSportsResponseDTO(data);
    return updatedSport;
  }
  
  async updateSport(
    id: string | Types.ObjectId,
    sportData: SportRequestDTO
  ): Promise<SportsResponseDTO> {
    const data = await this._sportsRepository.findOneAndUpdate(id, sportData);
    if (!data) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    const updatedSport = toSportsResponseDTO(data);
    return updatedSport;
  }

  async deleteSport(id: string | Types.ObjectId): Promise<boolean> {
    const result = await this._sportsRepository.delete(id);
    if (!result) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    return result;
  }
}
