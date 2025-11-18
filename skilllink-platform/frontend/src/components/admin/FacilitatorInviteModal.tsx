import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/admin.service';

interface FacilitatorFormData {
  name: string;
  email: string;
  password: string;
}

interface FacilitatorInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function FacilitatorInviteModal({ isOpen, onClose, onSuccess }: FacilitatorInviteModalProps) {
  const [loading, setLoading] = useState(false);
  const [createdFacilitator, setCreatedFacilitator] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FacilitatorFormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: FacilitatorFormData) => {
    setLoading(true);
    try {
      const facilitator = await adminService.createFacilitator(data);
      setCreatedFacilitator(facilitator);
      toast.success('Facilitator created successfully!');
      reset();
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create facilitator');
    } finally {
      setLoading(false);
    }
  };

  const copyAccessCode = () => {
    if (createdFacilitator?.accessCode) {
      navigator.clipboard.writeText(createdFacilitator.accessCode);
      setCopied(true);
      toast.success('Access code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setCreatedFacilitator(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Add Facilitator</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {!createdFacilitator ? (
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="input"
                placeholder="your name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="input"
                placeholder="john@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                type="password"
                className="input"
                placeholder="Min. 8 characters"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
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
                {loading ? 'Creating...' : 'Create Facilitator'}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">Facilitator Created Successfully!</p>
              <p className="text-sm text-green-600 mt-1">
                An email has been sent with login instructions.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <div className="flex items-center space-x-2">
                <code className="flex-1 bg-gray-100 px-4 py-3 rounded-lg text-lg font-mono font-bold text-center">
                  {createdFacilitator.accessCode}
                </code>
                <button
                  onClick={copyAccessCode}
                  className="btn btn-secondary p-3"
                  title="Copy access code"
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Share this code with the facilitator for login.
              </p>
            </div>

            <button
              onClick={handleClose}
              className="btn btn-primary w-full"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
