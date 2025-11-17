import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileText, Calendar } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { facilitatorService } from '../../services/facilitator.service';

export default function FacilitatorOverview() {
  const navigate = useNavigate();
  const { data: cohorts, loading } = useQuery(() => facilitatorService.getMyCohorts());

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
        <h1 className="text-3xl font-bold text-gray-900">My Cohorts</h1>
        <p className="mt-2 text-gray-600">Manage your assigned cohorts</p>
      </div>

      {cohorts && cohorts.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500 mb-4">No cohorts assigned yet</p>
          <p className="text-sm text-gray-400">Contact an administrator to get assigned to cohorts</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cohorts?.map((cohort: any) => (
            <div
              key={cohort.id}
              onClick={() => navigate(`/facilitator/cohorts/${cohort.id}`)}
              className="card hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{cohort.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{cohort.description}</p>
                </div>
                <span className="badge badge-success">Active</span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                <div className="text-center">
                  <div className="flex items-center justify-center text-primary-600 mb-1">
                    <Users size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{cohort._count?.members || 0}</p>
                  <p className="text-xs text-gray-500">Students</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-primary-600 mb-1">
                    <FileText size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{cohort._count?.assignments || 0}</p>
                  <p className="text-xs text-gray-500">Assignments</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center text-primary-600 mb-1">
                    <Calendar size={20} />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.ceil((new Date(cohort.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                  </p>
                  <p className="text-xs text-gray-500">Days Left</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Start: {new Date(cohort.startDate).toLocaleDateString()}</span>
                  <span>End: {new Date(cohort.endDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
