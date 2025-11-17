import { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import FacilitatorInviteModal from '../../components/admin/FacilitatorInviteModal';
import toast from 'react-hot-toast';

export default function FacilitatorsManagement() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { data: facilitators, loading, refetch } = useQuery(() => adminService.getFacilitators());

  const regenerateCode = async (facilitatorId: string) => {
    try {
      const updated = await adminService.regenerateAccessCode(facilitatorId);
      toast.success(`New access code: ${updated.accessCode}`);
      refetch();
    } catch (error) {
      toast.error('Failed to regenerate access code');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facilitators Management</h1>
          <p className="mt-2 text-gray-600">Manage facilitator accounts and access codes</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Facilitator</span>
        </button>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Access Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cohorts</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {facilitators?.map((facilitator: any) => (
                <tr key={facilitator.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{facilitator.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{facilitator.email}</td>
                  <td className="px-6 py-4">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {facilitator.accessCode}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {facilitator._count?.createdCohorts || 0}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`badge ${facilitator.isActive ? 'badge-success' : 'badge-danger'}`}>
                      {facilitator.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => regenerateCode(facilitator.id)}
                      className="text-primary-600 hover:text-primary-800 flex items-center space-x-1"
                      title="Regenerate access code"
                    >
                      <RefreshCw size={16} />
                      <span className="text-sm">New Code</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <FacilitatorInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
