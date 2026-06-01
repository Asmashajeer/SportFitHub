import { walletController } from "@/container";
import { Router } from "express";

const router=Router();
router.get('/',walletController.getBalance);
router.get('/transactions',walletController.getTransactions);

export default router;