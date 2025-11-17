import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, TrendingUp, AlertTriangle, Users } from 'lucide-react';

interface AnalyticsData {
  submissionStats: Array<{
    assignmentId: string;
    title: string;
    totalStudents: number;
    submissions: number;
    rate: number;
  }>;
  gradeDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
  atRiskStudents: Array<{
    studentId: string;
    avgGrade: number;
    submissionRate: number;
    attendanceCount: number;
    isAtRisk: boolean;
  }>;
  attendanceStats: Array<{
    status: string;
    _count: number;
  }>;
}

export default function CohortAnalytics() {
  const { cohortId } = useParams();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [cohortId]);

  const loadAnalytics = async () => {
    try {
      const response = await api.get(`/analytics/facilitator/${cohortId}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="card">No analytics data available</div>;
  }

  const totalGrades = Object.values(analytics.gradeDistribution).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      {/* Grade Distribution */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart className="text-primary-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Grade Distribution</h3>
        </div>
        
        <div className="space-y-3">
          {Object.entries(analytics.gradeDistribution).map(([grade, count]) => {
            const percentage = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
            const colors: Record<string, string> = {
              A: 'bg-green-500',
              B: 'bg-blue-500',
              C: 'bg-yellow-500',
              D: 'bg-orange-500',
              F: 'bg-red-500'
            };
            
            return (
              <div key={grade}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">Grade {grade}</span>
                  <span className="text-gray-600">{count} students ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${colors[grade]} h-2 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Rates */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-primary-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Assignment Submission Rates</h3>
        </div>
        
        <div className="space-y-3">
          {analytics.submissionStats.map((stat) => (
            <div key={stat.assignmentId}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">{stat.title}</span>
                <span className="text-gray-600">
                  {stat.submissions}/{stat.totalStudents} ({stat.rate.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    stat.rate >= 80 ? 'bg-green-500' :
                    stat.rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${stat.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* At-Risk Students */}
      {analytics.atRiskStudents.length > 0 && (
        <div className="card border-l-4 border-red-500">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="text-red-600" size={24} />
            <h3 className="text-lg font-semibold text-gray-900">At-Risk Students</h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            These students may need additional support based on their performance metrics.
          </p>
          
          <div className="space-y-3">
            {analytics.atRiskStudents.map((student) => (
              <div key={student.studentId} className="bg-red-50 p-3 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Grade:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {student.avgGrade.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Submission Rate:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {student.submissionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {student.attendanceCount} days
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Attendance Overview */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Users className="text-primary-600" size={24} />
          <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {analytics.attendanceStats.map((stat) => (
            <div key={stat.status} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stat._count}</div>
              <div className="text-sm text-gray-600 capitalize">{stat.status.toLowerCase()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
