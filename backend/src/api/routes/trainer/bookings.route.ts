import { bookingController } from "@/container";
import { Router } from "express";
const router=Router();
router.get('/:trainerId',bookingController.getBookedSessionsByTrainer);


export default router;