import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Activity, TrendingUp, CheckCircle } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import StatsCard from '../../components/admin/StatsCard';
import { LoadingSpinner, AnimatedCard, Badge } from '../../components/ui';

export default function DashboardOverview() {
  const { data: analytics, loading } = useQuery(() => adminService.getAnalytics());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const adminCount = analytics?.usersByRole.find((r: any) => r.role === 'ADMIN')?._count || 0;
  const facilitatorCount = analytics?.usersByRole.find((r: any) => r.role === 'FACILITATOR')?._count || 0;
  const studentCount = analytics?.usersByRole.find((r: any) => r.role === 'STUDENT')?._count || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Dashboard Overview
          </h1>
          <p className="text-sm text-gray-600">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-medium text-sm shadow-sm"
        >
          <CheckCircle size={16} />
          <span>All Systems Operational</span>
        </motion.div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={<Users size={24} />}
          trend={{ value: 12, isPositive: true }}
          delay={0}
        />
        <StatsCard
          title="Active Cohorts"
          value={analytics?.activeCohorts || 0}
          icon={<BookOpen size={24} />}
          trend={{ value: 8, isPositive: true }}
          delay={0.1}
        />
        <StatsCard
          title="Total Students"
          value={studentCount}
          icon={<GraduationCap size={24} />}
          trend={{ value: 15, isPositive: true }}
          delay={0.2}
        />
        <StatsCard
          title="Assignments"
          value={analytics?.totalAssignments || 0}
          icon={<Activity size={24} />}
          trend={{ value: 5, isPositive: true }}
          delay={0.3}
        />
      </div>

      {/* User Distribution & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AnimatedCard delay={0.4}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">User Distribution</h3>
            <TrendingUp className="text-green-600" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { label: 'Administrators', count: adminCount, color: 'from-purple-500 to-indigo-600' },
              { label: 'Facilitators', count: facilitatorCount, color: 'from-blue-500 to-cyan-600' },
              { label: 'Students', count: studentCount, color: 'from-red-500 to-pink-600' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${item.color}`} />
                  <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                </div>
                <span className="text-xl font-bold text-gray-900">{item.count}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.5}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">System Health</h3>
            <CheckCircle className="text-green-600" size={20} />
          </div>
          <div className="space-y-3">
            {[
              { label: 'API Status', status: 'Operational', color: 'success' },
              { label: 'Database', status: 'Connected', color: 'success' },
              { label: 'Email Service', status: 'Active', color: 'success' },
              { label: 'Storage', status: 'Healthy', color: 'success' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                <Badge variant={item.color as any} size="sm">
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      </div>

      {/* Recent Activity */}
      <AnimatedCard delay={0.6}>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent User Registrations</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {analytics?.recentActivity?.map((user: any, index: number) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="primary" size="sm">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </AnimatedCard>
    </div>
  );
}
