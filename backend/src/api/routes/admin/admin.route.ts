import { Router } from "express";
import {protect }from '../../../middleware/auth.middleware';
import {restrictTo } from '../../../middleware/role.middleware';
import userRoutes from './userManagment.route';
import trainerRoutes from './trainerManagement.route'
import { UserRole } from "@/constants/enums";
import categoryRoute from './categoryManagement.route';
const adminRouter=Router();
adminRouter.use(protect); 
adminRouter.use(restrictTo([UserRole.ADMIN]));
adminRouter.use('/trainers',trainerRoutes);
adminRouter.use('/users',userRoutes);
adminRouter.use('/category',categoryRoute);



export default adminRouter