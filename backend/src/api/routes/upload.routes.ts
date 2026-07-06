import { Router } from 'express';
import { uploadMiddleware } from '@/middleware/upload.middleware';
import { protect } from '@/middleware/auth.middleware';
const router = Router();
const upload = uploadMiddleware();
router.use(protect);
router.post('/uploadFile', upload.array('files', 4), (req, res) => {

  // if (!req.files &&req.files.length===0) return res.status(400).json({ message: 'Upload failed' });
  const files = req.files as Express.Multer.File[] | undefined;
   if (!files || files.length === 0) {
    return res.status(400).json({ message: 'Upload failed' });
  }
  const publicIds = (req.files as any[]).map(file => file.filename);
  res.json({ urls: publicIds }); 
  
});

export default router;
