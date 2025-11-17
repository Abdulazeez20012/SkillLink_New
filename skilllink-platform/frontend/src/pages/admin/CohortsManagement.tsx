import { useState } from 'react';
import { Plus, Link as LinkIcon, RefreshCw, Users } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { cohortService } from '../../services/cohort.service';
import { adminService } from '../../services/admin.service';
import CohortCreationModal from '../../components/admin/CohortCreationModal';
import StudentBulkInvite from '../../components/admin/StudentBulkInvite';
import toast from 'react-hot-toast';

export default function CohortsManagement() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedCohort, setSelectedCohort] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const { data: cohorts, loading, refetch } = useQuery(() => cohortService.getCohorts());

  const copyInviteLink = (link: string, type: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    toast.success(`${type} invite link copied!`);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const regenerateLinks = async (cohortId: string) => {
    try {
      const links = await adminService.regenerateInviteLinks(cohortId);
      toast.success('Invite links regenerated!');
      refetch();
    } catch (error) {
      toast.error('Failed to regenerate links');
    }
  };

  const openInviteModal = (cohort: any) => {
    setSelectedCohort(cohort);
    setShowInviteModal(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Cohorts Management</h1>
          <p className="mt-2 text-gray-600">Create and manage learning cohorts</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Cohort</span>
        </button>
      </div>

      {cohorts && cohorts.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 mb-4">No cohorts created yet</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Your First Cohort
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {cohorts?.map((cohort: any) => (
            <div key={cohort.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{cohort.name}</h3>
                  <p className="text-gray-600 mt-1">{cohort.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Start: {new Date(cohort.startDate).toLocaleDateString()}</span>
                    <span>End: {new Date(cohort.endDate).toLocaleDateString()}</span>
                    <span className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {cohort._count?.members || 0} members
                    </span>
                  </div>
                </div>
                <span className={`badge ${cohort.isActive ? 'badge-success' : 'badge-danger'}`}>
                  {cohort.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">
                    Student Invite Link
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={`${window.location.origin}/student/register/${cohort.studentInviteLink}`}
                      readOnly
                      className="input flex-1 text-sm"
                    />
                    <button
                      onClick={() => copyInviteLink(
                        `${window.location.origin}/student/register/${cohort.studentInviteLink}`,
                        'Student'
                      )}
                      className="btn btn-secondary"
                    >
                      <LinkIcon size={16} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openInviteModal(cohort)}
                    className="btn btn-primary flex-1"
                  >
                    <Users size={16} className="mr-2" />
                    Invite Students
                  </button>
                  <button
                    onClick={() => regenerateLinks(cohort.id)}
                    className="btn btn-secondary"
                    title="Regenerate invite links"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <CohortCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={refetch}
      />

      {selectedCohort && (
        <StudentBulkInvite
          isOpen={showInviteModal}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedCohort(null);
          }}
          cohortId={selectedCohort.id}
          cohortName={selectedCohort.name}
        />
      )}
    </div>
  );
}
