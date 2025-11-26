import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as assignmentAnalyticsController from '../controllers/assignment-analytics.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.FACILITATOR));

router.get('/assignment/:assignmentId', assignmentAnalyticsController.getAssignmentAnalytics);
router.get('/cohort/:cohortId/assignments', assignmentAnalyticsController.getCohortAssignmentAnalytics);

export default router;
