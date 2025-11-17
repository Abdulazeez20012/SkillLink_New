import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Users, FileText, MessageSquare, Calendar, BarChart } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { facilitatorService } from '../../services/facilitator.service';
import CohortAnalytics from '../../components/analytics/CohortAnalytics';

type TabType = 'overview' | 'analytics';

export default function CohortDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: cohort, loading } = useQuery(() => facilitatorService.getCohortOverview(id!), [id]);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{cohort?.name}</h1>
        <p className="mt-2 text-gray-600">{cohort?.description}</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Users className="inline-block mr-2" size={18} />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analytics'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart className="inline-block mr-2" size={18} />
            Analytics
          </button>
        </nav>
      </div>

      {activeTab === 'analytics' ? (
        <CohortAnalytics />
      ) : (
        <div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Students</p>
              <p className="text-2xl font-bold text-gray-900">{cohort?.members?.length || 0}</p>
            </div>
            <Users className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{cohort?.assignments?.length || 0}</p>
            </div>
            <FileText className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Forum Posts</p>
              <p className="text-2xl font-bold text-gray-900">{cohort?.forumPosts?.length || 0}</p>
            </div>
            <MessageSquare className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-gray-900">
                {cohort?.attendanceStats?.find((s: any) => s.status === 'PRESENT')?._count || 0}
              </p>
            </div>
            <Calendar className="text-primary-600" size={32} />
          </div>
        </div>
      </div>

      {/* Student Roster */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Student Roster</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {cohort?.members?.map((member: any) => (
                <tr key={member.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{member.user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{member.user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(member.joinedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Assignments */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">Recent Assignments</h2>
        <div className="space-y-3">
          {cohort?.assignments?.map((assignment: any) => (
            <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                <p className="text-sm text-gray-600">Due: {new Date(assignment.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{assignment._count?.submissions || 0} submissions</p>
                <span className={`badge ${assignment.status === 'PUBLISHED' ? 'badge-success' : 'badge-warning'}`}>
                  {assignment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Forum Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Forum Activity</h2>
        <div className="space-y-3">
          {cohort?.forumPosts?.map((post: any) => (
            <div key={post.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{post.title}</h3>
                <p className="text-sm text-gray-600 mt-1">by {post.user.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">{post._count?.answers || 0} answers</p>
                {post.solved && <span className="badge badge-success mt-1">Solved</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
      )}
    </div>
  );
}
