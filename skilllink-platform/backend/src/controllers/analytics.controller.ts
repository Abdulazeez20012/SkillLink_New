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
  
  try {
    const data = await analyticsService.getFacilitatorAnalytics(cohortId);
    
    if (!data) {
      res.status(404).json({ success: false, error: 'Cohort not found' });
      return;
    }

    if (type === 'csv') {
      // Generate CSV
      const csv = analyticsService.generateCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=cohort-analytics-${cohortId}.csv`);
      res.send(csv);
    } else if (type === 'pdf') {
      // For PDF, we'll return a simple text format
      // In production, you'd use a library like pdfkit or puppeteer
      const report = analyticsService.generateTextReport(data);
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Disposition', `attachment; filename=cohort-analytics-${cohortId}.txt`);
      res.send(report);
    } else {
      res.status(400).json({ success: false, error: 'Invalid export type' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to export data' });
  }
};
