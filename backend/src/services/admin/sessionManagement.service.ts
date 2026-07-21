import { PAYLOAD_MODEL } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { AdminSessionFilterDTO, SessionStatsResponseDTO } from '@/dtos/request/admin/admin.session.dto';
import { AdminSessionActionResponseDTO, AdminSessionDetailedViewDTO, AdminSessionsResponseDTO } from '@/dtos/response/admin/session.response.dto';
import { IFitnessSessionRepository } from '@/interfaces/repositories/IFitness.session.repository';
import { ISportsSessionRepository } from '@/interfaces/repositories/ISports.session.repository';
import { ISessionManagementService } from '@/interfaces/services/admin/ISessionMnagement.service';
import { toAdminSessionActionResponseDTO, toAdminSessionDetailedViewDTO, toAdminSessionResponseDTO } from '@/mappers/admin/admin.session.mappers';
import { IFitnessSession } from '@/models/fitnessSession.model';
import { ISportsSession } from '@/models/sportsSession.model';
import AppError from '@/utils/AppError';

import { FilterQuery, Types } from 'mongoose';

export class SessionManagementService implements ISessionManagementService {
  private _sportsSessionRepo: ISportsSessionRepository;
  private _fitnessSessionRepo: IFitnessSessionRepository;

  constructor(sportsSessionRepo: ISportsSessionRepository, fitnessSessionRepo: IFitnessSessionRepository) {
    this._sportsSessionRepo = sportsSessionRepo;
    this._fitnessSessionRepo = fitnessSessionRepo;
  }

  //-------------------get session Stats-----------
  async getSessionStats(): Promise<SessionStatsResponseDTO> {
    const [sportsStats, fitnessStats] = await Promise.all([this._sportsSessionRepo.getSessionStats(), this._fitnessSessionRepo.getSessionStats()]);
    return { sportsStats, fitnessStats };
    // total: sports.total + fitness.total, pending: sports.pending + fitness.pending };
  }
  // ------------------get sessions----------
  async getSessions(sessionModel: string, filter: AdminSessionFilterDTO): Promise<AdminSessionsResponseDTO> {
    const { page, limit, status, sessionType, mode, search } = filter;
    const skip = (page - 1) * limit;

    const query: FilterQuery<ISportsSession | IFitnessSession> = { isDeleted: false };

    if (search) query.sessionName = { $regex: search, $options: 'i' };
    if (sessionType && sessionType !== 'all') query.sessionType = sessionType;
    if (mode && mode !== 'all') query.mode = mode;

    // status maps to DB fields
    if (status && status !== 'all') {
      switch (status) {
        case 'pending':
          query.isApproved = false;
          query.isDeleted = false;
          break;
        case 'active':
          query.isApproved = true;
          query.isActive = true;
          break;
        case 'inactive':
          query.isApproved = true;
          query.isActive = false;
          break;
        case 'rejected':
          query.isDeleted = true;
          break;
      }
    }

    const repo = sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;

    const [Sessions, totalCount] = await Promise.all([
      repo.findAllWithTrainer(query, { skip, limit }), // populate trainerId
      repo.count(query),
    ]);
    console.log(Sessions);
    const sessionsData = Sessions.map((s) => toAdminSessionResponseDTO(s));
    return {
      sessions: sessionsData,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
    };
  }
  //---------------get session Details by id-------------------
  async getSession(sessionModel: string, id: string | Types.ObjectId): Promise<AdminSessionDetailedViewDTO> {
    const repo = sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
    const data = await repo.findBysessionIdwithTrainerDetails(id);

    const session = toAdminSessionDetailedViewDTO(data);
    return session;
  }

  //---------------approve.reject session
  async approveSession(sessionModel: string, id: string, isApproved): Promise<AdminSessionActionResponseDTO> {
    const repo = sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
    let Active = false;
    if (isApproved === true) {
      Active = true;
    }
    const data = await repo.findOneAndUpdate(id, { isApproved, isActive: Active });
    if (!data) throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.NOT_FOUND);
    const session = toAdminSessionActionResponseDTO(data);
    return session;
  }

  //----------------------activate /deactivate session
  async activateSession(sessionModel: string, id: string, isActive): Promise<AdminSessionActionResponseDTO> {
    const repo = sessionModel === PAYLOAD_MODEL.SPORT_SESSION ? this._sportsSessionRepo : this._fitnessSessionRepo;
    const data = await repo.findOneAndUpdate(id, { isActive });
    if (!data) throw new AppError(ERROR_MESSAGES.SESSION.UPDATE_FAILED, STATUS_CODE.ERROR.NOT_FOUND);
    const session = toAdminSessionActionResponseDTO(data);
    return session;
  }
}
