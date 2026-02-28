import multer from 'multer';

import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '@/config/cloudinaryConfig';

export const uploadMiddleware = () => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      const { uploadType, userId } = req.body;
      const folderName = req.body.folder || ',misc_assets';

      let publicId;
      let overwrite = false;
      if (uploadType === 'profile_pic') {
        publicId = `profile_${userId}_main`;
        overwrite = true; //ONE main profile pic
      } else if (uploadType === 'id_attachment') {
        publicId = `ID_${userId}_main`;
        overwrite = true; //one ID
      } else {
        // Certificates need to be unique so they don't delete each other
        publicId = `cert_${Date.now()}_${file.originalname.split('.')[0]}`;
        overwrite = false;
      }

      const sanitizedFolder = folderName.trim().replace(/\s+/g, '_');
      return {
        folder: sanitizedFolder,
        public_id: publicId,
        overwrite: overwrite,
        invalidate: true, //to refresh globally
        resource_type: 'auto', // Automatically detects if it's an image or PDF
        format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
      };
    },
  });

  return multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit - standard for profile/certs,
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(
          new Error('Invalid file type. Only images and PDFs are allowed!') as unknown as null,
          false
        );
      }
    },
  });
};

// const upload = multer({
//   storage: storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit - standard for profile/certs,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only images and PDFs are allowed!' )as unknown as null, false);
//     }
//   }
// });

// export default upload;
