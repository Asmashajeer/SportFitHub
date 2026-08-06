// src/utils/cloudinaryAccess.ts
export const PUBLIC_UPLOAD_TYPES = ['profile_pic', 'session_gallery'] ;


export const getDeliveryType = (uploadType: string): 'upload' | 'authenticated' => (PUBLIC_UPLOAD_TYPES.includes(uploadType as string ) ? 'upload' : 'authenticated');
