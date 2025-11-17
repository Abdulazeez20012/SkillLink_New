import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const recordAttendance = async (req: AuthRequest, res: Response) => {
  const { cohortId, userId, date, status, notes } = req.body;

  const attendance = await prisma.attendance.upsert({
    where: {
      cohortId_userId_date: {
        cohortId,
        userId,
        date: new Date(date)
      }
    },
    update: { status, notes },
    create: {
      cohortId,
      userId,
      date: new Date(date),
      status,
      notes
    },
    include: {
      user: { select: { id: true, name: true, email: true } },
      cohort: { select: { id: true, name: true } }
    }
  });

  res.status(201).json({ success: true, data: attendance });
};

export const getAttendance = async (req: AuthRequest, res: Response) => {
  const { cohortId, userId, startDate, endDate } = req.query;
  const where: any = {};

  if (cohortId) where.cohortId = cohortId;
  if (userId) where.userId = userId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } },
      cohort: { select: { id: true, name: true } }
    },
    orderBy: { date: 'desc' }
  });

  res.json({ success: true, data: attendance });
};

export const getCohortAttendance = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;

  const attendance = await prisma.attendance.findMany({
    where: { cohortId },
    include: {
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { date: 'desc' }
  });

  res.json({ success: true, data: attendance });
};

export const getUserAttendance = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  const attendance = await prisma.attendance.findMany({
    where: { userId },
    include: {
      cohort: { select: { id: true, name: true } }
    },
    orderBy: { date: 'desc' }
  });

  res.json({ success: true, data: attendance });
};
