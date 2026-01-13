export const ROLES = {
  ADMIN: 'admin',
  TRAINER: 'trainer',
  USER: 'user',
} as const; 
export type UserRole = typeof ROLES[keyof typeof ROLES];

export const OTP_EXPIRATION_MINUTES = 5; 

export const OTP_TYPE={
  VERIFICATION : 'VERIFICATION',
  PASSWORD_RESET : 'PASSWORD_RESET',
}


export const GENDER_TYPES={
  MALE:'Male',
  FEMALE:'Female',
  OTHER:'Other'
}
export type GenderType= typeof GENDER_TYPES[keyof typeof GENDER_TYPES]

export const RELATIONSHIP_TYPES = {
  SELF: 'Self',
  SPOUSE: 'Spouse',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  OTHER: 'Other'
};
export type RelationType = typeof RELATIONSHIP_TYPES[keyof typeof RELATIONSHIP_TYPES];