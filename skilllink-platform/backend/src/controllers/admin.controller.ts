import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { AdminService } from '../services/admin.service';

const adminService = new AdminService();

export const getAnalytics = async (req: AuthRequest, res: Response) => {
  const analytics = await adminService.getAnalytics();
  res.json({ success: true, data: analytics });
};

export const createFacilitator = async (req: AuthRequest, res: Response) => {
  const { email, password, name } = req.body;
  const facilitator = await adminService.createFacilitator(email, password, name);
  res.status(201).json({ success: true, data: facilitator });
};

export const getFacilitators = async (req: AuthRequest, res: Response) => {
  const facilitators = await adminService.getFacilitators();
  res.json({ success: true, data: facilitators });
};

export const regenerateAccessCode = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const facilitator = await adminService.regenerateAccessCode(id);
  res.json({ success: true, data: facilitator });
};

export const inviteStudents = async (req: AuthRequest, res: Response) => {
  const { cohortId, emails } = req.body;
  const result = await adminService.inviteStudents(cohortId, emails);
  res.json({ success: true, data: result });
};

export const regenerateInviteLinks = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const links = await adminService.regenerateInviteLinks(id);
  res.json({ success: true, data: links });
};

export const getStudents = async (req: AuthRequest, res: Response) => {
  const students = await adminService.getStudents();
  res.json({ success: true, data: students });
};

export const toggleUserStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user = await adminService.toggleUserStatus(id);
  res.json({ success: true, data: user });
};
