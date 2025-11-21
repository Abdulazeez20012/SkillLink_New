import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, MessageSquare, Tag, Eye, Clock, CheckCircle, 
  ThumbsUp, Send, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import { forumService, ForumPost } from '../../services/forum.service';
import { useAuth } from '../../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';

interface ForumPostDetailModalProps {
  post: ForumPost;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function ForumPostDetailModal({ 
  post, 
  isOpen, 
  onClose, 
  onUpdate 
}: ForumPostDetailModalProps) {
  const { user } = useAuth();
  const [answerContent, setAnswerContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [endorsingAnswers, setEndorsingAnswers] = useState<Set<string>>(new Set());

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!answerContent.trim()) {
      toast.error('Please enter an answer');
      return;
    }

    setLoading(true);
    try {
      await forumService.createAnswer(post.id, answerContent.trim());
      toast.success('Answer posted successfully!');
      setAnswerContent('');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to post answer');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsSolved = async () => {
    try {
      await forumService.markAsSolved(post.id);
      toast.success('Post marked as solved!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to mark as solved');
    }
  };

  const handleEndorseAnswer = async (answerId: string) => {
    if (endorsingAnswers.has(answerId)) return;

    setEndorsingAnswers(prev => new Set(prev).add(answerId));
    try {
      await forumService.endorseAnswer(answerId);
      toast.success('Answer endorsed!');
      onUpdate();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to endorse answer');
    } finally {
      setEndorsingAnswers(prev => {
        const newSet = new Set(prev);
        newSet.delete(answerId);
        return newSet;
      });
    }
  };

  const isPostAuthor = user?.id === post.userId;

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
            className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex-shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {post.solved && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                        <CheckCircle size={16} />
                        Solved
                      </span>
                    )}
                    <span className="text-sm text-gray-600">{post.cohort.name}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                        {post.user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{post.user.name}</span>
                    </div>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye size={14} />
                      {post.views} views
                    </span>
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Post Content */}
              <div className="p-6 border-b border-gray-100">
                <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
                
                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Mark as Solved Button */}
                {isPostAuthor && !post.solved && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkAsSolved}
                    className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-medium"
                  >
                    <CheckCircle size={18} />
                    Mark as Solved
                  </motion.button>
                )}
              </div>

              {/* Answers Section */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  {post.answers?.length || 0} Answers
                </h3>

                {post.answers && post.answers.length > 0 ? (
                  <div className="space-y-4">
                    {post.answers.map((answer, index) => (
                      <motion.div
                        key={answer.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-xl p-4"
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {answer.user.name.charAt(0).toUpperCase()}
                          </div>

                          {/* Answer Content */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-gray-900">{answer.user.name}</span>
                              <span className="text-sm text-gray-500">
                                {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true })}
                              </span>
                              {answer.isCorrect && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  <Award size={12} />
                                  Best Answer
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 whitespace-pre-wrap mb-3">{answer.content}</p>
                            
                            {/* Endorse Button */}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleEndorseAnswer(answer.id)}
                              disabled={endorsingAnswers.has(answer.id)}
                              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50"
                            >
                              <ThumbsUp size={14} className={answer.endorsements > 0 ? 'text-indigo-600' : 'text-gray-600'} />
                              <span className={answer.endorsements > 0 ? 'text-indigo-600' : 'text-gray-600'}>
                                {answer.endorsements}
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500">No answers yet. Be the first to answer!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Answer Form */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <form onSubmit={handleSubmitAnswer} className="space-y-3">
                <textarea
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  placeholder="Write your answer..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                />
                <div className="flex items-center justify-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading || !answerContent.trim()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Posting...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Post Answer
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
