import { Router } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import facilitatorRoutes from './facilitator.routes';
import cohortRoutes from './cohort.routes';
import assignmentRoutes from './assignment.routes';
import forumRoutes from './forum.routes';
import attendanceRoutes from './attendance.routes';
import gamificationRoutes from './gamification.routes';
import analyticsRoutes from './analytics.routes';
import aiRoutes from './ai.routes';
import githubRoutes from './github.routes';
import announcementRoutes from './announcement.routes';
import notificationRoutes from './notification.routes';
import messageRoutes from './message.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/facilitator', facilitatorRoutes);
router.use('/cohorts', cohortRoutes);
router.use('/assignments', assignmentRoutes);
router.use('/forum', forumRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/gamification', gamificationRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/github', githubRoutes);
router.use('/announcements', announcementRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);

router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SkillLink API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

export default router;
