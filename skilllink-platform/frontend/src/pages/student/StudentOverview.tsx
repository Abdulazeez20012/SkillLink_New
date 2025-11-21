import { motion } from 'framer-motion';
import { 
  Award, TrendingUp, Target, Flame, Trophy,
  BookOpen, CheckCircle, Calendar, Zap,
  BarChart3, Activity, Sparkles
} from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { gamificationService } from '../../services/gamification.service';
import PointsDisplay from '../../components/gamification/PointsDisplay';
import BadgeCollection from '../../components/gamification/BadgeCollection';
import StreakCalendar from '../../components/gamification/StreakCalendar';
import LeaderboardTable from '../../components/gamification/LeaderboardTable';
import { useAuth } from '../../context/AuthContext';

export default function StudentOverview() {
  const { user } = useAuth();
  const { data: userStats, loading: statsLoading } = useQuery(() => 
    gamificationService.getUserStats()
  );
  const { data: leaderboard, loading: leaderboardLoading } = useQuery(() => 
    gamificationService.getLeaderboard('', 'alltime')
  );

  const loading = statsLoading || leaderboardLoading;
  const gamificationData = userStats || {};

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Points',
      value: gamificationData?.totalPoints || 0,
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      trend: '+12%'
    },
    {
      label: 'Day Streak',
      value: gamificationData?.currentStreak || 0,
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      trend: '+2 days'
    },
    {
      label: 'Badges',
      value: gamificationData?.badges?.length || 0,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+1 new'
    },
    {
      label: 'Completed',
      value: gamificationData?.completedAssignments || 0,
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '85%'
    }
  ];

  const quickStats = [
    {
      label: 'Assignments',
      value: gamificationData?.totalAssignments || 0,
      status: 'On track',
      statusColor: 'text-green-600',
      icon: BookOpen,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Attendance',
      value: `${gamificationData?.attendanceRate || 0}%`,
      status: 'Great!',
      statusColor: 'text-green-600',
      icon: Calendar,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      label: 'Achievements',
      value: gamificationData?.achievements || 0,
      status: 'Keep going!',
      statusColor: 'text-orange-600',
      icon: Trophy,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 p-8 text-white shadow-2xl"
      >
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48 animate-pulse" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Sparkles className="text-white" size={24} />
            </div>
            <span className="text-white/90 font-medium">Student Dashboard</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold mb-3"
          >
            Keep Learning!
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg max-w-2xl"
          >
            Track your progress and achieve your goals
          </motion.p>
        </div>
      </motion.div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-2xl transition-all" />
            <div className="relative p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-green-600">
                  <TrendingUp size={12} />
                  <span>{stat.trend}</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              
              {/* Animated Progress Bar */}
              <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '75%' }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className={stat.iconColor} size={20} />
              </div>
              <span className={`text-xs font-semibold ${stat.statusColor} flex items-center gap-1`}>
                <CheckCircle size={12} />
                {stat.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Points and Badges Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Points */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-xl">
                <Trophy className="text-yellow-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Your Points</h2>
            </div>
          </div>
          <div className="p-6">
            <PointsDisplay 
              totalPoints={gamificationData?.totalPoints || 0}
              assignmentPoints={gamificationData?.pointsFromAssignments || 0}
              forumPoints={gamificationData?.pointsFromForum || 0}
              attendancePoints={gamificationData?.pointsFromAttendance || 0}
            />
            
            {/* Points Breakdown */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen size={16} className="text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Assignments</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {gamificationData?.pointsFromAssignments || 0}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Activity size={16} className="text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Forum</span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {gamificationData?.pointsFromForum || 0}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-xl">
                <Award className="text-purple-600" size={20} />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Badges</h2>
            </div>
          </div>
          <div className="p-6">
            {gamificationData?.badges && gamificationData.badges.length > 0 ? (
              <BadgeCollection badges={gamificationData.badges} />
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No badges earned yet</h3>
                <p className="text-sm text-gray-500 max-w-xs mx-auto">
                  Complete assignments and participate to earn badges!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Streak Calendar and Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Streak Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-xl">
                  <Flame className="text-orange-600" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Activity Streak</h2>
                  <p className="text-xs text-gray-500">Keep your streak alive!</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-orange-600">
                  {gamificationData?.currentStreak || 0}
                </p>
                <p className="text-xs text-gray-500">days</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <StreakCalendar 
              currentStreak={gamificationData?.currentStreak || 0}
              longestStreak={gamificationData?.longestStreak || 0}
              lastActivityDate={gamificationData?.lastActivityDate}
            />
          </div>
        </motion.div>

        {/* Mini Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <BarChart3 className="text-blue-600" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Rank</h2>
                <p className="text-xs text-gray-500">Top performers</p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3 shadow-lg">
                <span className="text-2xl font-bold text-white">
                  #{gamificationData?.rank || '-'}
                </span>
              </div>
              <p className="text-sm text-gray-600">Your current rank</p>
            </div>
            
            <div className="space-y-2">
              {[1, 2, 3].map((rank) => (
                <div key={rank} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                    rank === 2 ? 'bg-gray-200 text-gray-700' :
                    'bg-orange-100 text-orange-700'
                  }`}>
                    {rank}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Student {rank}</p>
                    <p className="text-xs text-gray-500">{1000 - rank * 100} pts</p>
                  </div>
                  {rank === 1 && <Trophy size={16} className="text-yellow-600" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Target className="text-indigo-600" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Leaderboard</h2>
              <p className="text-xs text-gray-500">See how you compare with others</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <LeaderboardTable 
            entries={leaderboard || []}
            currentUserId={user?.id}
          />
        </div>
      </motion.div>
    </div>
  );
}
