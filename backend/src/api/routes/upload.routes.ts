import { Router } from 'express';
import { uploadMiddleware  } from '@/middleware/upload.middleware';
const router = Router();
const upload=uploadMiddleware();

router.post('/uploadFile', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Upload failed' });
  res.json({ url: req.file.path }); // Return the secure_url from Cloudinary
});

export default router;