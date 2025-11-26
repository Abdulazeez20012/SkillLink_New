import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { RubricService } from '../services/rubric.service';

const rubricService = new RubricService();

export const createRubric = async (req: AuthRequest, res: Response) => {
  const data = req.body;

  try {
    const rubric = await rubricService.createRubric(data);
    res.status(201).json({ success: true, data: rubric });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getRubricByAssignment = async (req: AuthRequest, res: Response) => {
  const { assignmentId } = req.params;

  try {
    const rubric = await rubricService.getRubricByAssignment(assignmentId);
    if (!rubric) {
      res.status(404).json({ success: false, error: 'Rubric not found' });
      return;
    }
    res.json({ success: true, data: rubric });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const updateRubric = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const rubric = await rubricService.updateRubric(id, data);
    res.json({ success: true, data: rubric });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const deleteRubric = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    await rubricService.deleteRubric(id);
    res.json({ success: true, message: 'Rubric deleted successfully' });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
