
import { fitnessSessionController, sportsSessionController} from '@/container';
import { fitnessSessionSchema } from '@/dtos/request/session/fitness.session.request.dto';
import { sportsSessionSchema } from '@/dtos/request/session/session.request.dto';
import { validateBody } from '@/middleware/validate.middleware';
import { Router } from "express";
const router=Router();
//----------------Sports session route--------------
router.post('/sports/sport',validateBody(sportsSessionSchema), sportsSessionController.createSportSession);
router.get('/sports/sport/:id/update', sportsSessionController.getSportSessiontoUpdate);
router.put('/sports/sport/:id',validateBody(sportsSessionSchema), sportsSessionController.updateSportSession);
router.delete('/sports/sport/:id', sportsSessionController.deleteSportSession);
router.patch('/sports/sport/:id', sportsSessionController.updateSessionVisibility);
router.get('/sports',sportsSessionController.getTrainerSessions);



//----------------fitness Session Route----------------------
router.post('/fitness/fitnessSession',validateBody(fitnessSessionSchema), fitnessSessionController.createFitnessSession);
router.put('/fitness/fitnessSession/:id',validateBody(fitnessSessionSchema), fitnessSessionController.updateFitnessSession);
router.delete('/fitness/fitnessSession/:id', fitnessSessionController.deleteFitnessSession);
router.patch('/fitness/fitnessSession/:id', fitnessSessionController.updateSessionVisibility);
router.get('/fitness',fitnessSessionController.getTrainerSessions);


//--------------BOKKED SESSION ROUTE-----------------

export default router;