import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { NotificationService } from '../services/notification.service';

const notificationService = new NotificationService();

export const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { unreadOnly } = req.query;

  const notifications = await notificationService.getUserNotifications(
    userId,
    unreadOnly === 'true'
  );

  res.json({ success: true, data: notifications });
};

export const getUnreadCount = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const count = await notificationService.getUnreadCount(userId);

  res.json({ success: true, data: { count } });
};

export const markAsRead = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const notification = await notificationService.markAsRead(id);

  res.json({ success: true, data: notification });
};

export const markAllAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;

  await notificationService.markAllAsRead(userId);

  res.json({ success: true, message: 'All notifications marked as read' });
};

export const deleteNotification = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  await notificationService.deleteNotification(id);

  res.json({ success: true, message: 'Notification deleted successfully' });
};
