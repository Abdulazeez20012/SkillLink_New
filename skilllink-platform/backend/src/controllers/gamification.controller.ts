import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { GamificationService } from '../services/gamification.service';

const gamificationService = new GamificationService();

export const getLeaderboard = async (req: AuthRequest, res: Response) => {
  const { cohortId, timeframe } = req.query;
  
  const leaderboard = await gamificationService.getLeaderboard(
    cohortId as string,
    timeframe as any
  );

  res.json({ success: true, data: leaderboard });
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const stats = await gamificationService.getUserStats(userId);

  res.json({ success: true, data: stats });
};

export const awardBadge = async (req: AuthRequest, res: Response) => {
  const { userId, badgeType } = req.body;
  const badge = await gamificationService.awardBadge(userId, badgeType);

  res.json({ success: true, data: badge });
};
