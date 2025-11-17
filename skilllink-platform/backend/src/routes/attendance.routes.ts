import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as attendanceController from '../controllers/attendance.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('cohortId').isUUID(),
    body('userId').isUUID(),
    body('date').isISO8601(),
    body('status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    validate
  ],
  attendanceController.recordAttendance
);

router.get('/', attendanceController.getAttendance);
router.get('/cohort/:cohortId', attendanceController.getCohortAttendance);
router.get('/user/:userId', attendanceController.getUserAttendance);

export default router;
