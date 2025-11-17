import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as gamificationController from '../controllers/gamification.controller';

const router = Router();

router.use(authenticate);

router.get('/leaderboard', gamificationController.getLeaderboard);
router.get('/user-stats', gamificationController.getUserStats);
router.post('/award-badge', gamificationController.awardBadge);

export default router;
