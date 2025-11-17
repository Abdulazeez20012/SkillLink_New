import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export const getDashboard = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;

  const [cohorts, upcomingAssignments, recentGrades, attendanceCount] = await Promise.all([
    prisma.cohortUser.findMany({
      where: { userId: studentId, role: 'STUDENT' },
      include: {
        cohort: {
          select: {
            id: true,
            name: true,
            description: true,
            startDate: true,
            endDate: true
          }
        }
      }
    }),
    prisma.assignment.findMany({
      where: {
        cohort: {
          members: { some: { userId: studentId } }
        },
        status: 'PUBLISHED',
        dueDate: { gte: new Date() }
      },
      include: {
        cohort: { select: { id: true, name: true } },
        submissions: {
          where: { userId: studentId },
          select: { id: true, submittedAt: true, grade: true }
        }
      },
      orderBy: { dueDate: 'asc' },
      take: 5
    }),
    prisma.submission.findMany({
      where: {
        userId: studentId,
        grade: { not: null }
      },
      include: {
        assignment: {
          select: { id: true, title: true, maxScore: true }
        }
      },
      orderBy: { gradedAt: 'desc' },
      take: 5
    }),
    prisma.attendance.count({
      where: { userId: studentId, status: 'PRESENT' }
    })
  ]);

  res.json({
    success: true,
    data: {
      cohorts,
      upcomingAssignments,
      recentGrades,
      attendanceCount
    }
  });
};

export const getMyAssignments = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;
  const { status } = req.query;

  const where: any = {
    cohort: {
      members: { some: { userId: studentId } }
    },
    status: 'PUBLISHED'
  };

  if (status === 'upcoming') {
    where.dueDate = { gte: new Date() };
  } else if (status === 'past') {
    where.dueDate = { lt: new Date() };
  }

  const assignments = await prisma.assignment.findMany({
    where,
    include: {
      cohort: { select: { id: true, name: true } },
      submissions: {
        where: { userId: studentId },
        select: {
          id: true,
          submittedAt: true,
          grade: true,
          feedback: true,
          githubUrl: true
        }
      }
    },
    orderBy: { dueDate: 'asc' }
  });

  res.json({ success: true, data: assignments });
};

export const getProgress = async (req: AuthRequest, res: Response) => {
  const studentId = req.user!.userId;

  const [totalAssignments, completedAssignments, averageGrade, attendanceStats] = await Promise.all([
    prisma.assignment.count({
      where: {
        cohort: { members: { some: { userId: studentId } } },
        status: 'PUBLISHED'
      }
    }),
    prisma.submission.count({
      where: { userId: studentId }
    }),
    prisma.submission.aggregate({
      where: { userId: studentId, grade: { not: null } },
      _avg: { grade: true }
    }),
    prisma.attendance.groupBy({
      by: ['status'],
      where: { userId: studentId },
      _count: true
    })
  ]);

  const completionRate = totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0;

  res.json({
    success: true,
    data: {
      totalAssignments,
      completedAssignments,
      completionRate: Math.round(completionRate),
      averageGrade: averageGrade._avg.grade || 0,
      attendanceStats
    }
  });
};
