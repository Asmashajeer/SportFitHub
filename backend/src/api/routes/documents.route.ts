import { UserRole } from "@/constants/enums";
import { documentsController } from "@/container";
import { protect } from "@/middleware/auth.middleware";
import { restrictTo } from "@/middleware/role.middleware";
import { Router } from "express";

const router=Router();

router.use(protect);
router.use(restrictTo([UserRole.TRAINER,UserRole.ADMIN]));
// router.get('/:certId/view-url',certificateController.getCertificateViewUrl);
router.get('/download', documentsController.getDocumentFile);
export  default router;