import { motion } from 'framer-motion';
import { TrendingUp, Award, Target, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface StudentProgressChartProps {
  gradeHistory: Array<{
    date: string;
    grade: number;
    assignment: string;
  }>;
  avgGrade: number;
  completionRate: number;
  totalSubmissions: number;
}

export default function StudentProgressChart({
  gradeHistory,
  avgGrade,
  completionRate,
  totalSubmissions
}: StudentProgressChartProps) {
  const recentGrades = gradeHistory.slice(0, 10).reverse();
  const maxGrade = 100;

  const stats = [
    {
      label: 'Average Grade',
      value: `${avgGrade.toFixed(1)}%`,
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(0)}%`,
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Total Submissions',
      value: totalSubmissions,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={stat.iconColor} size={24} />
              </div>
              <TrendingUp className="text-green-500" size={16} />
            </div>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Grade History Chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-xl">
            <TrendingUp className="text-indigo-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Grade History</h3>
            <p className="text-sm text-gray-500">Last {recentGrades.length} assignments</p>
          </div>
        </div>

        {recentGrades.length > 0 ? (
          <div className="space-y-4">
            {/* Line Chart Visualization */}
            <div className="relative h-64 flex items-end justify-between gap-2 px-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-gray-500">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>

              {/* Bars */}
              <div className="flex-1 flex items-end justify-between gap-2 ml-8">
                {recentGrades.map((item, index) => {
                  const height = (item.grade / maxGrade) * 100;
                  const gradeColor = 
                    item.grade >= 90 ? 'bg-green-500' :
                    item.grade >= 80 ? 'bg-blue-500' :
                    item.grade >= 70 ? 'bg-yellow-500' :
                    item.grade >= 60 ? 'bg-orange-500' : 'bg-red-500';

                  return (
                    <div key={index} className="flex-1 flex flex-col items-center group">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`w-full ${gradeColor} rounded-t-lg relative cursor-pointer hover:opacity-80 transition-opacity`}
                      >
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
                            <div className="font-semibold">{item.assignment}</div>
                            <div className="text-gray-300">{item.grade}%</div>
                            <div className="text-gray-400">{format(new Date(item.date), 'MMM dd')}</div>
                          </div>
                        </div>
                      </motion.div>
                      <div className="mt-2 text-xs text-gray-500 text-center truncate w-full">
                        {format(new Date(item.date), 'MMM dd')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Grades List */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Recent Grades</h4>
              <div className="space-y-2">
                {gradeHistory.slice(0, 5).map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{item.assignment}</p>
                      <p className="text-xs text-gray-500">{format(new Date(item.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div className={`text-lg font-bold ${
                      item.grade >= 90 ? 'text-green-600' :
                      item.grade >= 80 ? 'text-blue-600' :
                      item.grade >= 70 ? 'text-yellow-600' :
                      item.grade >= 60 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {item.grade}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp size={32} className="text-gray-400" />
            </div>
            <p className="text-gray-500">No grade history available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
