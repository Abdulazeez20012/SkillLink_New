import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import { Users } from 'lucide-react';

export default function StudentsManagement() {
  const { data: students, loading } = useQuery(() => adminService.getStudents());

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
        <h1 className="text-3xl font-bold text-gray-900">Students Management</h1>
        <p className="mt-2 text-gray-600">View and manage student enrollments</p>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohorts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students?.map((student: any) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{student.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.cohortMemberships?.map((membership: any) => (
                        <span key={membership.cohort.id} className="badge badge-primary text-xs">
                          {membership.cohort.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${student.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </span>
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
