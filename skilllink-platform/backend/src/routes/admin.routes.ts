import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as adminController from '../controllers/admin.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Facilitators Management
router.get('/facilitators', adminController.getFacilitators);
router.post(
  '/facilitators',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('name').trim().notEmpty(),
    validate
  ],
  adminController.createFacilitator
);
router.post('/facilitators/:id/regenerate-code', adminController.regenerateAccessCode);

// Students Management
router.get('/students', adminController.getStudents);
router.post(
  '/invite-students',
  [
    body('cohortId').isUUID(),
    body('emails').isArray().notEmpty(),
    body('emails.*').isEmail(),
    validate
  ],
  adminController.inviteStudents
);

// Invite Links
router.post('/cohorts/:id/regenerate-links', adminController.regenerateInviteLinks);

// User Management
router.put('/users/:id/toggle-status', adminController.toggleUserStatus);

export default router;
