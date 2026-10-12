import { chatController } from '@/container';
import { protect } from '@/middleware/auth.middleware';
import { Router } from 'express';

const router = Router();
router.use(protect);

router.post('/conversations', chatController.createConversation);
router.get('/conversations', chatController.getConversations);
router.get('/messages', chatController.getMessages);
router.get('/messages/unread', chatController.getUnreadMessageCount);
router.get('/getAttachment', chatController.getAttachedFile);
export default router;
