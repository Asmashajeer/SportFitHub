import cloudinary from '../config/cloudinaryConfig';

// export interface CloudinaryUploadResult {
//   public_id: string;
//   // secure_url: string;
//   resource_type: string; // 'image' or 'raw' (for PDFs)
//   format?: string; // jpg, png, pdf, etc.
// }
// export const uploadToCloudinary = async (
//   file: Express.Multer.File,
//   folder: string = 'sportfit_uploads'
// ): Promise<CloudinaryUploadResult> => {
//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder: folder,
//         resource_type: 'auto', //  Images, PDFs, and Videos automatically
//         type: 'authenticated',  
//         transformation: [{ width: 500, height: 500, crop: 'limit' }],
//       },
//       (error, result) => {
//         if (error) return reject(error);
//         resolve(result);
//       }
//     );

//     // Send the file buffer to Cloudinary
//     uploadStream.end(file.buffer);
//   });
// };


interface SignedUrlOptions {
  width?: number;
  height?: number;
  crop?: string;
}
export const getSignedFileUrl = (
  publicId: string,
  resourceType: string,
  deliveryType: 'upload' | 'authenticated' = 'authenticated',
  options: SignedUrlOptions = {},

): string => {
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