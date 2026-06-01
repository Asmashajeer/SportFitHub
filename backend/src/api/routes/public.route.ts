import { bookingController, fitnessController, fitnessSessionController, sportsController, sportsSessionController } from "@/container";
import { Router } from "express";
const router=Router();

//-----------------sports -----------------
router.get('/sportsCategory',sportsController.getAvailableSports);
router.get('/sportsCategory',sportsController.getAvailableSports);
router.get('/sports/sessions',sportsSessionController.getAllSessions);
router.get('/sports/sessions/:id',sportsSessionController.getSportSession);

//----------------------fitness -------------------
router.get('/fitnessCategory',fitnessController.getAvailableFitnessPrograms);
router.get('/fitness/sessions',fitnessSessionController.getAllSessions);
router.get('/fitness/sessions/:id',fitnessSessionController.getFitnessSession);
router.get('/availability/:sessionId',bookingController.getPublicBookedSlots);
export default router;