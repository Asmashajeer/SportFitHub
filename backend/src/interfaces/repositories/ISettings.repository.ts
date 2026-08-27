import { IPlatformSettings } from "@/models/PlatformSettings.model";
import { IBaseRepository } from "./IBase.repository";

export interface ISettingsRepository  extends IBaseRepository<IPlatformSettings> {
    getSettings(): Promise<IPlatformSettings>;
    updateSettings(data: Partial<IPlatformSettings>): Promise<IPlatformSettings> ;
}