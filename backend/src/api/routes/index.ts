import { Router } from 'express';
import authRoute from './auth.route';
import adminRoute from './admin/admin.route';
import userRoute from './user/user.route';
import trainerRoute from './trainer/trainer.route';
import uploadRoute from './upload.routes';
import publicRoute from './public.route';
import bookingRoute from './booking/booking.route';
import documentsRoute from './documents.route';
import chatRoute from './chat.route';
const rootRouter = Router();

rootRouter.use('/', publicRoute);
rootRouter.use('/auth', authRoute);
rootRouter.use('/admin', adminRoute);
rootRouter.use('/user', userRoute);
rootRouter.use('/trainer', trainerRoute);
rootRouter.use('/upload', uploadRoute);
rootRouter.use('/booking', bookingRoute);
rootRouter.use('/documents', documentsRoute);
rootRouter.use('/chat', chatRoute);

export default rootRouter;
