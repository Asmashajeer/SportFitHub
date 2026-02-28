import { fitnessManagementController } from '@/container';
import { UserRole } from '@/constants/enums';
import { sportManagementController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import { restrictTo } from '@/middleware/role.middleware';
import { Router } from 'express';
const router = Router();
router.use(protect);
router.use(restrictTo([UserRole.ADMIN]));

//sports Management

router.post('/sports/sport', sportManagementController.addSport);
router.get('/sports', sportManagementController.getAllSports);
router.patch('/sports/status/:id', sportManagementController.toggleSportStatus);
router.put('/sports/:id', sportManagementController.updateSport);
router.delete('/sports/:id', sportManagementController.deleteSport);

//fitnesspPgmManagement

router.post('/fitness/program', fitnessManagementController.addProgram);
router.get('/fitness', fitnessManagementController.getAllPrograms);
router.patch('/fitness/program-status/:id', fitnessManagementController.toggleProgramStatus);
router.put('/fitness/program/:id', fitnessManagementController.updateProgram);
router.delete('/fitness/program/:id', fitnessManagementController.deleteProgram);

export default router;
