import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { GamificationService } from '../services/gamification.service';

const gamificationService = new GamificationService();

// Bulk mark attendance for multiple students
export const markAttendance = async (req: AuthRequest, res: Response) => {
  const { cohortId, date, attendanceRecords } = req.body;

  const attendanceDate = new Date(date);
  
  // Create or update attendance records in bulk
  const results = await Promise.all(
    attendanceRecords.map(async (record: any) => {
      const attendance = await prisma.attendance.upsert({
        where: {
          cohortId_userId_date: {
            cohortId,
            userId: record.userId,
            date: attendanceDate
          }
        },
        update: {
          status: record.status,
          notes: record.notes
        },
        create: {
          cohortId,
          userId: record.userId,
          date: attendanceDate,
          status: record.status,
          notes: record.notes
        },
        include: {
          user: { select: { id: true, name: true, email: true } }
        }
      });

      // Trigger gamification for attendance
      await gamificationService.handleAttendance(record.userId, record.status);

      return attendance;
    })
  );

  res.status(201).json({ success: true, data: results });
};

// Single attendance record (legacy support)
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
  const { startDate, endDate } = req.query;

  const where: any = { cohortId };
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate as string);
    if (endDate) where.date.lte = new Date(endDate as string);
  }

  const attendance = await prisma.attendance.findMany({
    where,
    include: {
      user: { select: { id: true, name: true, email: true } }
    },
    orderBy: { date: 'desc' }
  });

  res.json({ success: true, data: attendance });
};

// Get attendance statistics for a cohort
export const getAttendanceStats = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.params;

  const stats = await prisma.attendance.groupBy({
    by: ['status'],
    where: { cohortId },
    _count: true
  });

  const totalRecords = await prisma.attendance.count({ where: { cohortId } });
  
  const attendanceRate = totalRecords > 0
    ? ((stats.find(s => s.status === 'PRESENT')?._count || 0) / totalRecords) * 100
    : 0;

  res.json({ 
    success: true, 
    data: {
      stats,
      totalRecords,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    }
  });
};

// Get attendance for a specific date
export const getAttendanceByDate = async (req: AuthRequest, res: Response) => {
  const { cohortId, date } = req.params;

  const attendance = await prisma.attendance.findMany({
    where: {
      cohortId,
      date: new Date(date)
    },
    include: {
      user: { select: { id: true, name: true, email: true } }
    }
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

// Get my attendance (for students)
export const getMyAttendance = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  const attendance = await prisma.attendance.findMany({
    where: { userId },
    include: {
      cohort: { select: { id: true, name: true } }
    },
    orderBy: { date: 'desc' }
  });

  // Calculate stats
  const stats = {
    total: attendance.length,
    present: attendance.filter(a => a.status === 'PRESENT').length,
    absent: attendance.filter(a => a.status === 'ABSENT').length,
    late: attendance.filter(a => a.status === 'LATE').length,
    excused: attendance.filter(a => a.status === 'EXCUSED').length
  };

  const attendanceRate = stats.total > 0 
    ? (stats.present / stats.total) * 100 
    : 0;

  res.json({ 
    success: true, 
    data: {
      attendance,
      stats,
      attendanceRate: Math.round(attendanceRate * 100) / 100
    }
  });
};
