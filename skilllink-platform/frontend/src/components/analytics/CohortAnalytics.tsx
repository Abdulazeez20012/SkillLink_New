import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, FileText, AlertTriangle } from 'lucide-react';
import { analyticsService } from '../../services/analytics.service';
import toast from 'react-hot-toast';
import GradeDistributionChart from './GradeDistributionChart';
import AssignmentCompletionChart from './AssignmentCompletionChart';
import EngagementMetrics from './EngagementMetrics';

interface AnalyticsData {
  cohort: {
    id: string;
    name: string;
    members: any[];
    forumPosts?: any[];
    assignments?: any[];
  };
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
    if (cohortId) {
      loadAnalytics();
    }
  }, [cohortId]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.getCohortAnalytics(cohortId!);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (type: 'csv' | 'pdf') => {
    try {
      toast.loading(`Generating ${type.toUpperCase()} report...`);
      const blob = await analyticsService.exportData(type, cohortId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cohort-analytics-${cohortId}.${type}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.dismiss();
      toast.success(`${type.toUpperCase()} report downloaded successfully!`);
    } catch (error) {
      toast.dismiss();
      toast.error(`Failed to export ${type.toUpperCase()} report`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
        <FileText size={48} className="text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Export Buttons */}
      <div className="flex items-center justify-end gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExport('csv')}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
        >
          <Download size={18} />
          Export CSV
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleExport('pdf')}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium"
        >
          <FileText size={18} />
          Export PDF
        </motion.button>
      </div>
      {/* Engagement Metrics */}
      <EngagementMetrics 
        attendanceStats={analytics.attendanceStats}
        cohort={analytics.cohort}
      />

      {/* Grade Distribution */}
      <GradeDistributionChart distribution={analytics.gradeDistribution} />

      {/* Assignment Completion */}
      <AssignmentCompletionChart stats={analytics.submissionStats} />

      {/* At-Risk Students */}
      {analytics.atRiskStudents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border-l-4 border-red-500 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-xl">
              <AlertTriangle className="text-red-600" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">At-Risk Students</h3>
              <p className="text-sm text-gray-500">{analytics.atRiskStudents.length} students need attention</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            These students may need additional support based on their performance metrics.
          </p>
          
          <div className="space-y-3">
            {analytics.atRiskStudents.map((student, index) => (
              <motion.div
                key={student.studentId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-red-50 p-4 rounded-xl"
              >
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Avg Grade:</span>
                    <span className="ml-2 font-semibold text-red-700">
                      {student.avgGrade.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Submission Rate:</span>
                    <span className="ml-2 font-semibold text-red-700">
                      {student.submissionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Attendance:</span>
                    <span className="ml-2 font-semibold text-red-700">
                      {student.attendanceCount} days
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
