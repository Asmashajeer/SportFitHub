import { Router } from 'express';
import { authController } from '../../container';
import { protect } from '../../middleware/auth.middleware';

import { validateBody } from '../../middleware/validate.middleware';
import {
  LoginSchema,
  RegisterSchema,
  updateRoleSchema,
  VerifyEmailSchema,
} from '../../dtos/request/auth.request.dto';
import { restrictTo } from '@/middleware/role.middleware';

import { UserRole } from '@/constants/enums';

const router = Router();

router.post('/register', validateBody(RegisterSchema), authController.register);
router.patch('/verifyEmail', validateBody(VerifyEmailSchema), authController.verifyEmail);
router.post('/resendOtp', authController.resendOtp);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);
router.post('/login', validateBody(LoginSchema), authController.login);
// router.patch('/updateRole', protect, validateBody(updateRoleSchema), authController.updateRole);

router.post('/refresh', authController.refresh);

router.post('/google-login', authController.googleLogin);
router.patch('/setActiveRole', protect, validateBody(updateRoleSchema), authController.setActiveRole);


router.get('/authMe', protect, authController.authMe);
router.post('/fcm-token', protect,authController.updateFcmToken);


router.post(
  '/logout',
  protect,
  restrictTo([UserRole.ADMIN, UserRole.USER, UserRole.TRAINER]),
  authController.logout
);

export default router;
