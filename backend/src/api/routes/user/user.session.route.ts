import { sessionController } from "@/container";
import { Router } from "express";

const router=Router();
router.get('/:sessionModel/:id',sessionController.getSessionDetails);

export default router;