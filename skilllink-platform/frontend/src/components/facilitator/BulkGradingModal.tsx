import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentService } from '../../services/assignment.service';

interface BulkGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: any[];
  assignment: any;
  onSuccess: () => void;
}

export default function BulkGradingModal({ 
  isOpen, 
  onClose, 
  submissions, 
  assignment,
  onSuccess 
}: BulkGradingModalProps) {
  const [grades, setGrades] = useState<Record<string, { points: number; feedback: string }>>({});
  const [loading, setLoading] = useState(false);

  const handleGradeChange = (submissionId: string, field: 'points' | 'feedback', value: string | number) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        points: field === 'points' ? Number(value) : (prev[submissionId]?.points || 0),
        feedback: field === 'feedback' ? String(value) : (prev[submissionId]?.feedback || '')
      }
    }));
  };

  const handleBulkGrade = async () => {
    const gradesToSubmit = Object.entries(grades).filter(([_, data]) => data.points > 0);
    
    if (gradesToSubmit.length === 0) {
      toast.error('Please enter at least one grade');
      return;
    }

    setLoading(true);
    try {
      await Promise.all(
        gradesToSubmit.map(([submissionId, gradeData]) =>
          assignmentService.gradeSubmission(submissionId, gradeData)
        )
      );
      toast.success(`Successfully graded ${gradesToSubmit.length} submissions!`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to grade submissions');
    } finally {
      setLoading(false);
    }
  };

  const ungradedSubmissions = submissions.filter(s => s.grade === null);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Bulk Grading</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Grade multiple submissions at once - {ungradedSubmissions.length} ungraded
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {ungradedSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {ungradedSubmissions.map((submission: any, index: number) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white border border-gray-200 rounded-xl p-6"
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar */}
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {submission.user.name.charAt(0).toUpperCase()}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">
                            {submission.user.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">{submission.user.email}</p>

                          {/* Submission Preview */}
                          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700 line-clamp-2">
                              {submission.content}
                            </p>
                          </div>

                          {/* Grading Inputs */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Points (Max: {assignment.maxScore})
                              </label>
                              <div className="relative">
                                <input
                                  type="number"
                                  min="0"
                                  max={assignment.maxScore}
                                  value={grades[submission.id]?.points || ''}
                                  onChange={(e) => handleGradeChange(submission.id, 'points', e.target.value)}
                                  className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                  placeholder="0"
                                />
                                <Award size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Feedback
                              </label>
                              <input
                                type="text"
                                value={grades[submission.id]?.feedback || ''}
                                onChange={(e) => handleGradeChange(submission.id, 'feedback', e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500"
                                placeholder="Great work!"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={40} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">All submissions graded!</h3>
                  <p className="text-gray-500">
                    There are no ungraded submissions for this assignment.
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {ungradedSubmissions.length > 0 && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle size={16} />
                    <span>
                      {Object.keys(grades).filter(id => grades[id]?.points > 0).length} of {ungradedSubmissions.length} ready to submit
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={onClose}
                      disabled={loading}
                      className="px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBulkGrade}
                      disabled={loading || Object.keys(grades).filter(id => grades[id]?.points > 0).length === 0}
                      className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          Submit All Grades
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
