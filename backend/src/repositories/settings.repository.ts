
import { Model } from 'mongoose';
import { BaseRepository } from './base.repository';
import { IPlatformSettings } from '@/models/PlatformSettings.model';
import { ISettingsRepository } from '@/interfaces/repositories/ISettings.repository';

export class SettingsRepository  extends BaseRepository<IPlatformSettings> implements ISettingsRepository{
    constructor(model:Model<IPlatformSettings>){
        super(model);

    }
  async getSettings(): Promise<IPlatformSettings> {
    let settings = await this.model.findOne();
    if (!settings) {
      settings = await this.model.create({}); // creates with schema defaults
    }
    return settings;
  }

  async updateSettings(data: Partial<IPlatformSettings>): Promise<IPlatformSettings> {
    console.log(data);
    const settings = await this.getSettings();
    Object.assign(settings, data);
    await settings.save();
    return settings;
  }
}