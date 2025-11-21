import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import * as messageController from '../controllers/message.controller';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  [
    body('receiverId').isUUID(),
    body('content').trim().notEmpty(),
    validate
  ],
  messageController.sendMessage
);

router.get('/conversations', messageController.getConversations);
router.get('/conversation/:partnerId', messageController.getConversation);
router.put('/read/:partnerId', messageController.markAsRead);

export default router;
