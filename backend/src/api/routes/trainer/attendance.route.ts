import { attendanceController } from '@/container';
import { Router } from 'express';
const router = Router();

router.get('/booked-sessions-occurances', attendanceController.getBookedSessionsOccurance);
router.patch('/:sessionId/mark-attendance', attendanceController.markAttendance);
export default router;
