import prisma from '../config/database';

export class StudentProgressService {
  async getStudentProgress(studentId: string, cohortId: string) {
    // Get student info
    const student = await prisma.user.findUnique({
      where: { id: studentId },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    // Get assignments and submissions
    const assignments = await prisma.assignment.findMany({
      where: { cohortId, status: 'PUBLISHED' },
      include: {
        submissions: {
          where: { userId: studentId },
          orderBy: { submittedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { dueDate: 'desc' }
    });

    // Get attendance records
    const attendanceRecords = await prisma.attendance.findMany({
      where: { cohortId, userId: studentId },
      orderBy: { date: 'desc' }
    });

    // Get forum activity
    const forumActivity = await prisma.forumPost.count({
      where: { cohortId, userId: studentId }
    });

    const forumAnswers = await prisma.forumAnswer.count({
      where: {
        userId: studentId,
        post: { cohortId }
      }
    });

    // Get gamification data
    const points = await prisma.userPoints.findUnique({
      where: { userId: studentId }
    });

    const badges = await prisma.userBadge.count({
      where: { userId: studentId }
    });

    const streak = await prisma.streak.findUnique({
      where: { userId: studentId }
    });

    // Calculate statistics
    const totalAssignments = assignments.length;
    const submittedAssignments = assignments.filter(a => a.submissions.length > 0).length;
    const gradedAssignments = assignments.filter(a => 
      a.submissions.length > 0 && a.submissions[0].grade !== null
    ).length;

    const grades = assignments
      .filter(a => a.submissions.length > 0 && a.submissions[0].grade !== null)
      .map(a => ({
        grade: a.submissions[0].grade!,
        maxScore: a.maxScore
      }));

    const averageGrade = grades.length > 0
      ? grades.reduce((sum, g) => sum + (g.grade / g.maxScore) * 100, 0) / grades.length
      : 0;

    const totalAttendance = attendanceRecords.length;
    const presentCount = attendanceRecords.filter(a => a.status === 'PRESENT').length;
    const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

    return {
      student,
      statistics: {
        totalAssignments,
        submittedAssignments,
        gradedAssignments,
        submissionRate: totalAssignments > 0 ? (submittedAssignments / totalAssignments) * 100 : 0,
        averageGrade: Math.round(averageGrade * 10) / 10,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        forumPosts: forumActivity,
        forumAnswers,
        totalPoints: points?.totalPoints || 0,
        badgesEarned: badges,
        currentStreak: streak?.currentStreak || 0,
        longestStreak: streak?.longestStreak || 0
      },
      assignments: assignments.map(a => ({
        id: a.id,
        title: a.title,
        dueDate: a.dueDate,
        maxScore: a.maxScore,
        submitted: a.submissions.length > 0,
        submittedAt: a.submissions[0]?.submittedAt,
        grade: a.submissions[0]?.grade,
        feedback: a.submissions[0]?.feedback,
        status: this.getAssignmentStatus(a, a.submissions[0])
      })),
      attendanceRecords: attendanceRecords.slice(0, 10),
      recentActivity: {
        forumPosts: forumActivity,
        forumAnswers
      }
    };
  }

  async getCohortStudentsProgress(cohortId: string) {
    const cohortMembers = await prisma.cohortUser.findMany({
      where: { cohortId, role: 'STUDENT' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    });

    const progressData = await Promise.all(
      cohortMembers.map(async (member) => {
        const progress = await this.getStudentProgress(member.userId, cohortId);
        return {
          student: progress.student,
          statistics: progress.statistics
        };
      })
    );

    return progressData;
  }

  private getAssignmentStatus(assignment: any, submission: any) {
    if (!submission) {
      return new Date() > new Date(assignment.dueDate) ? 'overdue' : 'pending';
    }
    if (submission.grade !== null) {
      return 'graded';
    }
    return 'submitted';
  }
}
