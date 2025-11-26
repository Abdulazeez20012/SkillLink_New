import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AssignmentAnalyticsService } from '../services/assignment-analytics.service';

const assignmentAnalyticsService = new AssignmentAnalyticsService();

export const getAssignmentAnalytics = async (req: AuthRequest, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const analytics = await assignmentAnalyticsService.getAssignmentAnalytics(assignmentId);
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getCohortAssignmentAnalytics = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;

  try {
    const analytics = await assignmentAnalyticsService.getCohortAssignmentAnalytics(cohortId);
    res.json({ success: true, data: analytics });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
