import { TRAINER_STATUS } from '@/constants/enums';

export interface trainerStatusDTO {
  status: (typeof TRAINER_STATUS)[keyof typeof TRAINER_STATUS];
  suspensionReason?: string;
  suspendedAt?: Date;
  rejectionReason?: string;
  rejectedAt?: Date;
  verificationRemarks?: {
    fields: string[],
    changedAt: string|null, 
  },
}
export type DocumentUpdateDTO = Record<string, string | boolean | Date | null>;


export interface TrainerFilterRequestDTO{
   page:number,
   limit:number,
   search:string,
   status:string,
   category:string
}