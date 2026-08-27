import { PlatformSettingsResponseDTO } from "@/dtos/response/admin/admin.settings.reponse.dto";
import { IPlatformSettings } from "@/models/PlatformSettings.model";

export interface ISettingsService {
  getSettings():Promise<PlatformSettingsResponseDTO>
  getCommissionPercent(): Promise<number>;
  getHoldHours(): Promise<number>;
  updateSettings(data: Partial<IPlatformSettings>);
}
