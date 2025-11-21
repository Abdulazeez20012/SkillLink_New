import prisma from '../config/database';

export class AnalyticsService {
  async getAdminOverview() {
    const [
      totalUsers,
      activeUsers,
      totalCohorts,
      activeCohorts,
      totalAssignments,
      totalSubmissions,
      averageGrade
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.cohort.count(),
      prisma.cohort.count({ where: { isActive: true } }),
      prisma.assignment.count(),
      prisma.submission.count(),
      prisma.submission.aggregate({
        where: { grade: { not: null } },
        _avg: { grade: true }
      })
    ]);

    // Growth metrics (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await prisma.user.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    const newCohorts = await prisma.cohort.count({
      where: { createdAt: { gte: thirtyDaysAgo } }
    });

    // Activity trends
    const activityTrend = await prisma.activityLog.groupBy({
      by: ['action'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true
    });

    return {
      overview: {
        totalUsers,
        activeUsers,
        totalCohorts,
        activeCohorts,
        totalAssignments,
        totalSubmissions,
        averageGrade: averageGrade._avg.grade || 0
      },
      growth: {
        newUsers,
        newCohorts
      },
      activityTrend
    };
  }

  async getFacilitatorAnalytics(cohortId: string) {
    const cohort = await prisma.cohort.findUnique({
      where: { id: cohortId },
      include: {
        members: {
          where: { role: 'STUDENT' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        assignments: {
          include: {
            _count: { select: { submissions: true } }
          }
        }
      }
    });

    if (!cohort) return null;

    const studentIds = cohort.members.map(m => m.userId);

    // Submission rates
    const submissionStats = await Promise.all(
      cohort.assignments.map(async (assignment) => {
        const submissions = await prisma.submission.count({
          where: { assignmentId: assignment.id }
        });
        return {
          assignmentId: assignment.id,
          title: assignment.title,
          totalStudents: studentIds.length,
          submissions,
          rate: studentIds.length > 0 ? (submissions / studentIds.length) * 100 : 0
        };
      })
    );

    // Grade distribution
    const grades = await prisma.submission.findMany({
      where: {
        userId: { in: studentIds },
        grade: { not: null }
      },
      select: { grade: true }
    });

    const gradeDistribution = {
      A: grades.filter(g => g.grade! >= 90).length,
      B: grades.filter(g => g.grade! >= 80 && g.grade! < 90).length,
      C: grades.filter(g => g.grade! >= 70 && g.grade! < 80).length,
      D: grades.filter(g => g.grade! >= 60 && g.grade! < 70).length,
      F: grades.filter(g => g.grade! < 60).length
    };

    // At-risk students (low grades or missing submissions)
    const atRiskStudents = await this.identifyAtRiskStudents(studentIds, cohortId);

    // Attendance stats
    const attendanceStats = await prisma.attendance.groupBy({
      by: ['status'],
      where: { cohortId },
      _count: true
    });

    return {
      cohort,
      submissionStats,
      gradeDistribution,
      atRiskStudents,
      attendanceStats
    };
  }

  private async identifyAtRiskStudents(studentIds: string[], cohortId: string) {
    const students = await Promise.all(
      studentIds.map(async (studentId) => {
        const [avgGrade, submissionCount, attendanceCount] = await Promise.all([
          prisma.submission.aggregate({
            where: { userId: studentId, grade: { not: null } },
            _avg: { grade: true }
          }),
          prisma.submission.count({ where: { userId: studentId } }),
          prisma.attendance.count({
            where: { userId: studentId, cohortId, status: 'PRESENT' }
          })
        ]);

        const totalAssignments = await prisma.assignment.count({
          where: {
            cohort: { members: { some: { userId: studentId } } },
            status: 'PUBLISHED'
          }
        });

        const submissionRate = totalAssignments > 0 ? (submissionCount / totalAssignments) * 100 : 0;
        const isAtRisk = (avgGrade._avg.grade || 0) < 70 || submissionRate < 50;

        return {
          studentId,
          avgGrade: avgGrade._avg.grade || 0,
          submissionRate,
          attendanceCount,
          isAtRisk
        };
      })
    );

    return students.filter(s => s.isAtRisk);
  }

  async getStudentProgress(userId: string) {
    const [submissions, attendance, points, cohorts] = await Promise.all([
      prisma.submission.findMany({
        where: { userId },
        include: {
          assignment: {
            select: {
              id: true,
              title: true,
              maxScore: true,
              dueDate: true
            }
          }
        },
        orderBy: { submittedAt: 'desc' }
      }),
      prisma.attendance.findMany({
        where: { userId },
        orderBy: { date: 'desc' }
      }),
      prisma.userPoints.findUnique({ where: { userId } }),
      prisma.cohortUser.findMany({
        where: { userId, role: 'STUDENT' },
        include: {
          cohort: {
            select: {
              id: true,
              name: true
            }
          }
        }
      })
    ]);

    // Calculate grade history
    const gradeHistory = submissions
      .filter(s => s.grade !== null)
      .map(s => ({
        date: s.submittedAt,
        grade: s.grade,
        assignment: s.assignment.title
      }));

    // Calculate completion rate
    const totalAssignments = await prisma.assignment.count({
      where: {
        cohort: {
          members: { some: { userId } }
        },
        status: 'PUBLISHED'
      }
    });

    const completionRate = totalAssignments > 0 ? (submissions.length / totalAssignments) * 100 : 0;

    // Average grade
    const avgGrade = submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / (submissions.length || 1);

    return {
      gradeHistory,
      completionRate,
      avgGrade,
      totalSubmissions: submissions.length,
      attendanceCount: attendance.filter(a => a.status === 'PRESENT').length,
      points: points?.totalPoints || 0,
      cohorts
    };
  }

  async logActivity(userId: string, action: string, metadata?: any) {
    return prisma.activityLog.create({
      data: {
        userId,
        action,
        metadata
      }
    });
  }

  generateCSV(data: any): string {
    const lines: string[] = [];
    
    // Header
    lines.push('Cohort Analytics Report');
    lines.push(`Cohort: ${data.cohort.name}`);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    
    // Grade Distribution
    lines.push('Grade Distribution');
    lines.push('Grade,Count,Percentage');
    const totalGrades = Object.values(data.gradeDistribution).reduce((a: any, b: any) => a + b, 0) as number;
    Object.entries(data.gradeDistribution).forEach(([grade, count]) => {
      const percentage = totalGrades > 0 ? ((count as number) / totalGrades) * 100 : 0;
      lines.push(`${grade},${count},${percentage.toFixed(2)}%`);
    });
    lines.push('');
    
    // Assignment Submission Rates
    lines.push('Assignment Submission Rates');
    lines.push('Assignment,Total Students,Submissions,Rate');
    data.submissionStats.forEach((stat: any) => {
      lines.push(`"${stat.title}",${stat.totalStudents},${stat.submissions},${stat.rate.toFixed(2)}%`);
    });
    lines.push('');
    
    // Attendance Stats
    lines.push('Attendance Statistics');
    lines.push('Status,Count');
    data.attendanceStats.forEach((stat: any) => {
      lines.push(`${stat.status},${stat._count}`);
    });
    lines.push('');
    
    // At-Risk Students
    if (data.atRiskStudents.length > 0) {
      lines.push('At-Risk Students');
      lines.push('Student ID,Avg Grade,Submission Rate,Attendance Count');
      data.atRiskStudents.forEach((student: any) => {
        lines.push(`${student.studentId},${student.avgGrade.toFixed(2)}%,${student.submissionRate.toFixed(2)}%,${student.attendanceCount}`);
      });
    }
    
    return lines.join('\n');
  }

  generateTextReport(data: any): string {
    const lines: string[] = [];
    
    lines.push('='.repeat(60));
    lines.push('COHORT ANALYTICS REPORT');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Cohort: ${data.cohort.name}`);
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push('');
    
    // Grade Distribution
    lines.push('-'.repeat(60));
    lines.push('GRADE DISTRIBUTION');
    lines.push('-'.repeat(60));
    const totalGrades = Object.values(data.gradeDistribution).reduce((a: any, b: any) => a + b, 0) as number;
    Object.entries(data.gradeDistribution).forEach(([grade, count]) => {
      const percentage = totalGrades > 0 ? ((count as number) / totalGrades) * 100 : 0;
      lines.push(`Grade ${grade}: ${count} students (${percentage.toFixed(1)}%)`);
    });
    lines.push('');
    
    // Assignment Submission Rates
    lines.push('-'.repeat(60));
    lines.push('ASSIGNMENT SUBMISSION RATES');
    lines.push('-'.repeat(60));
    data.submissionStats.forEach((stat: any) => {
      lines.push(`${stat.title}`);
      lines.push(`  Submissions: ${stat.submissions}/${stat.totalStudents} (${stat.rate.toFixed(1)}%)`);
    });
    lines.push('');
    
    // Attendance Stats
    lines.push('-'.repeat(60));
    lines.push('ATTENDANCE STATISTICS');
    lines.push('-'.repeat(60));
    data.attendanceStats.forEach((stat: any) => {
      lines.push(`${stat.status}: ${stat._count}`);
    });
    lines.push('');
    
    // At-Risk Students
    if (data.atRiskStudents.length > 0) {
      lines.push('-'.repeat(60));
      lines.push('AT-RISK STUDENTS');
      lines.push('-'.repeat(60));
      lines.push(`${data.atRiskStudents.length} students need attention`);
      lines.push('');
      data.atRiskStudents.forEach((student: any, index: number) => {
        lines.push(`${index + 1}. Student ID: ${student.studentId}`);
        lines.push(`   Average Grade: ${student.avgGrade.toFixed(1)}%`);
        lines.push(`   Submission Rate: ${student.submissionRate.toFixed(1)}%`);
        lines.push(`   Attendance: ${student.attendanceCount} days`);
        lines.push('');
      });
    }
    
    lines.push('='.repeat(60));
    lines.push('END OF REPORT');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }
}
