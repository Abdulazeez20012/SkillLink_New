import { TrendingUp, Award, Calendar } from 'lucide-react';

export default function StudentProgress() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>
        <p className="mt-2 text-gray-600">Track your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Grade</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
            <TrendingUp className="text-primary-600" size={32} />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">0%</p>
            </div>
            <Award className="text-primary-600" size={32} />
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
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Grade History</h2>
        <p className="text-gray-600">No grades yet. Complete assignments to see your progress.</p>
      </div>
    </div>
  );
}
