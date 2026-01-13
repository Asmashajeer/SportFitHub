import express, { Router } from 'express';
import { authController } from '../../container';
import { protect } from '../../middleware/auth.middleware';

import { validate } from '../../middleware/validate.middleware';
import { GoogleLoginSchema, LoginSchema, RegisterSchema, updateRoleSchema, VerifyOtpSchema } from '../../dtos/auth.dto'

const router = Router();


router.post('/register',validate(RegisterSchema) ,authController.register);
router.patch('/verifyEmail',validate(VerifyOtpSchema),authController.verifyEmail);
router.post('resendOtp',authController.resendOtp);
router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword',authController.resetPassword);
router.post('/login',validate(LoginSchema) ,authController.login);

router.patch('/updateRole',authController.updateRole);

router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);


router.post('/google-login', authController.googleLogin);

// router.get(
//   '/google',
//   passport.authenticate('google', { scope: ['profile', 'email'], session: false }),
// );

// router.get(
//   '/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login', session: false }),
//   (req, res) => authController.googleCallback(req, res),
// );

router.patch('/updateRole', protect,validate(GoogleLoginSchema) ,authController.updateRole);
router.get('/authMe',protect,authController.authMe);





export default router;
