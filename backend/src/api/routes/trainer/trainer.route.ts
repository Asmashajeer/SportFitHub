import { UserRole } from '@/constants/enums';
import { trainerController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import { timezoneMiddleware } from '@/middleware/timezone.middleware';
import { restrictTo } from '@/middleware/role.middleware';
import { uploadMiddleware } from '@/middleware/upload.middleware';
import sessionRoute from '../trainer/session.route';
import bookingsRoute from './bookings.route'
const upload = uploadMiddleware();
import { Router } from 'express';


const router = Router();
router.use(protect);
router.use(timezoneMiddleware); 
router.use(restrictTo([UserRole.TRAINER]));
router.use('/sessions', sessionRoute);
router.use('/bookings', bookingsRoute);

router.post(
  '/add-profile',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'idAttachment', maxCount: 1 },
    { name: 'certificates', maxCount: 10 },
  ]),
  trainerController.addProfile
);
router.get('/profile_pic', trainerController.getProfilePic);
router.patch('/profile/:id/certificationInfo', trainerController.updateCertificates);
router.patch('/profile/:id/idVerification', trainerController.updateIdverification);
router.patch('/profile/:id/availability_pricing', trainerController.updateAvailabilityPricing);
router.patch('/profile/:id/paymentInfo', trainerController.updatePaymentInfo);
router.patch('/profile/:id/trainer-status', trainerController.updateStatus);

router.get('/profile', trainerController.getProfile);

export default router;
