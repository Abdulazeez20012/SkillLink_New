import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as analyticsController from '../controllers/analytics.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get(
  '/admin/overview',
  authorize(UserRole.ADMIN),
  analyticsController.getAdminOverview
);

router.get(
  '/facilitator/:cohortId',
  authorize(UserRole.FACILITATOR, UserRole.ADMIN),
  analyticsController.getFacilitatorAnalytics
);

router.get(
  '/student/progress',
  analyticsController.getStudentProgress
);

router.post('/export', analyticsController.exportData);

export default router;
