import { Flame } from 'lucide-react';

interface StreakCalendarProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export default function StreakCalendar({
  currentStreak,
  longestStreak,
  lastActivityDate
}: StreakCalendarProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Activity Streak</h3>
        <Flame className="text-orange-500" size={24} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <Flame className="text-orange-500" size={32} />
            <span className="text-3xl font-bold text-orange-600 ml-2">{currentStreak}</span>
          </div>
          <p className="text-sm text-gray-600">Current Streak</p>
        </div>

        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <p className="text-3xl font-bold text-blue-600">{longestStreak}</p>
          <p className="text-sm text-gray-600 mt-2">Longest Streak</p>
        </div>
      </div>

      {lastActivityDate && (
        <div className="text-center text-sm text-gray-600">
          Last activity: {new Date(lastActivityDate).toLocaleDateString()}
        </div>
      )}

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <strong>Keep it up!</strong> Submit assignments, answer forum questions, or attend class to maintain your streak.
        </p>
      </div>
    </div>
  );
}
