import { Router } from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as officeHoursController from '../controllers/office-hours.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.post(
  '/',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  [
    body('cohortId').isUUID(),
    body('title').trim().notEmpty(),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
    validate
  ],
  officeHoursController.createOfficeHours
);

router.get('/cohort/:cohortId', officeHoursController.getOfficeHoursByCohort);
router.get('/my-office-hours', authorize(UserRole.FACILITATOR), officeHoursController.getMyOfficeHours);
router.get('/my-bookings', officeHoursController.getMyBookings);

router.post('/:officeHoursId/book', officeHoursController.bookOfficeHours);
router.put('/bookings/:bookingId/cancel', officeHoursController.cancelBooking);

router.put(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  officeHoursController.updateOfficeHours
);

router.delete(
  '/:id',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  officeHoursController.deleteOfficeHours
);

export default router;
