import prisma from '../config/database';

export class AssignmentAnalyticsService {
  async getAssignmentAnalytics(assignmentId: string) {
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        cohort: {
          select: {
            id: true,
            name: true,
            members: {
              where: { role: 'STUDENT' },
              select: { userId: true }
            }
          }
        },
        submissions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!assignment) {
      throw new Error('Assignment not found');
    }

    const totalStudents = assignment.cohort.members.length;
    const submissions = assignment.submissions;

    // Get unique submissions (latest per student)
    const latestSubmissions = new Map();
    submissions.forEach(sub => {
      if (!latestSubmissions.has(sub.userId)) {
        latestSubmissions.set(sub.userId, sub);
      }
    });

    const uniqueSubmissions = Array.from(latestSubmissions.values());
    const submittedCount = uniqueSubmissions.length;
    const gradedCount = uniqueSubmissions.filter(s => s.grade !== null).length;
    const pendingCount = submittedCount - gradedCount;
    const notSubmittedCount = totalStudents - submittedCount;

    // Calculate grade statistics
    const gradedSubmissions = uniqueSubmissions.filter(s => s.grade !== null);
    const grades = gradedSubmissions.map(s => s.grade!);

    const averageGrade = grades.length > 0
      ? grades.reduce((sum, grade) => sum + grade, 0) / grades.length
      : 0;

    const highestGrade = grades.length > 0 ? Math.max(...grades) : 0;
    const lowestGrade = grades.length > 0 ? Math.min(...grades) : 0;

    // Grade distribution
    const gradeRanges = {
      '90-100': 0,
      '80-89': 0,
      '70-79': 0,
      '60-69': 0,
      '0-59': 0
    };

    gradedSubmissions.forEach(sub => {
      const percentage = (sub.grade! / assignment.maxScore) * 100;
      if (percentage >= 90) gradeRanges['90-100']++;
      else if (percentage >= 80) gradeRanges['80-89']++;
      else if (percentage >= 70) gradeRanges['70-79']++;
      else if (percentage >= 60) gradeRanges['60-69']++;
      else gradeRanges['0-59']++;
    });

    // Submission timeline
    const submissionsByDate = submissions.reduce((acc: any, sub) => {
      const date = new Date(sub.submittedAt).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    // Late submissions
    const lateSubmissions = uniqueSubmissions.filter(sub => 
      new Date(sub.submittedAt) > new Date(assignment.dueDate)
    ).length;

    // Students who haven't submitted
    const submittedUserIds = new Set(uniqueSubmissions.map(s => s.userId));
    const notSubmittedStudents = assignment.cohort.members
      .filter(m => !submittedUserIds.has(m.userId))
      .map(m => m.userId);

    const notSubmittedDetails = await prisma.user.findMany({
      where: { id: { in: notSubmittedStudents } },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true
      }
    });

    return {
      assignment: {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.dueDate,
        maxScore: assignment.maxScore,
        status: assignment.status
      },
      statistics: {
        totalStudents,
        submittedCount,
        gradedCount,
        pendingCount,
        notSubmittedCount,
        submissionRate: totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0,
        lateSubmissions,
        lateSubmissionRate: submittedCount > 0 ? (lateSubmissions / submittedCount) * 100 : 0
      },
      gradeStatistics: {
        averageGrade: Math.round(averageGrade * 10) / 10,
        averagePercentage: Math.round((averageGrade / assignment.maxScore) * 1000) / 10,
        highestGrade,
        lowestGrade,
        gradeDistribution: gradeRanges
      },
      submissionTimeline: Object.entries(submissionsByDate).map(([date, count]) => ({
        date,
        count
      })),
      submissions: uniqueSubmissions.map(sub => ({
        id: sub.id,
        student: sub.user,
        submittedAt: sub.submittedAt,
        grade: sub.grade,
        feedback: sub.feedback,
        isLate: new Date(sub.submittedAt) > new Date(assignment.dueDate),
        status: sub.grade !== null ? 'graded' : 'pending'
      })),
      notSubmittedStudents: notSubmittedDetails
    };
  }

  async getCohortAssignmentAnalytics(cohortId: string) {
    const assignments = await prisma.assignment.findMany({
      where: { cohortId, status: 'PUBLISHED' },
      include: {
        submissions: {
          select: {
            userId: true,
            grade: true,
            submittedAt: true
          }
        }
      },
      orderBy: { dueDate: 'desc' }
    });

    const cohortMembers = await prisma.cohortUser.count({
      where: { cohortId, role: 'STUDENT' }
    });

    const analyticsData = assignments.map(assignment => {
      const uniqueSubmissions = new Map();
      assignment.submissions.forEach(sub => {
        if (!uniqueSubmissions.has(sub.userId)) {
          uniqueSubmissions.set(sub.userId, sub);
        }
      });

      const submissions = Array.from(uniqueSubmissions.values());
      const submittedCount = submissions.length;
      const gradedCount = submissions.filter(s => s.grade !== null).length;
      const grades = submissions.filter(s => s.grade !== null).map(s => s.grade!);
      const averageGrade = grades.length > 0
        ? grades.reduce((sum, g) => sum + g, 0) / grades.length
        : 0;

      return {
        id: assignment.id,
        title: assignment.title,
        dueDate: assignment.dueDate,
        maxScore: assignment.maxScore,
        totalStudents: cohortMembers,
        submittedCount,
        gradedCount,
        submissionRate: cohortMembers > 0 ? (submittedCount / cohortMembers) * 100 : 0,
        averageGrade: Math.round(averageGrade * 10) / 10,
        averagePercentage: Math.round((averageGrade / assignment.maxScore) * 1000) / 10
      };
    });

    return analyticsData;
  }
}
