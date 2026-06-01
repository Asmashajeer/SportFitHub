import { Router } from 'express';
import { profileController } from '../../../container';
import { protect } from '../../../middleware/auth.middleware';
import { timezoneMiddleware } from '@/middleware/timezone.middleware';
import { uploadMiddleware } from '@/middleware/upload.middleware';
import { restrictTo } from '@/middleware/role.middleware';
import { UserRole } from '@/constants/enums';
import bookingRoute from '../booking/booking.route'
import sessionRoute from './user.session.route'
import walletRoute from './user.wallet.route'

const upload = uploadMiddleware(); // folder name as argument;

const router = Router();

router.use(protect);
router.use(timezoneMiddleware); 
router.use(restrictTo([UserRole.USER]));
router.use('/sessions',sessionRoute)
router.use('/booking',bookingRoute);
router.use('/wallet',walletRoute);
router.get('/getAllProfile', profileController.getAllProfile);
router.post('/add-Profile', upload.single('profilePic'), profileController.addProfile);
router.get('/profile', profileController.getProfile);
router.get('/profile_pic/:userId', profileController.getProfilePic);
router.put('/profile/:id', profileController.updateProfile);


export default router;
