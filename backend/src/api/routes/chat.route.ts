import { chatController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import { Router } from 'express';

const router = Router();
router.use(protect);
console.log('in Chat route');
router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getConversations);
router.get('/messages', chatController.getMessages);
router.get('/messages/unread', chatController.getUnreadMessageCount);

export default router;
