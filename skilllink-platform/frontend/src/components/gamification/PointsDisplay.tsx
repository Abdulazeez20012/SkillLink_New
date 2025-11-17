import { Trophy } from 'lucide-react';

interface PointsDisplayProps {
  totalPoints: number;
  assignmentPoints: number;
  forumPoints: number;
  attendancePoints: number;
}

export default function PointsDisplay({
  totalPoints,
  assignmentPoints,
  forumPoints,
  attendancePoints
}: PointsDisplayProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Your Points</h3>
        <Trophy className="text-yellow-500" size={24} />
      </div>

      <div className="text-center mb-6">
        <p className="text-4xl font-bold text-primary-600">{totalPoints}</p>
        <p className="text-sm text-gray-600 mt-1">Total Points</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Assignments</span>
          <span className="text-lg font-bold text-blue-600">{assignmentPoints}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Forum</span>
          <span className="text-lg font-bold text-green-600">{forumPoints}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-700">Attendance</span>
          <span className="text-lg font-bold text-purple-600">{attendancePoints}</span>
        </div>
      </div>
    </div>
  );
}
