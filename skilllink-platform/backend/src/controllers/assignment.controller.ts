import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const createAssignment = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, dueDate, cohortId, maxPoints, maxScore } = req.body;
    const createdById = req.user!.userId;

    // Debug logging
    console.log('Creating assignment with data:', {
      title,
      description,
      dueDate,
      cohortId,
      maxPoints,
      maxScore,
      createdById
    });

    // Validate required fields
    if (!title || !description || !dueDate || !cohortId) {
      throw new AppError('Missing required fields', 400);
    }

    // Accept both maxPoints (frontend) and maxScore (database field)
    const points = maxPoints || maxScore;

    if (!points || points <= 0) {
      throw new AppError('Max points must be greater than 0', 400);
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        description,
        dueDate: new Date(dueDate),
        cohortId,
        maxScore: Number(points),
        createdById
      },
      include: {
        cohort: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } }
      }
    });

    console.log('Assignment created successfully:', assignment.id);
    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    console.error('Error creating assignment:', error);
    throw error;
  }
};

export const getAssignments = async (req: AuthRequest, res: Response) => {
  const { cohortId, status } = req.query;
  const where: any = {};
  
  if (cohortId) where.cohortId = cohortId;
  if (status) where.status = status;

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      cohort: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      _count: { select: { submissions: true } }
    },
    orderBy: { dueDate: 'asc' }
  });

  res.json({ success: true, data: assignments });
};

export const getAssignmentById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const assignment = await prisma.assignment.findUnique({
    where: { id },
    include: {
      cohort: { select: { id: true, name: true } },
      createdBy: { select: { id: true, name: true } },
      submissions: {
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      }
    }
  });

  if (!assignment) throw new AppError('Assignment not found', 404);

  res.json({ success: true, data: assignment });
};

export const updateAssignment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (data.dueDate) data.dueDate = new Date(data.dueDate);

  const assignment = await prisma.assignment.update({
    where: { id },
    data
  });

  res.json({ success: true, data: assignment });
};

export const deleteAssignment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.assignment.update({
    where: { id },
    data: { status: 'ARCHIVED' }
  });

  res.json({ success: true, message: 'Assignment archived successfully' });
};

export const submitAssignment = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { githubUrl, files } = req.body;
  const userId = req.user!.userId;

  const submission = await prisma.submission.create({
    data: {
      assignmentId: id,
      userId,
      githubUrl,
      files: files || []
    },
    include: {
      assignment: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.status(201).json({ success: true, data: submission });
};

export const gradeSubmission = async (req: AuthRequest, res: Response) => {
  const { submissionId } = req.params;
  const { grade, feedback } = req.body;

  const submission = await prisma.submission.update({
    where: { id: submissionId },
    data: {
      grade,
      feedback,
      gradedAt: new Date()
    },
    include: {
      assignment: { select: { id: true, title: true } },
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.json({ success: true, data: submission });
};
