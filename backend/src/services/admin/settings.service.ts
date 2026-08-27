import { PlatformSettingsResponseDTO } from "@/dtos/response/admin/admin.settings.reponse.dto";
import { ISettingsRepository } from "@/interfaces/repositories/ISettings.repository";
import { ISettingsService } from "@/interfaces/services/admin/ISettings.service";
import { ToPlatformSettingsResponseDTO } from "@/mappers/admin/admin.settings.mappers";
import { IPlatformSettings } from "@/models/PlatformSettings.model";

export class SettingsService implements  ISettingsService {
  private _settingsRepo: ISettingsRepository
  constructor(settingsRepo: ISettingsRepository) {
    this._settingsRepo=settingsRepo;
  }

  async getSettings():Promise<PlatformSettingsResponseDTO> {
    const settings= await this._settingsRepo.getSettings();
    return ToPlatformSettingsResponseDTO(settings);
  }
  
  async getCommissionPercent(): Promise<number> {
    const settings = await this._settingsRepo.getSettings();
    return settings.commissionPercent;
  }

  async getHoldHours(): Promise<number> {
    const settings = await this._settingsRepo.getSettings();
    return settings.payoutHoldHours;
  }

  async updateSettings(data: Partial<IPlatformSettings>):Promise<PlatformSettingsResponseDTO>  {
     const settings= await this._settingsRepo.updateSettings(data);
    return ToPlatformSettingsResponseDTO(settings);
  }
}