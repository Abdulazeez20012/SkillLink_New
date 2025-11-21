import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, FileText, MessageSquare, Calendar, BarChart, Plus, 
  Clock, CheckCircle, TrendingUp, Award, Target, Mail
} from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { facilitatorService } from '../../services/facilitator.service';
import { assignmentService } from '../../services/assignment.service';
import CohortAnalytics from '../../components/analytics/CohortAnalytics';
import AssignmentCreateModal from '../../components/facilitator/AssignmentCreateModal';
import { formatDistanceToNow, format } from 'date-fns';

type TabType = 'overview' | 'assignments' | 'analytics';

export default function CohortDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: cohort, loading } = useQuery(() => facilitatorService.getCohortOverview(id!), [id]);
  const { data: assignments, loading: assignmentsLoading, refetch: refetchAssignments } = useQuery(
    () => assignmentService.getCohortAssignments(id!), 
    [id]
  );
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    {
      label: 'Students',
      value: cohort?.members?.length || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Assignments',
      value: assignments?.length || 0,
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      label: 'Forum Posts',
      value: cohort?.forumPosts?.length || 0,
      icon: MessageSquare,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Attendance',
      value: cohort?.attendanceStats?.find((s: any) => s.status === 'PRESENT')?._count || 0,
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText, count: assignments?.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-red via-red-600 to-red-700 p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-bold mb-3"
              >
                {cohort?.name}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white/90 text-lg max-w-2xl"
              >
                {cohort?.description}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-6 mt-4 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>Start: {format(new Date(cohort?.startDate), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>End: {format(new Date(cohort?.endDate), 'MMM dd, yyyy')}</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                cohort?.isActive 
                  ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                  : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
              }`}>
                {cohort?.isActive ? '● Active' : '○ Inactive'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modern Tabs */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-red text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'analytics' ? (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <CohortAnalytics />
          </motion.div>
        ) : activeTab === 'assignments' ? (
          <motion.div
            key="assignments"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Header with Create Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Assignments</h2>
                <p className="text-sm text-gray-500 mt-1">Create and manage assignments for this cohort</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
              >
                <Plus size={20} />
                <span>Create Assignment</span>
              </motion.button>
            </div>

            {/* Assignments List */}
            {assignmentsLoading ? (
              <div className="flex items-center justify-center h-64">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full"
                />
              </div>
            ) : assignments && assignments.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {assignments.map((assignment: any, index: number) => {
                  const isOverdue = new Date(assignment.dueDate) < new Date();
                  const dueIn = formatDistanceToNow(new Date(assignment.dueDate), { addSuffix: true });
                  const submissionRate = cohort?.members?.length 
                    ? ((assignment._count?.submissions || 0) / cohort.members.length * 100).toFixed(0)
                    : 0;
                  
                  return (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -2 }}
                      className="group relative"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all" />
                      <div className="relative p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                assignment.status === 'PUBLISHED' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                              }`}>
                                {assignment.status}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                            <span>Submission Progress</span>
                            <span className="font-semibold">{submissionRate}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${submissionRate}%` }}
                              transition={{ duration: 1, delay: index * 0.1 }}
                              className="h-full bg-gradient-to-r from-brand-red to-red-600 rounded-full"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock size={16} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                              <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                Due {dueIn}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText size={16} className="text-gray-400" />
                              <span className="text-gray-600">
                                {assignment._count?.submissions || 0} / {cohort?.members?.length || 0} submitted
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Award size={16} className="text-gray-400" />
                              <span className="text-gray-600">
                                {assignment.maxScore} points
                              </span>
                            </div>
                          </div>
                          
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white rounded-lg transition-all text-sm font-medium"
                          >
                            View Submissions
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText size={40} className="text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No assignments yet</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  Create your first assignment to start tracking student progress and engagement
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateModal(true)}
                  className="px-8 py-3 bg-gradient-to-r from-brand-red to-red-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Create Your First Assignment
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Student Roster */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-xl font-bold text-gray-900">Student Roster</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {cohort?.members?.length || 0} students enrolled
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cohort?.members?.map((member: any, index: number) => (
                      <motion.tr
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-red to-red-600 flex items-center justify-center text-white font-semibold">
                              {member.user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium text-gray-900">{member.user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            {member.user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {format(new Date(member.joinedAt), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-brand-red hover:text-red-700 text-sm font-medium">
                            View Profile
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Assignments */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Recent Assignments</h2>
                  <Target className="text-gray-400" size={20} />
                </div>
                <div className="space-y-3">
                  {cohort?.assignments?.slice(0, 5).map((assignment: any) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{assignment.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {format(new Date(assignment.dueDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">
                          {assignment._count?.submissions || 0} submissions
                        </p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          assignment.status === 'PUBLISHED' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Forum Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900">Recent Forum Activity</h2>
                  <MessageSquare className="text-gray-400" size={20} />
                </div>
                <div className="space-y-3">
                  {cohort?.forumPosts?.slice(0, 5).map((post: any) => (
                    <div key={post.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{post.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">by {post.user.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 mb-1">{post._count?.answers || 0} answers</p>
                        {post.solved && (
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                            Solved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assignment Create Modal */}
      <AssignmentCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          refetchAssignments();
          setActiveTab('assignments');
        }}
        cohortId={id!}
      />
    </div>
  );
}
