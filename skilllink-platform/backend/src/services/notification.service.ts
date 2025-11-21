import prisma from '../config/database';
import { sendEmail } from '../utils/email.service';
import { websocketService } from './websocket.service';

export type NotificationType = 
  | 'ASSIGNMENT_DUE'
  | 'ASSIGNMENT_GRADED'
  | 'ANNOUNCEMENT'
  | 'FORUM_ANSWER'
  | 'BADGE_EARNED'
  | 'ATTENDANCE_MARKED'
  | 'GENERAL';

export class NotificationService {
  // Create in-app notification
  async createNotification(
    userId: string,
    title: string,
    message: string,
    type: NotificationType,
    link?: string
  ) {
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        link
      }
    });

    // Send real-time notification via WebSocket
    websocketService.sendNotificationToUser(userId, notification);

    return notification;
  }

  // Get user notifications
  async getUserNotifications(userId: string, unreadOnly = false) {
    return prisma.notification.findMany({
      where: {
        userId,
        ...(unreadOnly && { read: false })
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }

  // Mark notification as read
  async markAsRead(notificationId: string) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }

  // Mark all as read
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true }
    });
  }

  // Delete notification
  async deleteNotification(notificationId: string) {
    return prisma.notification.delete({
      where: { id: notificationId }
    });
  }

  // Get unread count
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { userId, read: false }
    });
  }

  // Assignment due reminder
  async notifyAssignmentDue(assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        cohort: {
          include: {
            members: {
              where: { role: 'STUDENT' },
              include: { user: true }
            }
          }
        }
      }
    });

    if (!assignment) return;

    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    // Only notify if due within 24 hours
    if (hoursUntilDue > 24 || hoursUntilDue < 0) return;

    for (const member of assignment.cohort.members) {
      // Check if already submitted
      const submission = await prisma.submission.findFirst({
        where: {
          assignmentId,
          userId: member.userId
        }
      });

      if (!submission) {
        // Create in-app notification
        await this.createNotification(
          member.userId,
          'Assignment Due Soon',
          `"${assignment.title}" is due in ${Math.round(hoursUntilDue)} hours`,
          'ASSIGNMENT_DUE',
          `/student/assignments`
        );

        // Send email
        await sendEmail({
          to: member.user.email,
          subject: `Assignment Due Soon: ${assignment.title}`,
          html: `
            <h2>Assignment Reminder</h2>
            <p>Hi ${member.user.name},</p>
            <p>This is a reminder that your assignment <strong>"${assignment.title}"</strong> is due soon.</p>
            <p><strong>Due Date:</strong> ${dueDate.toLocaleString()}</p>
            <p><strong>Time Remaining:</strong> ${Math.round(hoursUntilDue)} hours</p>
            <p>Please submit your work before the deadline.</p>
            <p>Best regards,<br>SkillLink Team</p>
          `,
          text: `Assignment "${assignment.title}" is due in ${Math.round(hoursUntilDue)} hours. Due: ${dueDate.toLocaleString()}`
        });
      }
    }
  }

  // Assignment graded notification
  async notifyAssignmentGraded(submissionId: string) {
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        assignment: true,
        user: true
      }
    });

    if (!submission || submission.grade === null) return;

    // Create in-app notification
    await this.createNotification(
      submission.userId,
      'Assignment Graded',
      `Your assignment "${submission.assignment.title}" has been graded: ${submission.grade}/${submission.assignment.maxScore}`,
      'ASSIGNMENT_GRADED',
      `/student/assignments`
    );

    // Send email
    await sendEmail({
      to: submission.user.email,
      subject: `Assignment Graded: ${submission.assignment.title}`,
      html: `
        <h2>Assignment Graded</h2>
        <p>Hi ${submission.user.name},</p>
        <p>Your assignment <strong>"${submission.assignment.title}"</strong> has been graded.</p>
        <p><strong>Grade:</strong> ${submission.grade}/${submission.assignment.maxScore} (${((submission.grade / submission.assignment.maxScore) * 100).toFixed(1)}%)</p>
        ${submission.feedback ? `<p><strong>Feedback:</strong> ${submission.feedback}</p>` : ''}
        <p>Keep up the great work!</p>
        <p>Best regards,<br>SkillLink Team</p>
      `,
      text: `Your assignment "${submission.assignment.title}" has been graded: ${submission.grade}/${submission.assignment.maxScore}`
    });
  }

  // Forum answer notification
  async notifyForumAnswer(answerId: string) {
    const answer = await prisma.forumAnswer.findUnique({
      where: { id: answerId },
      include: {
        post: {
          include: {
            user: true
          }
        },
        user: true
      }
    });

    if (!answer || answer.userId === answer.post.userId) return;

    // Notify post author
    await this.createNotification(
      answer.post.userId,
      'New Answer to Your Question',
      `${answer.user.name} answered your question: "${answer.post.title}"`,
      'FORUM_ANSWER',
      `/student/forum`
    );

    // Send email
    await sendEmail({
      to: answer.post.user.email,
      subject: `New Answer: ${answer.post.title}`,
      html: `
        <h2>New Answer to Your Question</h2>
        <p>Hi ${answer.post.user.name},</p>
        <p><strong>${answer.user.name}</strong> answered your question:</p>
        <p><strong>Question:</strong> ${answer.post.title}</p>
        <p><strong>Answer:</strong> ${answer.content.substring(0, 200)}${answer.content.length > 200 ? '...' : ''}</p>
        <p>View the full answer on SkillLink.</p>
        <p>Best regards,<br>SkillLink Team</p>
      `,
      text: `${answer.user.name} answered your question: "${answer.post.title}"`
    });
  }

  // Badge earned notification
  async notifyBadgeEarned(userId: string, badgeName: string, badgeDescription: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    await this.createNotification(
      userId,
      'Badge Earned!',
      `Congratulations! You earned the "${badgeName}" badge`,
      'BADGE_EARNED',
      `/student`
    );

    await sendEmail({
      to: user.email,
      subject: `Badge Earned: ${badgeName}`,
      html: `
        <h2>🏆 Congratulations!</h2>
        <p>Hi ${user.name},</p>
        <p>You've earned a new badge: <strong>${badgeName}</strong></p>
        <p>${badgeDescription}</p>
        <p>Keep up the excellent work!</p>
        <p>Best regards,<br>SkillLink Team</p>
      `,
      text: `Congratulations! You earned the "${badgeName}" badge`
    });
  }

  // Announcement notification
  async notifyAnnouncement(announcementId: string) {
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        cohort: {
          include: {
            members: {
              include: { user: true }
            }
          }
        },
        createdBy: true
      }
    });

    if (!announcement) return;

    const recipients = announcement.cohortId
      ? announcement.cohort!.members
      : await prisma.user.findMany({ where: { isActive: true } });

    for (const recipient of recipients) {
      const user = 'user' in recipient ? recipient.user : recipient;

      await this.createNotification(
        user.id,
        announcement.title,
        announcement.content.substring(0, 200),
        'ANNOUNCEMENT',
        `/announcements`
      );

      await sendEmail({
        to: user.email,
        subject: `Announcement: ${announcement.title}`,
        html: `
          <h2>📢 New Announcement</h2>
          <p>Hi ${user.name},</p>
          <h3>${announcement.title}</h3>
          <p>${announcement.content}</p>
          <p><em>Posted by ${announcement.createdBy.name}</em></p>
          <p>Best regards,<br>SkillLink Team</p>
        `,
        text: `Announcement: ${announcement.title}\n\n${announcement.content}`
      });
    }
  }
}
