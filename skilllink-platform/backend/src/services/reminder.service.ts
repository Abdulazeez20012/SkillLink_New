import cron from 'node-cron';
import prisma from '../config/database';
import { sendEmail } from '../utils/email.service';
import { format, addDays, isBefore, isAfter } from 'date-fns';

export class ReminderService {
  private cronJob: cron.ScheduledTask | null = null;

  // Start the reminder cron job - runs every day at 9 AM
  startReminderCron() {
    console.log('📧 Starting assignment reminder service...');
    
    // Run every day at 9:00 AM
    this.cronJob = cron.schedule('0 9 * * *', async () => {
      console.log('🔔 Running daily assignment reminders...');
      await this.sendDueDateReminders();
    });

    console.log('✅ Reminder service started successfully');
  }

  // Stop the cron job
  stopReminderCron() {
    if (this.cronJob) {
      this.cronJob.stop();
      console.log('⏹️  Reminder service stopped');
    }
  }

  // Send reminders for assignments due soon
  async sendDueDateReminders() {
    try {
      const now = new Date();
      const tomorrow = addDays(now, 1);
      const nextWeek = addDays(now, 7);

      // Find assignments due in the next 24 hours or 7 days
      const upcomingAssignments = await prisma.assignment.findMany({
        where: {
          status: 'PUBLISHED',
          dueDate: {
            gte: now,
            lte: nextWeek
          }
        },
        include: {
          cohort: {
            include: {
              members: {
                where: {
                  role: 'STUDENT'
                },
                include: {
                  user: true
                }
              }
            }
          }
        }
      });

      let remindersSent = 0;

      for (const assignment of upcomingAssignments) {
        const isDueTomorrow = isBefore(assignment.dueDate, tomorrow);
        
        for (const member of assignment.cohort.members) {
          // Check if student has already submitted
          const submission = await prisma.submission.findFirst({
            where: {
              assignmentId: assignment.id,
              userId: member.userId
            }
          });

          // Only send reminder if not submitted
          if (!submission) {
            const urgency = isDueTomorrow ? 'URGENT' : 'UPCOMING';
            await this.sendReminderEmail(
              member.user,
              assignment,
              urgency
            );
            remindersSent++;
          }
        }
      }

      console.log(`✅ Sent ${remindersSent} assignment reminders`);
      return remindersSent;
    } catch (error) {
      console.error('❌ Error sending reminders:', error);
      throw error;
    }
  }

  // Send individual reminder email
  private async sendReminderEmail(
    user: any,
    assignment: any,
    urgency: 'URGENT' | 'UPCOMING'
  ) {
    const dueDate = format(new Date(assignment.dueDate), 'MMMM dd, yyyy \'at\' hh:mm a');
    const isUrgent = urgency === 'URGENT';

    const subject = isUrgent
      ? `⚠️ URGENT: ${assignment.title} due tomorrow!`
      : `📚 Reminder: ${assignment.title} due soon`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: ${isUrgent ? '#dc2626' : '#6366f1'}; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .assignment-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${isUrgent ? '#dc2626' : '#6366f1'}; }
          .button { display: inline-block; background: ${isUrgent ? '#dc2626' : '#6366f1'}; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">${isUrgent ? '⚠️ Urgent' : '📚'} Assignment Reminder</h1>
          </div>
          <div class="content">
            <p>Hi ${user.name},</p>
            
            <p>${isUrgent 
              ? '<strong>This is an urgent reminder!</strong> Your assignment is due tomorrow.' 
              : 'This is a friendly reminder about an upcoming assignment.'
            }</p>

            <div class="assignment-box">
              <h2 style="margin-top: 0; color: ${isUrgent ? '#dc2626' : '#6366f1'};">${assignment.title}</h2>
              <p><strong>Due Date:</strong> ${dueDate}</p>
              <p><strong>Max Points:</strong> ${assignment.maxScore}</p>
              <p style="margin-bottom: 0;"><strong>Description:</strong></p>
              <p>${assignment.description}</p>
            </div>

            <p>${isUrgent 
              ? 'Please submit your work as soon as possible to avoid missing the deadline!' 
              : 'Make sure to plan your time and submit before the deadline.'
            }</p>

            <a href="${process.env.CLIENT_URL}/student/assignments" class="button">
              View Assignment
            </a>

            <div class="footer">
              <p>This is an automated reminder from SkillLink</p>
              <p>If you've already submitted, please disregard this email</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail({
        to: user.email,
        subject,
        html
      });
      console.log(`📧 Reminder sent to ${user.email} for "${assignment.title}"`);
    } catch (error) {
      console.error(`❌ Failed to send reminder to ${user.email}:`, error);
    }
  }

  // Manual trigger for testing
  async sendTestReminder() {
    console.log('🧪 Sending test reminders...');
    return await this.sendDueDateReminders();
  }
}

export default new ReminderService();
