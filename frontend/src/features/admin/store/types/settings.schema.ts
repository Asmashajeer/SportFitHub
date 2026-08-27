
import { z } from 'zod'; 

export const updateSettingsSchema = z.object({
  commissionPercent: z.number().min(0).max(100).optional(),
  payoutHoldHours: z.number().min(0).optional(),
  cancellationPenaltyPercent: z.number().min(0).max(100).optional(),
  strikeResetDays: z.number().min(0).optional(),
});

export type UpdateSettingsData=z.infer <typeof updateSettingsSchema>