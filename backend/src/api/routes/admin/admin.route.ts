import { Router } from "express";
import {protect }from '../../../middleware/auth.middleware';
import {roleMiddleware } from '../../../middleware/role.middleware';
import userRoutes from './userManagment.route';

const adminRouter=Router();
adminRouter.use(protect); 
adminRouter.use(roleMiddleware(['admin']));

adminRouter.use('/users',userRoutes);
export default adminRouter