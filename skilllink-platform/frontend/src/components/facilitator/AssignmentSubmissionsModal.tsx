import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, CheckCircle, Clock, Award, Eye, Edit } from 'lucide-react';
import { useQuery } from '../../hooks/useQuery';
import { assignmentService } from '../../services/assignment.service';
import { format } from 'date-fns';
import AssignmentGradingModal from './AssignmentGradingModal';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AssignmentSubmissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: any;
}

export default function AssignmentSubmissionsModal({ 
  isOpen, 
  onClose, 
  assignment 
}: AssignmentSubmissionsModalProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);

  const { data: submissions, loading, refetch } = useQuery(
    () => assignmentService.getSubmissions(assignment.id),
    [assignment.id]
  );

  const handleGrade = (submission: any) => {
    setSelectedSubmission(submission);
    setShowGradingModal(true);
  };

  const handleGradingSuccess = () => {
    setShowGradingModal(false);
    setSelectedSubmission(null);
    refetch();
  };

  const getStatusColor = (submission: any) => {
    if (submission.grade !== null) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getStatusText = (submission: any) => {
    if (submission.grade !== null) return 'Graded';
    return 'Pending';
  };

  return (
    <>
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
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{assignment.title}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {submissions?.length || 0} submissions
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

                {/* Stats */}
                <div className="flex items-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle size={16} className="text-green-600" />
                    <span className="text-gray-700">
                      <strong>{submissions?.filter((s: any) => s.grade !== null).length || 0}</strong> Graded
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} className="text-blue-600" />
                    <span className="text-gray-700">
                      <strong>{submissions?.filter((s: any) => s.grade === null).length || 0}</strong> Pending
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award size={16} className="text-purple-600" />
                    <span className="text-gray-700">
                      Max: <strong>{assignment.maxScore}</strong> points
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <LoadingSpinner size="lg" text="Loading submissions..." />
                  </div>
                ) : submissions && submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.map((submission: any, index: number) => (
                      <motion.div
                        key={submission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                              {submission.user.name.charAt(0).toUpperCase()}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">
                                  {submission.user.name}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(submission)}`}>
                                  {getStatusText(submission)}
                                </span>
                              </div>

                              <p className="text-sm text-gray-600 mb-3">
                                {submission.user.email}
                              </p>

                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>
                                  Submitted: {format(new Date(submission.submittedAt), 'MMM dd, yyyy HH:mm')}
                                </span>
                                {submission.grade !== null && (
                                  <span className="text-green-600 font-semibold">
                                    Grade: {submission.grade}/{assignment.maxScore}
                                  </span>
                                )}
                              </div>

                              {/* Content Preview */}
                              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  {submission.content}
                                </p>
                              </div>

                              {/* GitHub URL */}
                              {submission.githubUrl && (
                                <div className="mt-2">
                                  <a
                                    href={submission.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                                  >
                                    View on GitHub →
                                  </a>
                                </div>
                              )}

                              {/* Feedback */}
                              {submission.feedback && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                  <p className="text-xs font-semibold text-blue-900 mb-1">Feedback:</p>
                                  <p className="text-sm text-blue-700">{submission.feedback}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleGrade(submission)}
                              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                            >
                              {submission.grade !== null ? (
                                <>
                                  <Edit size={16} />
                                  Edit Grade
                                </>
                              ) : (
                                <>
                                  <Award size={16} />
                                  Grade
                                </>
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No submissions yet</h3>
                    <p className="text-gray-500">
                      Students haven't submitted their work for this assignment yet.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grading Modal */}
      {selectedSubmission && (
        <AssignmentGradingModal
          isOpen={showGradingModal}
          onClose={() => {
            setShowGradingModal(false);
            setSelectedSubmission(null);
          }}
          onSuccess={handleGradingSuccess}
          submission={selectedSubmission}
          assignment={assignment}
        />
      )}
    </>
  );
}
