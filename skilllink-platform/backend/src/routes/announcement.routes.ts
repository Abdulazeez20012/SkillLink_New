import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as announcementController from '../controllers/announcement.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('title').trim().notEmpty(),
    body('content').trim().notEmpty(),
    validate
  ],
  announcementController.createAnnouncement
);

router.get('/', announcementController.getAnnouncements);
router.get('/:id', announcementController.getAnnouncementById);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  announcementController.updateAnnouncement
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  announcementController.deleteAnnouncement
);

export default router;
