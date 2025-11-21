import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Mail, Lock, User, PartyPopper } from 'lucide-react';
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
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Add Facilitator</h2>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {!createdFacilitator ? (
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="your name"
                    />
                    <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.name && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.name.message}
                    </motion.p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="admin@skilllink.com"
                    />
                    <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password <span className="text-brand-red">*</span>
                  </label>
                  <div className="relative">
                    <input
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 8, message: 'Password must be at least 8 characters' }
                      })}
                      type="password"
                      className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                      placeholder="Min. 8 characters"
                    />
                    <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-1.5"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleClose}
                    disabled={loading}
                    className="flex-1 px-5 py-2.5 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2.5 bg-brand-red text-white font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      'Create Facilitator'
                    )}
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-5">
                {/* Success Message */}
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <PartyPopper size={32} className="text-green-600" />
                  </div>
                  <p className="text-green-800 font-bold text-lg mb-1">Facilitator Created!</p>
                  <p className="text-sm text-green-600">
                    An email has been sent with login instructions.
                  </p>
                </motion.div>

                {/* Access Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                    Access Code
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-gradient-to-r from-brand-red/10 to-pink-100 px-4 py-4 rounded-xl text-2xl font-mono font-bold text-center text-brand-red border-2 border-brand-red/20">
                      {createdFacilitator.accessCode}
                    </code>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyAccessCode}
                      className={`p-4 rounded-xl transition-colors ${
                        copied 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Copy access code"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </motion.button>
                  </div>
                  <p className="text-sm text-gray-500 mt-3 text-center">
                    Share this code with the facilitator for login
                  </p>
                </div>

                {/* Done Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-brand-red text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                >
                  Done
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
