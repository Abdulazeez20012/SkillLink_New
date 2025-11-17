import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AnalyticsService } from '../services/analytics.service';

const analyticsService = new AnalyticsService();

export const getAdminOverview = async (req: AuthRequest, res: Response) => {
  const data = await analyticsService.getAdminOverview();
  res.json({ success: true, data });
};

export const getFacilitatorAnalytics = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;
  const data = await analyticsService.getFacilitatorAnalytics(cohortId);
  res.json({ success: true, data });
};

export const getStudentProgress = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const data = await analyticsService.getStudentProgress(userId);
  res.json({ success: true, data });
};

export const exportData = async (req: AuthRequest, res: Response) => {
  const { type, cohortId } = req.body;
  
  // Implementation for CSV/PDF export
  // This would use libraries like csv-writer or pdfkit
  
  res.json({ success: true, message: 'Export functionality to be implemented' });
};
