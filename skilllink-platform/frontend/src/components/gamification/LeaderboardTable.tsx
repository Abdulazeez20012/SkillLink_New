import { Trophy, Medal, Award } from 'lucide-react';

interface LeaderboardEntry {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  totalPoints: number;
  assignmentPoints: number;
  forumPoints: number;
  attendancePoints: number;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export default function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={24} />;
      case 2:
        return <Medal className="text-gray-400" size={24} />;
      case 3:
        return <Medal className="text-orange-600" size={24} />;
      default:
        return <span className="text-gray-600 font-bold">{rank}</span>;
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Leaderboard</h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Assignments</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Forum</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Attendance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {entries.map((entry, index) => {
              const rank = index + 1;
              const isCurrentUser = entry.user.id === currentUserId;

              return (
                <tr
                  key={entry.user.id}
                  className={`${isCurrentUser ? 'bg-primary-50' : 'hover:bg-gray-50'}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center w-8">
                      {getRankIcon(rank)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      {entry.user.avatar ? (
                        <img
                          src={entry.user.avatar}
                          alt={entry.user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {entry.user.name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <span className={`font-medium ${isCurrentUser ? 'text-primary-700' : 'text-gray-900'}`}>
                        {entry.user.name}
                        {isCurrentUser && <span className="ml-2 text-xs text-primary-600">(You)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-bold text-primary-600">{entry.totalPoints}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{entry.assignmentPoints}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{entry.forumPoints}</td>
                  <td className="px-4 py-3 text-right text-gray-600">{entry.attendancePoints}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
