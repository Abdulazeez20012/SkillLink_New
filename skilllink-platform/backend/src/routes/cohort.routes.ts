import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as cohortController from '../controllers/cohort.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('name').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('startDate').isISO8601(),
    body('endDate').isISO8601(),
    validate
  ],
  cohortController.createCohort
);

router.get('/', cohortController.getCohorts);
router.get('/:id', cohortController.getCohortById);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  cohortController.updateCohort
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN),
  cohortController.deleteCohort
);

router.post(
  '/:id/members',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  cohortController.addMember
);

router.delete(
  '/:id/members/:userId',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  cohortController.removeMember
);

export default router;
