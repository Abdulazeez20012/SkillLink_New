import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as assignmentController from '../controllers/assignment.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('title').trim().notEmpty(),
    body('description').trim().notEmpty(),
    body('dueDate').isISO8601(),
    body('cohortId').isUUID(),
    body('maxScore').isInt({ min: 1 }),
    validate
  ],
  assignmentController.createAssignment
);

router.get('/', assignmentController.getAssignments);
router.get('/:id', assignmentController.getAssignmentById);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  assignmentController.updateAssignment
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  assignmentController.deleteAssignment
);

router.post('/:id/submit', assignmentController.submitAssignment);

router.put(
  '/:id/submissions/:submissionId/grade',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  assignmentController.gradeSubmission
);

export default router;
