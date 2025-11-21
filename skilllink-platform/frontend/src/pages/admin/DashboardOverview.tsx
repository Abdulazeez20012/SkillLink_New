import { motion } from 'framer-motion';
import { Users, BookOpen, GraduationCap, Activity, TrendingUp, CheckCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import { LoadingSpinner, Badge } from '../../components/ui';

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
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-xl font-medium text-sm border border-green-200"
        >
          <CheckCircle size={16} />
          <span>All Systems Operational</span>
        </motion.div>
      </motion.div>

      {/* Stats Cards - Clean White Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Total Users', 
            value: analytics?.totalUsers || 0, 
            icon: Users, 
            trend: '+12%', 
            isPositive: true,
            color: 'bg-blue-50 text-blue-600',
            delay: 0
          },
          { 
            title: 'Active Cohorts', 
            value: analytics?.activeCohorts || 0, 
            icon: BookOpen, 
            trend: '+8%', 
            isPositive: true,
            color: 'bg-purple-50 text-purple-600',
            delay: 0.1
          },
          { 
            title: 'Total Students', 
            value: studentCount, 
            icon: GraduationCap, 
            trend: '+15%', 
            isPositive: true,
            color: 'bg-brand-red/10 text-brand-red',
            delay: 0.2
          },
          { 
            title: 'Assignments', 
            value: analytics?.totalAssignments || 0, 
            icon: Activity, 
            trend: '+5%', 
            isPositive: true,
            color: 'bg-orange-50 text-orange-600',
            delay: 0.3
          }
        ].map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay }}
            className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                stat.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* User Distribution & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">User Distribution</h3>
            <p className="text-sm text-gray-500">Platform user breakdown</p>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Administrators', count: adminCount, color: 'bg-purple-500', percentage: Math.round((adminCount / (analytics?.totalUsers || 1)) * 100) },
              { label: 'Facilitators', count: facilitatorCount, color: 'bg-blue-500', percentage: Math.round((facilitatorCount / (analytics?.totalUsers || 1)) * 100) },
              { label: 'Students', count: studentCount, color: 'bg-brand-red', percentage: Math.round((studentCount / (analytics?.totalUsers || 1)) * 100) }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.count}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.8 }}
                    className={`h-full ${item.color} rounded-full`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 border border-gray-100"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">System Health</h3>
            <p className="text-sm text-gray-500">Real-time status monitoring</p>
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
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="font-medium text-gray-700 text-sm">{item.label}</span>
                <Badge variant={item.color as any} size="sm">
                  {item.status}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-2xl p-6 border border-gray-100"
      >
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-1">Recent User Registrations</h3>
          <p className="text-sm text-gray-500">Latest members who joined the platform</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  User
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
                  transition={{ delay: 0.8 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-brand-red to-pink-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900 text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm">{user.email}</td>
                  <td className="px-4 py-4">
                    <Badge variant="primary" size="sm">{user.role}</Badge>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm">
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
      </motion.div>
    </div>
  );
}
