import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Tag, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { forumService } from '../../services/forum.service';
import { cohortService } from '../../services/cohort.service';

interface ForumPostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ForumPostCreateModal({ isOpen, onClose, onSuccess }: ForumPostCreateModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [cohorts, setCohorts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCohorts();
    }
  }, [isOpen]);

  const fetchCohorts = async () => {
    try {
      const data = await cohortService.getMyCohorts();
      setCohorts(data);
      if (data.length > 0) {
        setCohortId(data[0].id);
      }
    } catch (error) {
      toast.error('Failed to load cohorts');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !cohortId) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await forumService.createPost({
        title: title.trim(),
        content: content.trim(),
        cohortId,
        tags
      });
      toast.success('Post created successfully!');
      setTitle('');
      setContent('');
      setTags([]);
      onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create post');
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
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 rounded-xl">
                    <MessageSquare className="text-indigo-600" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Create New Post</h2>
                    <p className="text-sm text-gray-600 mt-1">Share your question or discussion topic</p>
                  </div>
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="space-y-6">
                {/* Cohort Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cohort <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={cohortId}
                    onChange={(e) => setCohortId(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  >
                    <option value="">Select a cohort</option>
                    {cohorts.map(cohort => (
                      <option key={cohort.id} value={cohort.id}>
                        {cohort.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What's your question or topic?"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide details about your question or topic..."
                    required
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                  />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (Optional)
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag();
                        }
                      }}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddTag}
                      className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-200 transition-colors flex items-center gap-2"
                    >
                      <Plus size={16} />
                      Add
                    </motion.button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <motion.div
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm"
                        >
                          <Tag size={14} />
                          <span>{tag}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-indigo-800 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-end gap-3">
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
                  onClick={handleSubmit}
                  disabled={loading || !title.trim() || !content.trim() || !cohortId}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <MessageSquare size={18} />
                      Create Post
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
