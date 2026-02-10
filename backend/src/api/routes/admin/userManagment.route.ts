

import {  userManagementController } from "../../../container";
import { Router } from "express";


const router=Router();




router.get('/allUsers', userManagementController.getAllusers);
router.get('/getStats', userManagementController.getStats);
router.patch('/toggleBlock', userManagementController.toggleBlock);
router.delete('/deleteUser/:id', userManagementController.deleteUser);
router.patch('/updateRole', userManagementController.updateUserRole);

export default router;