import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, FileText, Github, Link as LinkIcon, Upload, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { assignmentService } from '../../services/assignment.service';

interface SubmissionFormData {
  content: string;
  githubUrl?: string;
}

interface AssignmentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  assignment: any;
}

export default function AssignmentSubmissionModal({ isOpen, onClose, onSuccess, assignment }: AssignmentSubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SubmissionFormData>();

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dwiewdn6f';
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'skilllink';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      { method: 'POST', body: formData }
    );
    
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter(file => file.size <= 10 * 1024 * 1024); // 10MB limit
    
    if (validFiles.length !== selectedFiles.length) {
      toast.error('Some files exceed 10MB limit and were not added');
    }
    
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: SubmissionFormData) => {
    setLoading(true);
    setUploading(true);
    
    try {
      // Upload files to Cloudinary
      let fileUrls: string[] = [];
      if (files.length > 0) {
        toast.loading('Uploading files...');
        fileUrls = await Promise.all(files.map(file => uploadToCloudinary(file)));
        toast.dismiss();
        toast.success('Files uploaded successfully!');
      }

      // Submit assignment
      await assignmentService.submitAssignment(assignment.id, {
        content: data.content,
        githubUrl: data.githubUrl || undefined,
        attachmentUrl: fileUrls.length > 0 ? fileUrls.join(',') : undefined
      });
      
      toast.success('Assignment submitted successfully!');
      reset();
      setFiles([]);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setLoading(false);
      setUploading(false);
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
            <div className="px-6 py-5 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-gray-900">Submit Assignment</h2>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="font-semibold text-gray-900 text-sm">{assignment.title}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{assignment.description}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-200px)]">
              {/* Submission Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Submission <span className="text-brand-red">*</span>
                </label>
                <div className="relative">
                  <textarea
                    {...register('content', { required: 'Submission content is required' })}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all resize-none"
                    placeholder="Write your submission here... Include explanations, code snippets, or links to your work."
                  />
                  <FileText size={18} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
                {errors.content && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1.5"
                  >
                    {errors.content.message}
                  </motion.p>
                )}
              </div>

              {/* GitHub URL (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  GitHub Repository URL <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    {...register('githubUrl', {
                      pattern: {
                        value: /^https?:\/\/(www\.)?github\.com\/.+/,
                        message: 'Please enter a valid GitHub URL'
                      }
                    })}
                    type="url"
                    className="w-full px-4 py-3 pl-11 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
                    placeholder="https://github.com/username/repository"
                  />
                  <Github size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.githubUrl && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-1.5"
                  >
                    {errors.githubUrl.message}
                  </motion.p>
                )}
                <p className="text-xs text-gray-500 mt-1.5">
                  If your assignment involves code, share your GitHub repository link
                </p>
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Attachments <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-brand-red transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.zip,.jpg,.jpeg,.png,.txt"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <Upload size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">
                      Click to upload files
                    </span>
                    <span className="text-xs text-gray-500 mt-1">
                      PDF, DOC, ZIP, Images (Max 10MB each)
                    </span>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <span className="text-xs text-gray-500">
                            ({(file.size / 1024).toFixed(2)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <LinkIcon size={18} className="text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Submission Tips</p>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be clear and detailed in your explanation</li>
                      <li>• Include any relevant links or resources</li>
                      <li>• Double-check your work before submitting</li>
                      <li>• You can only submit once per assignment</li>
                    </ul>
                  </div>
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
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Assignment
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
