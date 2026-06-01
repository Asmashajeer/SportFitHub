import { ProfileResponseDataDTO } from '@/dtos/response/user/profile.response.dto';
import { IProfile } from '../models/profile.model';

import { formatInTimeZone } from 'date-fns-tz';
import { getTimezone } from '@/context/timezone.context';


export const toProfileResponseData = (profile: Partial<IProfile>): ProfileResponseDataDTO => {
  const timezone = getTimezone();
  return {
    id: profile._id.toString(),
    userId: profile.userId.toString(),
    fullName: profile.fullName,
    DOB: profile.DOB,
    gender: profile.gender,
    phone: profile.phone,
    relationship: profile.relationship,
    address: profile.address,
    location: profile.location,
    profilePic: profile.profilePic,
    isPrimary: profile.isPrimary,
    createdAt: formatInTimeZone(profile.createdAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
    updatedAt: formatInTimeZone(profile.updatedAt, timezone, 'yyyy-MM-dd HH:mm:ssXXX'),
  };
};
