import { UserRole } from '@/constants/enums';
import { isBlocked, trainerController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import { timezoneMiddleware } from '@/middleware/timezone.middleware';
import { restrictTo } from '@/middleware/role.middleware';
import { uploadMiddleware } from '@/middleware/upload.middleware';
import sessionRoute from '../trainer/session.route';
import bookingsRoute from './bookings.route'
import attendanceRoute from './attendance.route'

const upload = uploadMiddleware();
import { Router } from 'express';
import { validateBody } from '@/middleware/validate.middleware';
import { AvailabilityPricingSchema, BasicInfoSchema, CertificatesSchema,  IdVerificationSchema, PaymentInfoSchema, PersonalInfoSchema } from '@/dtos/request/trainer/trainer.profile.request.dto';


const router = Router();
router.use(protect);
router.use(isBlocked);
router.use(timezoneMiddleware); 

router.post(
  '/add-profile',
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'idAttachment', maxCount: 1 },
    { name: 'certificates', maxCount: 10 },
  ]),
  trainerController.addProfile
);
router.use(restrictTo([UserRole.TRAINER]));
router.use('/sessions', sessionRoute);
router.use('/bookings', bookingsRoute);
router.use('/attendance', attendanceRoute);


router.get('/profile_pic', trainerController.getProfilePic);
router.patch('/profile/profile_pic/:id', trainerController.updateProfilePic);
router.patch('/profile/:id/basicInfo',validateBody(BasicInfoSchema), trainerController.updateBasicInfo);
router.patch('/profile/:id/personalInfo',validateBody( PersonalInfoSchema), trainerController.updatePersonalInfo);
router.patch('/profile/:id/certificationInfo', validateBody( CertificatesSchema), trainerController.updateCertificates);
router.patch('/profile/:id/idVerification',validateBody( IdVerificationSchema), trainerController.updateIdverification);
router.patch('/profile/:id/availability_pricing', validateBody(AvailabilityPricingSchema), trainerController.updateAvailabilityPricing);
router.patch('/profile/:id/paymentInfo', validateBody(PaymentInfoSchema),trainerController.updatePaymentInfo);
router.patch('/profile/:id/trainer-status', trainerController.updateStatus);

router.get('/profile', trainerController.getProfile);

export default router;
