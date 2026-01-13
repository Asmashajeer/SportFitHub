import express, { Router } from 'express';
import { profileController } from '../../container';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

router.post('/createProfile', protect, profileController.createProfile);
router.get('/getAllProfile', protect, profileController.getAllProfile);
router.get('/getProfile', protect, profileController.getMyProfile);
router.put('/updateProfile', protect, profileController.updateProfile);
export default router;
