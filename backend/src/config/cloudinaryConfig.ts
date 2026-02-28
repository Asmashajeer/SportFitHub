import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export default cloudinary;

// export const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     const folderName = req.body.folder || ',misc_assets';
//     const sanitizedFolder = folderName.trim().replace(/\s+/g, '_');
//     return {
//       folder: sanitizedFolder,
//       resource_type: 'auto', // Automatically detects if it's an image or PDF
//       public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
//       format: file.mimetype === 'application/pdf' ? 'pdf' : undefined,
//     };
//   },
// });
