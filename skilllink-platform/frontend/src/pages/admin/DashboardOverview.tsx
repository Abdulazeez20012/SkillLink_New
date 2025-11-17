import { Users, BookOpen, GraduationCap, Activity } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import StatsCard from '../../components/admin/StatsCard';

export default function DashboardOverview() {
  const { data: analytics, loading } = useQuery(() => adminService.getAnalytics());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const adminCount = analytics?.usersByRole.find((r: any) => r.role === 'ADMIN')?._count || 0;
  const facilitatorCount = analytics?.usersByRole.find((r: any) => r.role === 'FACILITATOR')?._count || 0;
  const studentCount = analytics?.usersByRole.find((r: any) => r.role === 'STUDENT')?._count || 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">Welcome to SkillLink Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Total Users"
          value={analytics?.totalUsers || 0}
          icon={<Users size={24} />}
        />
        <StatsCard
          title="Active Cohorts"
          value={analytics?.activeCohorts || 0}
          icon={<BookOpen size={24} />}
        />
        <StatsCard
          title="Total Students"
          value={studentCount}
          icon={<GraduationCap size={24} />}
        />
        <StatsCard
          title="Total Assignments"
          value={analytics?.totalAssignments || 0}
          icon={<Activity size={24} />}
        />
      </div>

      {/* User Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">User Distribution</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Administrators</span>
              <span className="font-semibold">{adminCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Facilitators</span>
              <span className="font-semibold">{facilitatorCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Students</span>
              <span className="font-semibold">{studentCount}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">API Status</span>
              <span className="badge badge-success">Operational</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Database</span>
              <span className="badge badge-success">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Email Service</span>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Recent User Registrations</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analytics?.recentActivity?.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-4 py-3 text-sm text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="badge badge-primary">{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
