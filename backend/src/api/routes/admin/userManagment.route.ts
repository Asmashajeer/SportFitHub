

import {  userAdminController } from "../../../container";
import { Router } from "express";


const router=Router();




router.get('/allUsers',userAdminController.getAllusers);
router.get('/getStats',userAdminController.getStats);
router.patch('/toggleBlock',userAdminController.toggleBlock);
router.delete('/deleteUser/:id',userAdminController.deleteUser);
router.patch('/updateRole',userAdminController.updateUserRole);

export default router;