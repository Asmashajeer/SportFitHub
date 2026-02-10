import { trainerController } from "@/container";
import { protect } from "@/middleware/auth.middleware";

import { Router } from "express";

const router=Router();

router.post('/add-profile',protect,trainerController.addProfile);







export default router;