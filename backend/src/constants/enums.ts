export enum UserRole {
  ADMIN = 'admin',
  TRAINER = 'trainer',
  USER = 'user',
  PENDING = 'pending', // This is the "Onboarding" state for google login
}

export enum TRAINER_CATEGORY{
  SPORT='Sports',
  FITNESS='Fitness'
}
export enum OtpType {
  VERIFICATION = 'VERIFICATION',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export enum GENDER {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}
export enum RELATIONSHIP {
  SELF = 'Self',
  SPOUSE = 'Spouse',
  SON = 'Son',
  DAUGHTER = 'Daughter',
  OTHER = 'Other',
}


export enum GOVT_ID_TYPE {
  AADHAR = 'Aadhar',
  PASSPORT = 'Passport',
   DRIVING_LICENSE = 'Driving License',
  PAN = 'PAN'
}

export enum DOC_VERIFY_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}



export enum TRAINER_STATUS {
  SUBMITTED = 'submitted',
  UNDER_REVIEW = 'under review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export enum CURRENCY{
  US = 'US Dollar' ,
EURO=	'EUR	€'	,
BRITISH_POUND=	'GBP	£(British Pound)'	,
INR='	INR	₹'	,
UAE_DIRHAM=	'AED(UAE)',
}