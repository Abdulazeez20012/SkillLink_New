import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

interface GradeDistributionChartProps {
  distribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    F: number;
  };
}

export default function GradeDistributionChart({ distribution }: GradeDistributionChartProps) {
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
  
  const grades = [
    { grade: 'A', count: distribution.A, color: 'bg-green-500', textColor: 'text-green-700', bgColor: 'bg-green-50' },
    { grade: 'B', count: distribution.B, color: 'bg-blue-500', textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    { grade: 'C', count: distribution.C, color: 'bg-yellow-500', textColor: 'text-yellow-700', bgColor: 'bg-yellow-50' },
    { grade: 'D', count: distribution.D, color: 'bg-orange-500', textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
    { grade: 'F', count: distribution.F, color: 'bg-red-500', textColor: 'text-red-700', bgColor: 'bg-red-50' }
  ];

  const maxCount = Math.max(...Object.values(distribution));

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-100 rounded-xl">
          <BarChart3 className="text-indigo-600" size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Grade Distribution</h3>
          <p className="text-sm text-gray-500">{total} total grades</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="space-y-4 mb-6">
        {grades.map((item, index) => {
          const percentage = total > 0 ? (item.count / total) * 100 : 0;
          const barHeight = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

          return (
            <motion.div
              key={item.grade}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 text-center">
                  <span className="text-lg font-bold text-gray-900">{item.grade}</span>
                </div>
                <div className="flex-1">
                  <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barHeight}%` }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className={`absolute inset-y-0 left-0 ${item.color} flex items-center justify-end pr-3`}
                    >
                      {item.count > 0 && (
                        <span className="text-white font-semibold text-sm">
                          {item.count}
                        </span>
                      )}
                    </motion.div>
                  </div>
                </div>
                <div className="w-20 text-right">
                  <span className={`text-sm font-semibold ${item.textColor}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-5 gap-2">
        {grades.map((item) => (
          <div key={item.grade} className={`${item.bgColor} rounded-lg p-3 text-center`}>
            <div className={`text-2xl font-bold ${item.textColor}`}>{item.count}</div>
            <div className="text-xs text-gray-600">Grade {item.grade}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
