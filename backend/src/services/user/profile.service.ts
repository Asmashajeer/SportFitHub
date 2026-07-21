import { Types } from 'mongoose';
import { IProfile } from '@/models/profile.model';
import AppError from '@/utils/AppError';
import { ProfileResponseDataDTO } from '@/dtos/response/user/profile.response.dto';
import { IUserRepository } from '@/interfaces/repositories/IUser.repository';
import { IProfileRepository } from '@/interfaces/repositories/IProfile.repository';
import { CreateUserProfileDTO } from '@/dtos/request/user/profile.request.dto';
import { toProfileResponseData } from '@/mappers/profile.mapper';
import { ERROR_MESSAGES, STATUS_CODE } from '@/constants/messages';

import { UserRole } from '@/constants/enums';
import { IAuthService } from '@/interfaces/services/IAuth.service';

export class ProfileService {
  private _profileRepo: IProfileRepository;
  private _userRepo: IUserRepository;
  private _authService: IAuthService;
  constructor(profileRepository: IProfileRepository, userRepository: IUserRepository, authService: IAuthService) {
    this._profileRepo = profileRepository;
    this._userRepo = userRepository;
    this._authService = authService;
  }

  //-------------Create a profile
  async addProfile(data: CreateUserProfileDTO): Promise<ProfileResponseDataDTO & { tokens?: { accessToken: string; refreshToken: string } }> {
    const { userId: inputUserId } = data;
    const profileCount = await this._profileRepo.count({ userId: inputUserId });
    const isPrimary = profileCount === 0;
    const existing = await this._profileRepo.findOne({
      fullName: data.fullName,
      userId: inputUserId,
    });
    if (existing) throw new AppError(ERROR_MESSAGES.USER.PROFILE_EXISTS, STATUS_CODE.ERROR.CONFLICT);

    //the Location Object (GeoJSON format)
    let location = null;
    if (data.longitude !== undefined && data.latitude !== undefined) {
      location = {
        type: 'Point',
        coordinates: [data.longitude, data.latitude],
      };
    }

    // Required Fields
    const profile = {
      userId: new Types.ObjectId(inputUserId),
      fullName: data.fullName,
      DOB: data.DOB,
      gender: data.gender,
      phone: data.phone,
      relationship: data.relationship,
      address: {
        street: data.street || '',
        city: data.city || '',
        zip: data.zip || '',
      },
      location,
      profilePic: data.profilePic,
      isPrimary,
    };

    const result = await this._profileRepo.create(profile);
    if (!result) throw new AppError(ERROR_MESSAGES.GENERAL.FAILED, STATUS_CODE.ERROR.INTERNAL_SERVER_ERROR);

    const profileData: ProfileResponseDataDTO = toProfileResponseData(result);

    let tokens: { accessToken: string; refreshToken: string } | undefined;
    const user = await this._userRepo.findById(data.userId);
    //user become a trainer too
    if (user.activeRole === UserRole.TRAINER && !user.roles.includes(UserRole.USER)) {
      await this._userRepo.addRole(user.id, UserRole.TRAINER);
      const updatedUser = await this._userRepo.setActiveRole(user.id, UserRole.TRAINER);
      tokens = this._authService.generateTokensForUser(updatedUser._id.toString(), updatedUser.email, updatedUser.activeRole, updatedUser.timezone);
    }
    return { ...profileData, tokens };
  }

  // ----------------to get a primary profile by userId
  async getPrimaryProfile(userId: string, isPrimary: boolean = true): Promise<ProfileResponseDataDTO | null> {
    const result = await this._profileRepo.findOne({ userId, isPrimary });
    const profileData: ProfileResponseDataDTO = toProfileResponseData(result);
    return profileData;
  }
  // ----------------to get a  profile by profileId
  async getProfile(profileId: string): Promise<ProfileResponseDataDTO | null> {
    const result = await this._profileRepo.findById(profileId);
    const profileData: ProfileResponseDataDTO = toProfileResponseData(result);
    return profileData;
  }
  //------------- to get All profile by userId
  async getProfiles(userId: string): Promise<ProfileResponseDataDTO[]> {
    const profiles = await this._profileRepo.AllProfiles(userId);
    const allProfiles: ProfileResponseDataDTO[] = profiles.map((profile) => toProfileResponseData(profile));
    if (!allProfiles) throw new Error(ERROR_MESSAGES.GENERAL.NOT_FOUND);
    return allProfiles;
  }

  //---------------- Update Profile
  async updateProfile(profileId: string, updateData: Partial<IProfile>): Promise<ProfileResponseDataDTO> {
    const updated = await this._profileRepo.findOneAndUpdate(profileId, updateData);

    if (!updated) throw new Error(ERROR_MESSAGES.USER.PROFILE_NOT_FOUND);
    const profileData: ProfileResponseDataDTO = toProfileResponseData(updated);
    return profileData;
  }
}
