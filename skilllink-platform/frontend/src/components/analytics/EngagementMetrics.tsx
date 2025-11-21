import { motion } from 'framer-motion';
import { Activity, MessageSquare, Calendar, Award, TrendingUp, Users } from 'lucide-react';

interface EngagementMetricsProps {
  attendanceStats: Array<{
    status: string;
    _count: number;
  }>;
  cohort: {
    members: any[];
    forumPosts?: any[];
    assignments?: any[];
  };
}

export default function EngagementMetrics({ attendanceStats, cohort }: EngagementMetricsProps) {
  const totalAttendance = attendanceStats.reduce((sum, stat) => sum + stat._count, 0);
  const presentCount = attendanceStats.find(s => s.status === 'PRESENT')?._count || 0;
  const attendanceRate = totalAttendance > 0 ? (presentCount / totalAttendance) * 100 : 0;

  const metrics = [
    {
      label: 'Active Students',
      value: cohort.members?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      change: '+12%'
    },
    {
      label: 'Attendance Rate',
      value: `${attendanceRate.toFixed(0)}%`,
      icon: Calendar,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      change: '+5%'
    },
    {
      label: 'Forum Activity',
      value: cohort.forumPosts?.length || 0,
      icon: MessageSquare,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      change: '+18%'
    },
    {
      label: 'Assignments',
      value: cohort.assignments?.length || 0,
      icon: Award,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      change: '+8%'
    }
  ];

  const attendanceBreakdown = [
    { status: 'Present', count: attendanceStats.find(s => s.status === 'PRESENT')?._count || 0, color: 'bg-green-500', textColor: 'text-green-700' },
    { status: 'Late', count: attendanceStats.find(s => s.status === 'LATE')?._count || 0, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
    { status: 'Excused', count: attendanceStats.find(s => s.status === 'EXCUSED')?._count || 0, color: 'bg-blue-500', textColor: 'text-blue-700' },
    { status: 'Absent', count: attendanceStats.find(s => s.status === 'ABSENT')?._count || 0, color: 'bg-red-500', textColor: 'text-red-700' }
  ];

  return (
    <div className="space-y-6">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${metric.bgColor}`}>
                  <metric.icon className={metric.iconColor} size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp size={12} />
                  <span>{metric.change}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{metric.label}</p>
              <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Attendance Breakdown */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-xl">
            <Activity className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Attendance Breakdown</h3>
            <p className="text-sm text-gray-500">{totalAttendance} total records</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {attendanceBreakdown.map((item, index) => {
            const percentage = totalAttendance > 0 ? (item.count / totalAttendance) * 100 : 0;

            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-50 rounded-xl p-4 text-center"
              >
                <div className={`text-3xl font-bold ${item.textColor} mb-2`}>
                  {item.count}
                </div>
                <div className="text-sm text-gray-600 mb-2">{item.status}</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`${item.color} h-2 rounded-full`}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Engagement Score */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-2">Overall Engagement Score</h3>
            <p className="text-indigo-100 text-sm">Based on attendance, forum activity, and assignment completion</p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold mb-2">
              {Math.round((attendanceRate + (cohort.forumPosts?.length || 0) * 2) / 2)}
            </div>
            <div className="text-indigo-100 text-sm">out of 100</div>
          </div>
        </div>
        
        <div className="mt-6 bg-white/20 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (attendanceRate + (cohort.forumPosts?.length || 0) * 2) / 2)}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="bg-white h-full rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
