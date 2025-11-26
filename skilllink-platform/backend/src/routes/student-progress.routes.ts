import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as studentProgressController from '../controllers/student-progress.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN, UserRole.FACILITATOR));

router.get('/cohort/:cohortId/students', studentProgressController.getCohortStudentsProgress);
router.get('/student/:studentId/cohort/:cohortId', studentProgressController.getStudentProgress);

export default router;
