import cloudinary from '../config/cloudinaryConfig';

interface SignedUrlOptions {
  width?: number;
  height?: number;
  crop?: string;
}
export const getSignedFileUrl = (publicId: string, resourceType: string, deliveryType: 'upload' | 'authenticated' = 'authenticated', options: SignedUrlOptions = {}): string => {
  // const { resourceType = 'image', deliveryType = 'authenticated', width, height, crop } = options;
  return cloudinary.url(publicId, {
    resource_type: resourceType,
    type: deliveryType,
    sign_url: deliveryType === 'authenticated',
    secure: true,
    expires_at: Math.floor(Date.now() / 1000) + 30,
    ...(options.width && {
      transformation: [{ width: options.width, height: options.height, crop: options.crop ?? 'limit' }],
    }),
  });
};
