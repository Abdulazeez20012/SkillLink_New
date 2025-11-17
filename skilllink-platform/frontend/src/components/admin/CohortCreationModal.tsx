import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { cohortService } from '../../services/cohort.service';

interface CohortFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
}

interface CohortCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CohortCreationModal({ isOpen, onClose, onSuccess }: CohortCreationModalProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CohortFormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: CohortFormData) => {
    setLoading(true);
    try {
      await cohortService.createCohort(data);
      toast.success('Cohort created successfully!');
      reset();
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create cohort');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Create New Cohort</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cohort Name *
            </label>
            <input
              {...register('name', { required: 'Cohort name is required' })}
              type="text"
              className="input"
              placeholder="e.g., Full Stack Web Development - Cohort 1"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              {...register('description', { required: 'Description is required' })}
              rows={4}
              className="input"
              placeholder="Describe the cohort, learning objectives, and expectations..."
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                {...register('startDate', { required: 'Start date is required' })}
                type="date"
                className="input"
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date *
              </label>
              <input
                {...register('endDate', { required: 'End date is required' })}
                type="date"
                className="input"
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Cohort'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
