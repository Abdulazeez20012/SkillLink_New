import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface AssignmentCompletionChartProps {
  stats: Array<{
    assignmentId: string;
    title: string;
    totalStudents: number;
    submissions: number;
    rate: number;
  }>;
}

export default function AssignmentCompletionChart({ stats }: AssignmentCompletionChartProps) {
  const avgCompletionRate = stats.length > 0
    ? stats.reduce((sum, s) => sum + s.rate, 0) / stats.length
    : 0;

  const getStatusColor = (rate: number) => {
    if (rate >= 80) return { bg: 'bg-green-500', text: 'text-green-700', icon: CheckCircle };
    if (rate >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-700', icon: Clock };
    return { bg: 'bg-red-500', text: 'text-red-700', icon: AlertCircle };
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Assignment Completion Rates</h3>
          <p className="text-sm text-gray-500">{stats.length} assignments</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-600">{avgCompletionRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">Average Rate</div>
        </div>
      </div>

      <div className="space-y-4">
        {stats.map((stat, index) => {
          const status = getStatusColor(stat.rate);
          const StatusIcon = status.icon;

          return (
            <motion.div
              key={stat.assignmentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-50 rounded-xl p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{stat.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <StatusIcon size={14} className={status.text} />
                    <span>
                      {stat.submissions} of {stat.totalStudents} students submitted
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${status.text}`}>
                    {stat.rate.toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.rate}%` }}
                  transition={{ duration: 0.8, delay: index * 0.05 }}
                  className={`absolute inset-y-0 left-0 ${status.bg} rounded-full`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-gray-600">Excellent (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="text-gray-600">Good (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-gray-600">Needs Attention (&lt;60%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
