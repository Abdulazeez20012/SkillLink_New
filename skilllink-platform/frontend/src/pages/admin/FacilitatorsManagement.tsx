import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, RefreshCw, Mail, BookOpen } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { adminService } from '../../services/admin.service';
import FacilitatorInviteModal from '../../components/admin/FacilitatorInviteModal';
import { LoadingSpinner } from '../../components/ui';
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
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="lg" text="Loading facilitators..." />
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
          <h1 className="text-2xl font-bold text-gray-900">Facilitators Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage facilitator accounts and access codes</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-red text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          <span>Add Facilitator</span>
        </motion.button>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Name</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Access Code</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Cohorts</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {facilitators?.map((facilitator: any, index: number) => (
                <motion.tr
                  key={facilitator.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                        {facilitator.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{facilitator.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={14} className="text-gray-400" />
                      <span className="text-sm">{facilitator.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-3 py-1.5 bg-gray-100 text-brand-red rounded-lg text-sm font-mono font-bold">
                      {facilitator.accessCode}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {facilitator._count?.createdCohorts || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      facilitator.isActive 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {facilitator.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => regenerateCode(facilitator.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-brand-red hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                      title="Regenerate access code"
                    >
                      <RefreshCw size={14} />
                      <span>New Code</span>
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      <FacilitatorInviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onSuccess={refetch}
      />
    </div>
  );
}
