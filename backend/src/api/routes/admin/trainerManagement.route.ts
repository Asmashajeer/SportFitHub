
import { trainerManagementController } from "@/container";

import { Router } from "express";
const router=Router();

router.patch('/:id/file-status',trainerManagementController.updateFileStatus);
router.patch('/:id/trainer-status',trainerManagementController.updateTrainerStatus);
router.get('/get_pending_trainers', trainerManagementController.getAllPendingTrainers);
router.get('/get_trainer/:id',trainerManagementController.trainerDetails);


export default router;