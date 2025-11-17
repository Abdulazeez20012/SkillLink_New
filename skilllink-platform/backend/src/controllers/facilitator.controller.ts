import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { AppError } from '../middleware/error.middleware';

export const getMyCohorts = async (req: AuthRequest, res: Response) => {
  const facilitatorId = req.user!.userId;

  const cohorts = await prisma.cohort.findMany({
    where: {
      OR: [
        { createdById: facilitatorId },
        { members: { some: { userId: facilitatorId, role: 'FACILITATOR' } } }
      ],
      isActive: true
    },
    include: {
      _count: {
        select: {
          members: true,
          assignments: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({ success: true, data: cohorts });
};

export const getCohortOverview = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const facilitatorId = req.user!.userId;

  const cohort = await prisma.cohort.findFirst({
    where: {
      id,
      OR: [
        { createdById: facilitatorId },
        { members: { some: { userId: facilitatorId, role: 'FACILITATOR' } } }
      ]
    },
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        },
        where: { role: 'STUDENT' }
      },
      assignments: {
        include: {
          _count: { select: { submissions: true } }
        },
        orderBy: { dueDate: 'asc' },
        take: 5
      },
      forumPosts: {
        include: {
          user: { select: { id: true, name: true, avatar: true } },
          _count: { select: { answers: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  });

  if (!cohort) {
    throw new AppError('Cohort not found or access denied', 404);
  }

  // Get attendance summary
  const attendanceStats = await prisma.attendance.groupBy({
    by: ['status'],
    where: { cohortId: id },
    _count: true
  });

  res.json({
    success: true,
    data: {
      ...cohort,
      attendanceStats
    }
  });
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { name, avatar, bio, expertise } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { name, avatar },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true
    }
  });

  res.json({ success: true, data: user });
};
