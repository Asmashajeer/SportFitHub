import  { Router } from 'express';
import { profileController } from '../../../container';
import { protect } from '../../../middleware/auth.middleware';

import { uploadMiddleware  } from '@/middleware/upload.middleware';
import { restrictTo } from '@/middleware/role.middleware';
import { UserRole } from '@/constants/enums';

const upload=uploadMiddleware();  // folder name as argument;

const router = Router();
router.use(protect);
router.use(restrictTo([UserRole.USER]));
router.get('/getAllProfile', profileController.getAllProfile);
router.post('/add-Profile', upload.single('profilePic'), profileController.addProfile);
router.get('/getProfile',  profileController.getProfile);
router.get ('/profile_pic/:userId',profileController.getProfilePic)
router.put('/updateProfile',profileController.updateProfile);

export default router;
