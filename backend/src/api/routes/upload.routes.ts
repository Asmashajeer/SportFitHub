import { Router } from 'express';
import { uploadMiddleware } from '@/middleware/upload.middleware';
const router = Router();
const upload = uploadMiddleware();

router.post('/uploadFile', upload.array('files', 4), (req, res) => {
  if (!req.files &&req.files.length===0) return res.status(400).json({ message: 'Upload failed' });
 
  const urls = (req.files as any[]).map(file => file.path)
  res.json({ urls }); 
});

export default router;
