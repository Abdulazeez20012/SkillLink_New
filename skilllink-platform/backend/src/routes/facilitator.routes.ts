import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as facilitatorController from '../controllers/facilitator.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);
router.use(authorize(UserRole.FACILITATOR, UserRole.ADMIN));

router.get('/cohorts', facilitatorController.getMyCohorts);
router.get('/cohorts/:id/overview', facilitatorController.getCohortOverview);
router.put('/profile', facilitatorController.updateProfile);

export default router;
