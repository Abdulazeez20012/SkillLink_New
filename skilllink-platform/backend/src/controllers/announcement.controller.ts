import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  const { title, content, priority, cohortId } = req.body;
  const createdById = req.user!.userId;

  const announcement = await prisma.announcement.create({
    data: {
      title,
      content,
      priority: priority || 'NORMAL',
      cohortId,
      createdById
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      cohort: { select: { id: true, name: true } }
    }
  });

  // Send notifications
  await notificationService.notifyAnnouncement(announcement.id);

  res.status(201).json({ success: true, data: announcement });
};

export const getAnnouncements = async (req: AuthRequest, res: Response) => {
  const { cohortId } = req.query;
  const userId = req.user!.userId;

  // Get user's cohorts
  const userCohorts = await prisma.cohortUser.findMany({
    where: { userId },
    select: { cohortId: true }
  });

  const cohortIds = userCohorts.map(uc => uc.cohortId);

  const announcements = await prisma.announcement.findMany({
    where: {
      OR: [
        { cohortId: null }, // Global announcements
        { cohortId: cohortId ? (cohortId as string) : { in: cohortIds } }
      ]
    },
    include: {
      createdBy: { select: { id: true, name: true } },
      cohort: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  });

  res.json({ success: true, data: announcements });
};

export const getAnnouncementById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const announcement = await prisma.announcement.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true } },
      cohort: { select: { id: true, name: true } }
    }
  });

  if (!announcement) {
    res.status(404).json({ success: false, error: 'Announcement not found' });
    return;
  }

  res.json({ success: true, data: announcement });
};

export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { title, content, priority } = req.body;

  const announcement = await prisma.announcement.update({
    where: { id },
    data: { title, content, priority },
    include: {
      createdBy: { select: { id: true, name: true } },
      cohort: { select: { id: true, name: true } }
    }
  });

  res.json({ success: true, data: announcement });
};

export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await prisma.announcement.delete({ where: { id } });

  res.json({ success: true, message: 'Announcement deleted successfully' });
};
