import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, MessageSquare, Github, User, Calendar, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentService } from '../../services/assignment.service';
import { format } from 'date-fns';

interface GradingFormData {
  points: number;
  feedback: string;
}

interface AssignmentGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  submission: any;
  assignment: any;
}

export default function AssignmentGradingModal({ isOpen, onClose, onSuccess, submission, assignment }: AssignmentGradingModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GradingFormData>();

  const onSubmit = async (data: GradingFormData) => {
    setLoading(true);
    try {
      await assignmentService.gradeSubmission(submission.id, {
        points: Number(data.points),
        feedback: data.feedback
      });
      toast.success('Assignment graded successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to grade assignment');
    } finally {
      setLoading(false);
    }
  };

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
            className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900">Grade Submission</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              
              {/* Assignment Info */}
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{assignment.title}</h3>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <User size={12} />
                    <span>{submission.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Submitted {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award size={12} />
                    <span>Max: {assignment.maxPoints} points</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-280px)]">
              {/* Student Submission */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Student Submission
                </label>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-800 text-sm whitespace-pre-wrap">{submission.content}</p>
                </div>
              </div>

              {/* GitHub URL if provided */}
              {submission.githubUrl && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    GitHub Repository
                  </label>
                  <a
                    href={submission.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <Github size={18} />
                    <span className="text-sm font-medium">View on GitHub</span>
                    <ExternalLink size={14} className="ml-auto" />
                  </a>
                </div>
              )}

              {/* Grading Form */}
              <div className="border-t border-gray-200 pt-5">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Grade This Submission</h3>
                
                {/* Points */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Points <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('points', {
                        required: 'Points are required',
                        min: { value: 0, message: 'Points cannot be negative' },
                        max: { value: assignment.maxPoints, message: `Cannot exceed ${assignment.maxPoints} points` }
                      })}
                      type="number"
                      step="0.5"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder={`0 - ${assignment.maxPoints}`}
                    />
                    <Award size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.points && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.points.message}
                    </motion.p>
                  )}
                </div>

                {/* Feedback */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Feedback <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <textarea
                      {...register('feedback', { required: 'Feedback is required' })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none"
                      placeholder="Provide constructive feedback to help the student improve..."
                    />
                    <MessageSquare size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.feedback && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.feedback.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 border-t border-gray-100">
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
                type="submit"
                onClick={handleSubmit(onSubmit)}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-brand-red text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting Grade...
                  </>
                ) : (
                  <>
                    <Award size={18} />
                    Submit Grade
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
