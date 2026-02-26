import {  TRAINER_STATUS } from "@/constants/enums";

 export interface trainerStatusDTO{
  status:typeof TRAINER_STATUS[keyof typeof TRAINER_STATUS]
  suspensionReason?: string,
  suspendedAt?: Date,
  rejectionReason?: string,
  rejectedAt?: Date,
 }
export type DocumentUpdateDTO = Record<string, string | boolean | Date | null>;
