import express, { Router } from 'express';
import { authController } from '../../container';
import { protect } from '../../middleware/auth.middleware';

import { validate } from '../../middleware/validate.middleware';
import { GoogleLoginSchema, LoginSchema, RegisterSchema, updateRoleSchema, VerifyEmailSchema, VerifyOtpSchema } from '../../dtos/request/auth.request.dto'

const router = Router();


router.post('/register',validate(RegisterSchema) ,authController.register);
router.patch('/verifyEmail',validate(VerifyEmailSchema),authController.verifyEmail);
router.post('/resendOtp',authController.resendOtp);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword',authController.resetPassword);
router.post('/login',validate(LoginSchema) ,authController.login);

router.patch('/updateRole',validate(updateRoleSchema),authController.updateRole);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);


router.post('/google-login', authController.googleLogin);


router.patch('/updateRole', protect,validate(updateRoleSchema) ,authController.updateRole);
router.get('/authMe',protect,authController.authMe);





export default router;
