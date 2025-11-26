import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StudentProgressService } from '../services/student-progress.service';

const studentProgressService = new StudentProgressService();

export const getStudentProgress = async (req: AuthRequest, res: Response) => {
  const { studentId, cohortId } = req.params;

  try {
    const progress = await studentProgressService.getStudentProgress(studentId, cohortId);
    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};

export const getCohortStudentsProgress = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;

  try {
    const progress = await studentProgressService.getCohortStudentsProgress(cohortId);
    res.json({ success: true, data: progress });
  } catch (error: any) {
    res.status(400).json({ success: false, error: error.message });
  }
};
