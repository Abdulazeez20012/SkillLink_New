import prisma from '../config/database';
import { BadgeType } from '@prisma/client';

// Point values for different activities
const POINTS = {
  ASSIGNMENT_SUBMIT: 10,
  ASSIGNMENT_PERFECT: 50,
  ASSIGNMENT_GRADE_A: 30,
  ASSIGNMENT_GRADE_B: 20,
  FORUM_POST: 5,
  FORUM_ANSWER: 10,
  FORUM_ENDORSED_ANSWER: 15,
  FORUM_SOLVED: 20,
  ATTENDANCE_PRESENT: 5,
  ATTENDANCE_STREAK_BONUS: 10,
  EARLY_SUBMISSION: 15
};

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

    // Update streak
    await this.updateStreak(userId);

    // Check for badge eligibility
    await this.checkBadgeEligibility(userId);

    return userPoints;
  }

  // Trigger points for assignment submission
  async handleAssignmentSubmission(userId: string, assignmentId: string, grade?: number, maxScore?: number) {
    let totalPoints = POINTS.ASSIGNMENT_SUBMIT;

    // Award points based on grade
    if (grade !== undefined && maxScore !== undefined) {
      const percentage = (grade / maxScore) * 100;
      
      if (percentage === 100) {
        totalPoints += POINTS.ASSIGNMENT_PERFECT;
      } else if (percentage >= 90) {
        totalPoints += POINTS.ASSIGNMENT_GRADE_A;
      } else if (percentage >= 80) {
        totalPoints += POINTS.ASSIGNMENT_GRADE_B;
      }
    }

    // Check for early submission
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      select: { dueDate: true }
    });

    if (assignment) {
      const submission = await prisma.submission.findFirst({
        where: { userId, assignmentId },
        select: { submittedAt: true }
      });

      if (submission && new Date(submission.submittedAt) < new Date(assignment.dueDate)) {
        const hoursEarly = (new Date(assignment.dueDate).getTime() - new Date(submission.submittedAt).getTime()) / (1000 * 60 * 60);
        if (hoursEarly >= 24) {
          totalPoints += POINTS.EARLY_SUBMISSION;
        }
      }
    }

    return this.awardPoints(userId, totalPoints, 'assignment');
  }

  // Trigger points for forum activity
  async handleForumPost(userId: string) {
    return this.awardPoints(userId, POINTS.FORUM_POST, 'forum');
  }

  async handleForumAnswer(userId: string) {
    return this.awardPoints(userId, POINTS.FORUM_ANSWER, 'forum');
  }

  async handleForumEndorsement(userId: string) {
    return this.awardPoints(userId, POINTS.FORUM_ENDORSED_ANSWER, 'forum');
  }

  async handleForumSolved(userId: string) {
    return this.awardPoints(userId, POINTS.FORUM_SOLVED, 'forum');
  }

  // Trigger points for attendance
  async handleAttendance(userId: string, status: string) {
    if (status === 'PRESENT') {
      let points = POINTS.ATTENDANCE_PRESENT;

      // Check for streak bonus
      const streak = await prisma.streak.findUnique({ where: { userId } });
      if (streak && streak.currentStreak > 0 && streak.currentStreak % 5 === 0) {
        points += POINTS.ATTENDANCE_STREAK_BONUS;
      }

      return this.awardPoints(userId, points, 'attendance');
    }
    return null;
  }

  // Check and award badges
  async checkBadgeEligibility(userId: string) {
    const [
      submissions,
      forumAnswers,
      forumPosts,
      attendance,
      userPoints,
      streak,
      endorsedAnswers
    ] = await Promise.all([
      prisma.submission.findMany({ where: { userId }, include: { assignment: true } }),
      prisma.forumAnswer.count({ where: { userId } }),
      prisma.forumPost.count({ where: { userId } }),
      prisma.attendance.findMany({ 
        where: { userId, status: 'PRESENT' }, 
        orderBy: { date: 'desc' } 
      }),
      prisma.userPoints.findUnique({ where: { userId } }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.forumAnswer.count({ where: { userId, endorsements: { gte: 5 } } })
    ]);

    const badgesToAward: BadgeType[] = [];

    // First Assignment
    if (submissions.length === 1) {
      badgesToAward.push(BadgeType.FIRST_ASSIGNMENT);
    }

    // Perfect Score - at least one assignment with 100%
    const perfectScores = submissions.filter(s => 
      s.grade && s.assignment && s.grade >= s.assignment.maxScore
    );
    if (perfectScores.length > 0) {
      badgesToAward.push(BadgeType.PERFECT_SCORE);
    }

    // Top Performer - 90%+ average on all graded assignments
    const gradedSubmissions = submissions.filter(s => s.grade !== null && s.assignment);
    if (gradedSubmissions.length >= 5) {
      const avgPercentage = gradedSubmissions.reduce((sum, s) => {
        const percentage = (s.grade! / s.assignment!.maxScore) * 100;
        return sum + percentage;
      }, 0) / gradedSubmissions.length;

      if (avgPercentage >= 90) {
        badgesToAward.push(BadgeType.TOP_PERFORMER);
      }
    }

    // Early Bird - submitted 3+ assignments early
    const earlySubmissions = submissions.filter(s => {
      if (!s.assignment) return false;
      return new Date(s.submittedAt) < new Date(s.assignment.dueDate);
    });
    if (earlySubmissions.length >= 3) {
      badgesToAward.push(BadgeType.EARLY_BIRD);
    }

    // Helpful Contributor - 10+ forum answers
    if (forumAnswers >= 10) {
      badgesToAward.push(BadgeType.HELPFUL_CONTRIBUTOR);
    }

    // Forum Expert - 50+ forum answers or 10+ highly endorsed answers
    if (forumAnswers >= 50 || endorsedAnswers >= 10) {
      badgesToAward.push(BadgeType.FORUM_EXPERT);
    }

    // Attendance Streaks
    const currentStreak = streak?.currentStreak || 0;
    if (currentStreak >= 5) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_5);
    if (currentStreak >= 10) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_10);
    if (currentStreak >= 20) badgesToAward.push(BadgeType.ATTENDANCE_STREAK_20);

    // Award new badges
    for (const badgeType of badgesToAward) {
      await this.awardBadge(userId, badgeType);
    }

    return badgesToAward;
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

  async getLeaderboard(cohortId?: string, timeframe: 'weekly' | 'monthly' | 'alltime' = 'alltime') {
    let userIds: string[] | undefined;

    // Filter by cohort if provided
    if (cohortId) {
      const cohortMembers = await prisma.cohortUser.findMany({
        where: { cohortId, role: 'STUDENT' },
        select: { userId: true }
      });
      userIds = cohortMembers.map(m => m.userId);
    }

    // Calculate date range for timeframe
    let dateFilter: Date | undefined;
    const now = new Date();
    
    if (timeframe === 'weekly') {
      dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeframe === 'monthly') {
      dateFilter = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // For timeframe filtering, we need to calculate points from activities
    if (dateFilter) {
      const activities = await this.getUserActivitiesSince(userIds, dateFilter);
      return activities;
    }

    // All-time leaderboard
    const leaderboard = await prisma.userPoints.findMany({
      where: userIds ? { userId: { in: userIds } } : undefined,
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

    // Add rank to each entry
    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  private async getUserActivitiesSince(userIds: string[] | undefined, since: Date) {
    // Calculate points from activities since the date
    const [submissions, forumPosts, forumAnswers, attendance] = await Promise.all([
      prisma.submission.findMany({
        where: {
          userId: userIds ? { in: userIds } : undefined,
          submittedAt: { gte: since }
        },
        select: { userId: true, grade: true }
      }),
      prisma.forumPost.findMany({
        where: {
          userId: userIds ? { in: userIds } : undefined,
          createdAt: { gte: since }
        },
        select: { userId: true }
      }),
      prisma.forumAnswer.findMany({
        where: {
          userId: userIds ? { in: userIds } : undefined,
          createdAt: { gte: since }
        },
        select: { userId: true, endorsements: true }
      }),
      prisma.attendance.findMany({
        where: {
          userId: userIds ? { in: userIds } : undefined,
          date: { gte: since },
          status: 'PRESENT'
        },
        select: { userId: true }
      })
    ]);

    // Calculate points per user
    const userPointsMap = new Map<string, number>();

    submissions.forEach(s => {
      const current = userPointsMap.get(s.userId) || 0;
      userPointsMap.set(s.userId, current + POINTS.ASSIGNMENT_SUBMIT + (s.grade || 0));
    });

    forumPosts.forEach(p => {
      const current = userPointsMap.get(p.userId) || 0;
      userPointsMap.set(p.userId, current + POINTS.FORUM_POST);
    });

    forumAnswers.forEach(a => {
      const current = userPointsMap.get(a.userId) || 0;
      const points = POINTS.FORUM_ANSWER + (a.endorsements * 2);
      userPointsMap.set(a.userId, current + points);
    });

    attendance.forEach(a => {
      const current = userPointsMap.get(a.userId) || 0;
      userPointsMap.set(a.userId, current + POINTS.ATTENDANCE_PRESENT);
    });

    // Get user details and create leaderboard
    const allUserIds = Array.from(userPointsMap.keys());
    const users = await prisma.user.findMany({
      where: { id: { in: allUserIds } },
      select: { id: true, name: true, avatar: true }
    });

    const leaderboard = users.map(user => ({
      userId: user.id,
      totalPoints: userPointsMap.get(user.id) || 0,
      user
    }));

    // Sort by points and add rank
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
    
    return leaderboard.slice(0, 50).map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
  }

  async getUserStats(userId: string) {
    const [
      points,
      badges,
      streak,
      submissions,
      forumActivity,
      attendance,
      cohorts
    ] = await Promise.all([
      prisma.userPoints.findUnique({ where: { userId } }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: 'desc' }
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.submission.count({ where: { userId } }),
      Promise.all([
        prisma.forumPost.count({ where: { userId } }),
        prisma.forumAnswer.count({ where: { userId } })
      ]),
      prisma.attendance.count({ where: { userId, status: 'PRESENT' } }),
      prisma.cohortUser.findMany({
        where: { userId },
        include: { cohort: true }
      })
    ]);

    // Calculate rank
    const allPoints = await prisma.userPoints.findMany({
      orderBy: { totalPoints: 'desc' },
      select: { userId: true, totalPoints: true }
    });
    const rank = allPoints.findIndex(p => p.userId === userId) + 1;

    // Calculate attendance rate
    const totalAttendance = await prisma.attendance.count({ where: { userId } });
    const attendanceRate = totalAttendance > 0 
      ? Math.round((attendance / totalAttendance) * 100) 
      : 0;

    // Get achievements (milestones)
    const achievements = this.calculateAchievements({
      submissions,
      forumPosts: forumActivity[0],
      forumAnswers: forumActivity[1],
      attendance,
      badges: badges.length,
      points: points?.totalPoints || 0,
      streak: streak?.currentStreak || 0
    });

    return {
      totalPoints: points?.totalPoints || 0,
      pointsFromAssignments: points?.assignmentPoints || 0,
      pointsFromForum: points?.forumPoints || 0,
      pointsFromAttendance: points?.attendancePoints || 0,
      badges: badges.map(b => b.badge),
      currentStreak: streak?.currentStreak || 0,
      longestStreak: streak?.longestStreak || 0,
      lastActivityDate: streak?.lastActivityDate,
      rank,
      totalAssignments: submissions,
      completedAssignments: submissions,
      attendanceRate,
      achievements,
      cohorts: cohorts.map(c => c.cohort)
    };
  }

  private calculateAchievements(stats: any) {
    const achievements = [];

    // Assignment milestones
    if (stats.submissions >= 1) achievements.push({ name: 'First Steps', description: 'Submitted first assignment', icon: '🎯' });
    if (stats.submissions >= 10) achievements.push({ name: 'Dedicated Learner', description: 'Submitted 10 assignments', icon: '📚' });
    if (stats.submissions >= 25) achievements.push({ name: 'Assignment Master', description: 'Submitted 25 assignments', icon: '🏆' });

    // Forum milestones
    if (stats.forumPosts >= 1) achievements.push({ name: 'Conversation Starter', description: 'Created first forum post', icon: '💬' });
    if (stats.forumAnswers >= 5) achievements.push({ name: 'Helper', description: 'Answered 5 questions', icon: '🤝' });
    if (stats.forumAnswers >= 25) achievements.push({ name: 'Community Champion', description: 'Answered 25 questions', icon: '⭐' });

    // Attendance milestones
    if (stats.attendance >= 10) achievements.push({ name: 'Regular Attendee', description: 'Attended 10 sessions', icon: '📅' });
    if (stats.attendance >= 50) achievements.push({ name: 'Perfect Attendance', description: 'Attended 50 sessions', icon: '✨' });

    // Streak milestones
    if (stats.streak >= 7) achievements.push({ name: 'Week Warrior', description: '7-day streak', icon: '🔥' });
    if (stats.streak >= 30) achievements.push({ name: 'Month Master', description: '30-day streak', icon: '💪' });

    // Points milestones
    if (stats.points >= 100) achievements.push({ name: 'Century Club', description: 'Earned 100 points', icon: '💯' });
    if (stats.points >= 500) achievements.push({ name: 'Point Collector', description: 'Earned 500 points', icon: '💎' });
    if (stats.points >= 1000) achievements.push({ name: 'Elite Performer', description: 'Earned 1000 points', icon: '👑' });

    // Badge milestones
    if (stats.badges >= 3) achievements.push({ name: 'Badge Collector', description: 'Earned 3 badges', icon: '🎖️' });
    if (stats.badges >= 5) achievements.push({ name: 'Badge Master', description: 'Earned 5 badges', icon: '🏅' });

    return achievements;
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
