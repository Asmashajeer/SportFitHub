import multer from 'multer';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '@/config/cloudinaryConfig';
import { getDeliveryType } from '@/utils/cloudinaryAccess';
import { AuthRequest } from './auth.middleware';
import { UPLOAD_TYPE } from '@/constants/enums';

const IMAGE_PDF = ['application/pdf'];

const CHAT_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
];

export const uploadMiddleware = () => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const { uploadType } = req.body;
      const userId = (req as AuthRequest).user?.id;
      const folderName = uploadType === UPLOAD_TYPE.CHAT_FILE ? `chat/${userId}` : req.body.folder || 'misc_assets';

      let publicId;
      let overwrite = false;

      if (uploadType === 'profile_pic') {
        publicId = `profile_${userId}_main`;
        overwrite = true; //ONE main profile pic
      } else if (uploadType === 'id_attachment') {
        publicId = `ID_${userId}_main`;
        overwrite = true; //one ID
      } else if (uploadType === 'session_gallery') {
        const orderNumber = Math.floor(Math.random() * 1000) + 1;
        publicId = `session_${userId}_${Date.now()}_${orderNumber}`;
        overwrite = false;
      } else if (uploadType === UPLOAD_TYPE.CERTIFICATES) {
        // Certificates need to be unique so they don't delete each other
        publicId = `cert_${Date.now()}_${file.originalname.split('.')[0]}`;
        overwrite = false;
      } else if (uploadType === UPLOAD_TYPE.CHAT_FILE) {
        const ext = file.originalname.split('.').pop();
        const isRaw = !file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf';
        publicId = `chatfile_${userId}_${Date.now()}_${crypto.randomUUID().slice(0, 8)}${isRaw ? `.${ext}` : ''}`;

        overwrite = false;
      }

      const sanitizedFolder = folderName.trim().replace(/\s+/g, '_');
      return {
        folder: sanitizedFolder,
        public_id: publicId,
        overwrite: overwrite,
        invalidate: true, //to refresh globally
        resource_type: 'auto', // Automatically detects if it's an image or PDF
        type: getDeliveryType(uploadType),
        format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
      };
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit - standard for profile/certs,
    fileFilter: (req, file, cb) => {
      const allowed = req.body.uploadType === UPLOAD_TYPE.CHAT_FILE ? CHAT_MIMES.includes(file.mimetype) : file.mimetype.startsWith('image/') || IMAGE_PDF.includes(file.mimetype);
      allowed ? cb(null, true) : cb(new Error('Invalid file type') as unknown as null, false);
    },
  });
};
