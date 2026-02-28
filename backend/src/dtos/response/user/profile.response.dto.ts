import { GENDER, RELATIONSHIP } from '@/constants/enums';

export interface BaseResponseDTO {
  success: boolean;
  message: string;
  statusCode: number;
}

interface address {
  street?: string;
  city?: string;
  zip?: string;
}
interface location {
  type: 'Point';
  coordinates: [number, number];
}

export interface ProfileDataDTO {
  userId: string;
  fullName: string;
  DOB: Date;
  gender: GENDER;
  phone: string;
  relationship: RELATIONSHIP;
  address: address;
  location?: location;
  profilePic: string;
  isPrimary: boolean;
}
//profile Response DTO
export interface ProfileResponseDataDTO extends ProfileDataDTO {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfileListItemDTO {
  id: string;
  userId: string;
  name: string;
  isPrimary: boolean;
}
