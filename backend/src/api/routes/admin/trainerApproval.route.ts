import { trainerApprovalsController } from "@/container";
import { Router } from "express";
const router=Router();
router.patch('/:id/file-status',trainerApprovalsController.updateFileStatus);
router.patch('/:id/trainer-status',trainerApprovalsController.updateFileStatus);
router.get('/get_pending_trainers', trainerApprovalsController.getAllPendingTrainers);
router.get('/get_trainer/:id',trainerApprovalsController.getTrainer);


export default router;