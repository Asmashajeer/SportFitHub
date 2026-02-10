import express, { Router } from 'express';
import { profileController } from '../../../container';
import { protect } from '../../../middleware/auth.middleware';
import { uploadUser } from '@/middleware/multer';
const router = Router();

router.post('/add-Profile', protect,uploadUser, profileController.addProfile);
router.get('/getAllProfile', protect, profileController.getAllProfile);
router.get('/getProfile', protect, profileController.getMyProfile);
router.put('/updateProfile', protect, profileController.updateProfile);
export default router;