import { IPlatformSettings } from "@/models/PlatformSettings.model";

export const ToPlatformSettingsResponseDTO=(settings:IPlatformSettings)=>{
    return{
        commissionPercent:settings.commissionPercent,
        payoutHoldHours:settings.payoutHoldHours,
        cancellationPenaltyPercent:settings.cancellationPenaltyPercent,
        strikeResetDays:settings.strikeResetDays,
        updatedAt:settings.updatedAt.toISOString()
    }

}