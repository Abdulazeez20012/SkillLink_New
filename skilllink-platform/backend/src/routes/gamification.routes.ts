import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as gamificationController from '../controllers/gamification.controller';
import { UserRole } from '@prisma/client';

const router = Router();

router.use(authenticate);

// Public routes (authenticated users)
router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/user-stats', gamificationController.getUserStats);
router.post('/update-streak', gamificationController.updateStreak);
router.post('/check-badges', gamificationController.checkBadges);

// Admin/Facilitator routes
router.post(
  '/award-badge',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  gamificationController.awardBadge
);

router.post(
  '/award-points',
  authorize(UserRole.ADMIN, UserRole.FACILITATOR),
  gamificationController.awardPoints
);

export default router;
