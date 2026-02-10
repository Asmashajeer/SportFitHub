import { TRAINER_STATUS } from "@/constants/enums";

 export interface trainerStatusDTO{
  status:typeof TRAINER_STATUS[keyof typeof TRAINER_STATUS]
  suspensionReason?: String,
  suspendedAt?: Date,
  rejectionReason?: String,
  rejectedAt?: Date,
 }