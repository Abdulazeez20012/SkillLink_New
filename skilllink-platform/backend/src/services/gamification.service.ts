import prisma from '../config/database';
import { BadgeType } from '@prisma/client';

export class GamificationService {
  // Award points for various activities
  async awardPoints(userId: string, points: number, category: 'assignment' | 'forum' | 'attendance') {
    const userPoints = await prisma.userPoints.upsert({
      where: { userId },
      update: {
        totalPoints: { increment: points },
        [`${category}Points`]: { increment: points }
      },
      create: {
        userId,
        totalPoints: points,
        [`${category}Points`]: points
      }
    });

    // Check for badge eligibility
    await this.checkBadgeEligibility(userId);

    return userPoints;
  }

  // Check and award badges
  async checkBadgeEligibility(userId: string) {
    const [submissions, forumAnswers, attendance, userPoints] = await Promise.all([
      prisma.submission.count({ where: { userId } }),
      prisma.forumAnswer.count({ where: { userId } }),
      prisma.attendance.findMany({ where: { userId, status: 'PRESENT' }, orderBy: { date: 'desc' } }),
      prisma.userPoints.findUnique({ where: { userId } })
    ]);

    const badgesToAward: BadgeType[] = [];

    // First Assignment
    if (submissions === 1) {
      badgesToAward.push(BadgeType.FIRST_ASSIGNMENT);
    }

    // Perfect Score
    const perfectScores = await prisma.submission.count({
      where: { userId, grade: { gte: 100 } }
    });
    if (perfectScores > 0) {
      badgesToAward.push(BadgeType.PERFECT_SCORE);
    }

    // Helpful Contributor
    if (forumAnswers >= 10) {
      badgesToAward.push(BadgeType.HELPFUL_CONTRIBUTOR);
    }

    // Forum Expert
    if (forumAnswers >= 50) {
      badgesToAward.push(BadgeType.FORUM_EXPERT);
    }

    // Attendance Streaks
    const currentStreak = this.calculateAttendanceStreak(attendance);
    if (currentStreak >= 5) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_5);
    if (currentStreak >= 10) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_10);
    if (currentStreak >= 20) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_20);

    // Award new badges
    for (const badgeType of badgesToAward) {
      await this.awardBadge(userId, badgeType);
    }
  }

  private calculateAttendanceStreak(attendance: any[]): number {
    if (attendance.length === 0) return 0;

    let streak = 1;
    for (let i = 0; i < attendance.length - 1; i++) {
      const current = new Date(attendance[i].date);
      const next = new Date(attendance[i + 1].date);
      const diffDays = Math.floor((current.getTime() - next.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  async awardBadge(userId: string, badgeType: BadgeType) {
    const badge = await prisma.badge.findFirst({ where: { type: badgeType } });
    if (!badge) return;

    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } }
    });

    if (!existing) {
      return prisma.userBadge.create({
        data: { userId, badgeId: badge.id },
        include: { badge: true }
      });
    }
  }

  async getLeaderboard(cohortId: string, timeframe: 'weekly' | 'monthly' | 'alltime' = 'alltime') {
    const cohortMembers = await prisma.cohortUser.findMany({
      where: { cohortId, role: 'STUDENT' },
      select: { userId: true }
    });

    const userIds = cohortMembers.map(m => m.userId);

    const leaderboard = await prisma.userPoints.findMany({
      where: { userId: { in: userIds } },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { totalPoints: 'desc' },
      take: 50
    });

    return leaderboard;
  }

  async getUserStats(userId: string) {
    const [points, badges, streak] = await Promise.all([
      prisma.userPoints.findUnique({ where: { userId } }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' }
      }),
      prisma.streak.findUnique({ where: { userId } })
    ]);

    return { points, badges, streak };
  }

  async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const streak = await prisma.streak.findUnique({ where: { userId } });

    if (!streak) {
      return prisma.streak.create({
        data: {
          userId,
          currentStreak: 1,
          longestStreak: 1,
          lastActivityDate: today
        }
      });
    }

    const lastActivity = streak.lastActivityDate ? new Date(streak.lastActivityDate) : null;
    if (!lastActivity) {
      return prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          longestStreak: Math.max(1, streak.longestStreak),
          lastActivityDate: today
        }
      });
    }

    lastActivity.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return streak; // Already updated today
    } else if (diffDays === 1) {
      // Continue streak
      const newStreak = streak.currentStreak + 1;
      return prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastActivityDate: today
        }
      });
    } else {
      // Streak broken
      return prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          lastActivityDate: today
        }
      });
    }
  }
}
