import { UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { AppError } from '../middleware/error.middleware';
import { generateAccessCode, generateInviteToken } from '../utils/generateCode';
import { sendEmail } from '../utils/email.service';

export class AdminService {
  async getAnalytics() {
    const [totalUsers, totalCohorts, activeCohorts, totalAssignments] = await Promise.all([
      prisma.user.count(),
      prisma.cohort.count(),
      prisma.cohort.count({ where: { isActive: true } }),
      prisma.assignment.count()
    ]);

    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    const recentActivity = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    return {
      totalUsers,
      totalCohorts,
      activeCohorts,
      totalAssignments,
      usersByRole,
      recentActivity
    };
  }

  async createFacilitator(email: string, password: string, name: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    
    if (existingUser) {
      throw new AppError('Email already registered', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const accessCode = generateAccessCode();

    const facilitator = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: UserRole.FACILITATOR,
        accessCode
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        accessCode: true,
        createdAt: true
      }
    });

    // Send welcome email with access code
    await sendEmail({
      to: email,
      subject: 'Welcome to SkillLink - Facilitator Access',
      html: `
        <h2>Welcome to SkillLink!</h2>
        <p>Hi ${name},</p>
        <p>Your facilitator account has been created. Here are your login credentials:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Access Code:</strong> <code style="font-size: 18px; background: #f3f4f6; padding: 8px 12px; border-radius: 4px;">${accessCode}</code></p>
        <p>Please keep this access code secure. You'll need it to log in.</p>
        <p><a href="${process.env.CLIENT_URL}/facilitator/login" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Login Now</a></p>
      `
    });

    return facilitator;
  }

  async getFacilitators() {
    return prisma.user.findMany({
      where: { role: UserRole.FACILITATOR },
      select: {
        id: true,
        email: true,
        name: true,
        accessCode: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { createdCohorts: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async regenerateAccessCode(facilitatorId: string) {
    const facilitator = await prisma.user.findUnique({
      where: { id: facilitatorId }
    });

    if (!facilitator || facilitator.role !== UserRole.FACILITATOR) {
      throw new AppError('Facilitator not found', 404);
    }

    const newAccessCode = generateAccessCode();

    const updated = await prisma.user.update({
      where: { id: facilitatorId },
      data: { accessCode: newAccessCode },
      select: {
        id: true,
        email: true,
        name: true,
        accessCode: true
      }
    });

    // Send email with new access code
    await sendEmail({
      to: updated.email,
      subject: 'SkillLink - New Access Code Generated',
      html: `
        <h2>New Access Code</h2>
        <p>Hi ${updated.name},</p>
        <p>A new access code has been generated for your account:</p>
        <p><strong>New Access Code:</strong> <code style="font-size: 18px; background: #f3f4f6; padding: 8px 12px; border-radius: 4px;">${newAccessCode}</code></p>
        <p>Your previous access code is no longer valid.</p>
      `
    });

    return updated;
  }

  async inviteStudents(cohortId: string, emails: string[]) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId }
    });

    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }

    const inviteLink = `${process.env.CLIENT_URL}/student/register/${cohort.studentInviteLink}`;

    const results = await Promise.allSettled(
      emails.map(async (email) => {
        await sendEmail({
          to: email,
          subject: `You're invited to join ${cohort.name}`,
          html: `
            <h2>Join ${cohort.name}</h2>
            <p>You've been invited to join a cohort on SkillLink!</p>
            <p><strong>Cohort:</strong> ${cohort.name}</p>
            <p><strong>Description:</strong> ${cohort.description}</p>
            <p><strong>Start Date:</strong> ${new Date(cohort.startDate).toLocaleDateString()}</p>
            <p><a href="${inviteLink}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; margin-top: 10px;">Accept Invitation</a></p>
            <p>Or copy this link: ${inviteLink}</p>
          `
        });
        return { email, status: 'sent' };
      })
    );

    return {
      cohortId,
      inviteLink,
      results: results.map((result, index) => ({
        email: emails[index],
        status: result.status === 'fulfilled' ? 'sent' : 'failed'
      }))
    };
  }

  async regenerateInviteLinks(cohortId: string) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId }
    });

    if (!cohort) {
      throw new AppError('Cohort not found', 404);
    }

    const updated = await prisma.cohort.update({
      where: { id: cohortId },
      data: {
        studentInviteLink: generateInviteToken(),
        facilitatorInviteLink: generateInviteToken()
      }
    });

    return {
      studentInviteLink: `${process.env.CLIENT_URL}/student/register/${updated.studentInviteLink}`,
      facilitatorInviteLink: `${process.env.CLIENT_URL}/facilitator/register/${updated.facilitatorInviteLink}`
    };
  }

  async getStudents() {
    return prisma.user.findMany({
      where: { role: UserRole.STUDENT },
      select: {
        id: true,
        email: true,
        name: true,
        isActive: true,
        createdAt: true,
        cohortMemberships: {
          include: {
            cohort: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async toggleUserStatus(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true
      }
    });
  }
}
