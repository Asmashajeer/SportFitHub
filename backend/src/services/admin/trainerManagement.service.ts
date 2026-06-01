import { ITrainerRepository } from '@/interfaces/repositories/ITrainer.repository';
import { ITrainerManagementService } from '@/interfaces/services/admin/ITrainerManagementService';
import AppError from '@/utils/AppError';
import { FilterQuery, Types } from 'mongoose';
import { DOC_VERIFY_STATUS, TRAINER_STATUS } from '@/constants/enums';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';
import { PendingTrainersBasicDTO } from '@/dtos/response/trainer/trainerApprovals.response';
import { DocumentUpdateDTO, TrainerFilterRequestDTO, trainerStatusDTO } from '@/dtos/request/admin/admin.trainer.dto';
import { toPendingTrainersBasicData, ToTrainerProfileDTO } from '@/mappers/trainer/trainer.mapper';
import { TrainerProfileDTO } from '@/dtos/response/trainer/trainer.response.dto';
import { ITrainerProfile } from '@/models/trainerProfile.model';
import { AdminTrainersDTOWithPagination, AdminTrainersResponseDTO } from '@/dtos/response/admin/trainer.response.dto';
import { toAdminTrainersResponseDTO } from '@/mappers/admin/admin.trainers.mappers';

export class TrainerManagementService implements ITrainerManagementService {
  private _trainerRepo: ITrainerRepository;
  constructor(trainerRepo: ITrainerRepository) {
    this._trainerRepo = trainerRepo;
  }

//--------------all ltrainers-----------
  async getTrainers(filter:TrainerFilterRequestDTO):Promise<AdminTrainersDTOWithPagination> {
    const {page,limit,search,status,category}=filter;
     const skip = (page - 1) * limit;
    
    const query: FilterQuery<ITrainerProfile> = {  };

     if (search) {
        query.$or = [
          { displayName: { $regex: search, $options: 'i' } },
          { specialities: { $regex: search, $options: 'i' } },
          { coreDiscipline: { $regex: search, $options: 'i' } },
        ];
      }
      if (status && status !== "all") {      
            query.status = status;  
      }  
      if (category && category !== "all") {      
            query.category = category;  
      }  
    
      const [trainers, totalCount] = await Promise.all([
              await this._trainerRepo.findAll(query, { skip, limit }), 
              await this._trainerRepo.count(query),
            ]);
      const trainersData=trainers.map((t) => toAdminTrainersResponseDTO(t));
      return {
        trainers: trainersData,      
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        page,                         
      };
   
  }


  //-------------get approval pending trainers-----------
  async getPendingTrainers(): Promise<PendingTrainersBasicDTO[]> {
    const pendingTrainers = await this._trainerRepo.find({
      status: { $in: [TRAINER_STATUS.SUBMITTED, TRAINER_STATUS.UNDER_REVIEW] },
    });

    const pendingTrainersBasicData: PendingTrainersBasicDTO[] = pendingTrainers.map(trainer =>
      toPendingTrainersBasicData(trainer)
    );
    return pendingTrainersBasicData;
  }
  async trainerDetailsById(id: string | Types.ObjectId): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(trainer);
    return trainerData;
  }
  async trainerDetailsByUserId(userId: string | Types.ObjectId): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findOne({ userId: userId });
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(trainer);
    return trainerData;
  }
  async updateFileStatus(
    id: string | Types.ObjectId,
    targetField: 'certificationInfo' | 'idVerification',
    status: string,
    reason: string
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData: DocumentUpdateDTO = {
      [`${targetField}.status`]: status,
      [`${targetField}.rejectReason`]: status === DOC_VERIFY_STATUS.REJECTED ? reason : '',
    };

    if (status === 'verified') {
      updateData[`${targetField}.verified`] = true;
      updateData[`${targetField}.verifiedAt`] = new Date().toISOString();
    } else {
      updateData[`${targetField}.verified`] = false;
    }

    const updatedData = await this._trainerRepo.findOneAndUpdate(id, { $set: updateData });
    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedData);
    return trainerData;
  }

  async updateTrainerStatus(
    id: string | Types.ObjectId,
    status: TRAINER_STATUS,
    reason: string
  ): Promise<TrainerProfileDTO> {
    const trainer = await this._trainerRepo.findById(id);
    if (!trainer) throw new AppError(ERROR_MESSAGES.GENERAL.NOT_FOUND, STATUS_CODE.ERROR.NOT_FOUND);

    const updateData: trainerStatusDTO = {
      status: status,
    };

    if (status === TRAINER_STATUS.REJECTED) {
      updateData.rejectionReason = reason || '';
      updateData.rejectedAt = new Date();
    }

    const updatedDoc = await this._trainerRepo.findOneAndUpdate(id, { $set: updateData });

    if (!updatedDoc) {
      throw new AppError('Update failed', STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);
    }

    const trainerData: TrainerProfileDTO = ToTrainerProfileDTO(updatedDoc);
    return trainerData;
  }
}
