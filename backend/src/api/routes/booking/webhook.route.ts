import { Router } from 'express';
import  express from 'express';


const router = Router();
import { webhookController } from '@/container';


// STRIPE WEBHOOK ENDPOINT
router.post(
  '/stripe', 
  express.raw({ type: 'application/json' }), //  Keep data raw for Stripe
  webhookController.handleWebhook);
export default router;