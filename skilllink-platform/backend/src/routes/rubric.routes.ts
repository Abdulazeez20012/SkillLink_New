import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as rubricController from '../controllers/rubric.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('assignmentId').isUUID(),
    body('name').trim().notEmpty(),
    body('criteria').isArray().notEmpty(),
    body('criteria.*.name').trim().notEmpty(),
    body('criteria.*.maxPoints').isInt({ min: 1 }),
    validate
  ],
  rubricController.createRubric
);

router.get('/assignment/:assignmentId', rubricController.getRubricByAssignment);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  rubricController.updateRubric
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  rubricController.deleteRubric
);

export default router;
