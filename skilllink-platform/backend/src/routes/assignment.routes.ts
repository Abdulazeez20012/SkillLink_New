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
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('dueDate').isISO8601().withMessage('Valid due date is required'),
    body('cohortId').isUUID().withMessage('Valid cohort ID is required'),
    // Accept both maxPoints and maxScore - at least one must be provided
    body('maxPoints')
      .if(body('maxScore').not().exists())
      .isInt({ min: 1 })
      .withMessage('Max points must be at least 1'),
    body('maxScore')
      .if(body('maxPoints').not().exists())
      .isInt({ min: 1 })
      .withMessage('Max score must be at least 1'),
    validate
  ],
  assignmentController.createAssignment
);

// Specific routes must come before parameterized routes
router.get('/my-submissions', assignmentController.getMySubmissions);

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

router.get('/:assignmentId/my-submission', assignmentController.getMySubmission);
router.post('/:assignmentId/resubmit', assignmentController.resubmitAssignment);
router.get('/:assignmentId/download', assignmentController.downloadSubmission);

export default router;
