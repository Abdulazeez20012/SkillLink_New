import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';
import { generateInviteToken } from '../utils/generateCode';

export const createCohort = async (req: AuthRequest, res: Response) => {
  const { name, description, startDate, endDate, facilitatorId } = req.body;
  
  // Use facilitatorId if provided (admin creating cohort), otherwise use logged-in user (facilitator creating own cohort)
  const createdById = facilitatorId || req.user!.userId;

  const cohort = await prisma.cohort.create({
    data: {
      name,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdById,
      studentInviteLink: generateInviteToken(),
      facilitatorInviteLink: generateInviteToken()
    },
    include: {
      createdBy: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  res.status(201).json({ success: true, data: cohort });
};

export const getCohorts = async (req: AuthRequest, res: Response) => {
  const cohorts = await prisma.cohort.findMany({
    where: { isActive: true },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true, assignments: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, data: cohorts });
};

export const getCohortById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const cohort = await prisma.cohort.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      members: {
        include: {
          user: { select: { id: true, name: true, email: true, avatar: true } }
        }
      },
      assignments: { orderBy: { dueDate: 'asc' } }
    }
  });

  if (!cohort) throw new AppError('Cohort not found', 404);

  res.json({ success: true, data: cohort });
};

export const updateCohort = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  if (data.startDate) data.startDate = new Date(data.startDate);
  if (data.endDate) data.endDate = new Date(data.endDate);

  const cohort = await prisma.cohort.update({
    where: { id },
    data,
    include: {
      createdBy: { select: { id: true, name: true, email: true } }
    }
  });

  res.json({ success: true, data: cohort });
};

export const deleteCohort = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.cohort.update({
    where: { id },
    data: { isActive: false }
  });

  res.json({ success: true, message: 'Cohort deleted successfully' });
};

export const addMember = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { userId, role } = req.body;

  const member = await prisma.cohortUser.create({
    data: {
      cohortId: id,
      userId,
      role
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
  });

  res.status(201).json({ success: true, data: member });
};

export const removeMember = async (req: AuthRequest, res: Response) => {
  const { id, userId } = req.params;

  await prisma.cohortUser.delete({
    where: {
      cohortId_userId: {
        cohortId: id,
        userId
      }
    }
  });

  res.json({ success: true, message: 'Member removed successfully' });
};
