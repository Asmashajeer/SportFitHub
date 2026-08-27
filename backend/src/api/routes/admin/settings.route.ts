import { settingsController } from "@/container";
import { updateSettingsSchema } from "@/dtos/request/admin/admin.settings.dto";
import { validateBody } from "@/middleware/validate.middleware";
import { Router } from "express";

const router=Router();

router.get('/',  settingsController.getSettings);
router.patch('/', validateBody(updateSettingsSchema),settingsController.updateSettings);
export default router;