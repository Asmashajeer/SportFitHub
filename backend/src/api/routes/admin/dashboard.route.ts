
import { adminDashboardController } from '@/container';
import { Router } from 'express';
const router = Router();

router.get('/stats', adminDashboardController.getDashboardStats);
router.get("/revenue",adminDashboardController.getWeeklyRevenue);
router.get("/recent_bookings",adminDashboardController.getRecentBookings);
router.get ('/bookingMetrics',adminDashboardController.getBookingCategoryMetrics);
export default router;