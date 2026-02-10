import multer from 'multer';
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary';
import cloudinary from '@/config/cloudinaryConfig';



export const uploadUser = multer({ 
  storage:multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB
}).single('profilePic');



export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {    
    const folderName = req.body.folder || 'trainer_assets';
    
    return {
      folder: folderName,
      resource_type: 'auto', // Automatically detects if it's an image or PDF
      public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
    };
  },
});

// const upload = multer({ storage: storage });