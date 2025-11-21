import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Award, FileText, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentService } from '../../services/assignment.service';
import { format } from 'date-fns';

interface AssignmentFormData {
  title: string;
  description: string;
  dueDate: string;
  maxPoints: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
}

interface AssignmentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignment: any;
}

export default function AssignmentEditModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  assignment 
}: AssignmentEditModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<AssignmentFormData>();

  useEffect(() => {
    if (assignment && isOpen) {
      // Format the date for datetime-local input
      const dueDate = new Date(assignment.dueDate);
      const formattedDate = format(dueDate, "yyyy-MM-dd'T'HH:mm");
      
      setValue('title', assignment.title);
      setValue('description', assignment.description);
      setValue('dueDate', formattedDate);
      setValue('maxPoints', assignment.maxScore);
      setValue('status', assignment.status);
    }
  }, [assignment, isOpen, setValue]);

  const onSubmit = async (data: AssignmentFormData) => {
    setLoading(true);
    try {
      await assignmentService.updateAssignment(assignment.id, {
        ...data,
        maxPoints: Number(data.maxPoints)
      });
      toast.success('Assignment updated successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to update assignment');
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
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
              <h2 className="text-2xl font-bold text-gray-900">Edit Assignment</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-140px)]">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assignment Title <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="e.g., Build a REST API"
                  />
                  <FileText size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1.5"
                  >
                    {errors.title.message}
                  </motion.p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-brand-red">*</span>
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none"
                  placeholder="Describe the assignment requirements, objectives, and deliverables..."
                />
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1.5"
                  >
                    {errors.description.message}
                  </motion.p>
                )}
              </div>

              {/* Due Date, Max Points, and Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Due Date <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('dueDate', { required: 'Due date is required' })}
                      type="datetime-local"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    />
                    <Calendar size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.dueDate && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.dueDate.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Points <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('maxPoints', { 
                        required: 'Max points is required',
                        min: { value: 1, message: 'Must be at least 1' },
                        max: { value: 1000, message: 'Cannot exceed 1000' }
                      })}
                      type="number"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="100"
                    />
                    <Award size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.maxPoints && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.maxPoints.message}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Status <span className="text-brand-red">*</span>
                  </label>
                  <select
                    {...register('status', { required: 'Status is required' })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                  {errors.status && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.status.message}
                    </motion.p>
                  )}
                </div>
              </div>
            </form>

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
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Changes
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
