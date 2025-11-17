import { useQuery } from '../../hooks/useQuery';
import { gamificationService } from '../../services/gamification.service';
import PointsDisplay from '../../components/gamification/PointsDisplay';
import BadgeCollection from '../../components/gamification/BadgeCollection';
import StreakCalendar from '../../components/gamification/StreakCalendar';
import StudyRecommendations from '../../components/ai/StudyRecommendations';
import { FileText, Calendar, Award } from 'lucide-react';

export default function StudentOverview() {
  const { data: stats, loading } = useQuery(() => gamificationService.getUserStats());

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const points = stats?.points || {
    totalPoints: 0,
    assignmentPoints: 0,
    forumPoints: 0,
    attendancePoints: 0
  };

  const streak = stats?.streak || {
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: null
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's your progress overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <FileText className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Attendance</p>
              <p className="text-2xl font-bold text-gray-900">0 days</p>
            </div>
            <Calendar className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Badges</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.badges?.length || 0}</p>
            </div>
            <Award className="text-primary-600" size={32} />
          </div>
        </div>
      </div>

      {/* Gamification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <PointsDisplay {...points} />
        <div className="lg:col-span-2">
          <BadgeCollection badges={stats?.badges || []} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <StreakCalendar {...streak} />
        <StudyRecommendations />
      </div>
    </div>
  );
}
