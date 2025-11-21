import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as attendanceController from '../controllers/attendance.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Bulk mark attendance (for facilitators)
router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('cohortId').isUUID(),
    body('date').isISO8601(),
    body('attendanceRecords').isArray(),
    body('attendanceRecords.*.userId').isUUID(),
    body('attendanceRecords.*.status').isIn(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
    validate
  ],
  attendanceController.markAttendance
);

// Single attendance record (legacy)
router.post(
  '/single',
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

// Get my attendance (for students)
router.get('/my-attendance', attendanceController.getMyAttendance);

// Get attendance records
router.get('/', attendanceController.getAttendance);

// Get cohort attendance with date range
router.get('/cohort/:cohortId', attendanceController.getCohortAttendance);

// Get attendance stats for a cohort
router.get('/cohort/:cohortId/stats', attendanceController.getAttendanceStats);

// Get attendance for a specific date
router.get('/cohort/:cohortId/date/:date', attendanceController.getAttendanceByDate);

// Get user attendance
router.get('/user/:userId', attendanceController.getUserAttendance);

export default router;
