import multer from 'multer';

import cloudinary from '../config/cloudinaryConfig';




export interface CloudinaryUploadResult {
  public_id: string;    
  secure_url: string;    
  resource_type: string; // 'image' or 'raw' (for PDFs)
  format?: string;       // jpg, png, pdf, etc.
  
}
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'sportfit_uploads'
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto', //  Images, PDFs, and Videos automatically
        transformation: [{ width: 500, height: 500, crop: 'limit' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Send the file buffer to Cloudinary
    uploadStream.end(file.buffer);
  });
};