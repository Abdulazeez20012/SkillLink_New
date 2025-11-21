import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Users, Calendar, Copy, Check } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { cohortService } from '../../services/cohort.service';
import { adminService } from '../../services/admin.service';
import CohortCreationModal from '../../components/admin/CohortCreationModal';
import StudentBulkInvite from '../../components/admin/StudentBulkInvite';
import { LoadingSpinner } from '../../components/ui';
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
      await adminService.regenerateInviteLinks(cohortId);
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
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading cohorts..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cohorts Management</h1>
          <p className="text-sm text-gray-500 mt-1">Create and manage learning cohorts</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Create Cohort</span>
        </motion.button>
      </motion.div>

      {cohorts && cohorts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-12 text-center border border-gray-100"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No cohorts yet</h3>
          <p className="text-gray-500 mb-6">Get started by creating your first cohort</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Create Your First Cohort
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {cohorts?.map((cohort: any, index: number) => {
            const inviteLink = `${window.location.origin}/register/student/${cohort.studentInviteLink}`;
            const isCopied = copiedLink === inviteLink;
            
            return (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all"
              >
                {/* Cohort Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{cohort.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cohort.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {cohort.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{cohort.description}</p>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>Start: {new Date(cohort.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>End: {new Date(cohort.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-brand-red">
                        <Users size={14} />
                        <span>{cohort._count?.members || 0} members</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Invite Link Section */}
                <div className="bg-gray-50 rounded-xl p-4 mb-3">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block">
                    Student Invite Link
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={inviteLink}
                      readOnly
                      className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-red/20"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => copyInviteLink(inviteLink, 'Student')}
                      className={`p-2 rounded-lg transition-colors ${
                        isCopied 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                      title="Copy link"
                    >
                      {isCopied ? <Check size={18} /> : <Copy size={18} />}
                    </motion.button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openInviteModal(cohort)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                  >
                    <Users size={18} />
                    <span>Invite Students</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => regenerateLinks(cohort.id)}
                    className="p-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
                    title="Regenerate invite links"
                  >
                    <RefreshCw size={18} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
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
