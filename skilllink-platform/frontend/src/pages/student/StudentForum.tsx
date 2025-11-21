import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Plus, Search, Filter, CheckCircle, 
  Eye, MessageCircle, Tag, TrendingUp, Clock
} from 'lucide-react';
import { forumService, ForumPost } from '../../services/forum.service';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import ForumPostCreateModal from '../../components/forum/ForumPostCreateModal';
import ForumPostDetailModal from '../../components/forum/ForumPostDetailModal';

export default function StudentForum() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSolved, setFilterSolved] = useState<boolean | undefined>(undefined);
  const [selectedTag, setSelectedTag] = useState<string>('');

  useEffect(() => {
    fetchPosts();
  }, [filterSolved, selectedTag]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const filters: any = {};
      if (filterSolved !== undefined) filters.solved = filterSolved;
      if (selectedTag) filters.tag = selectedTag;
      
      const data = await forumService.getPosts(filters);
      setPosts(data);
    } catch (error: any) {
      toast.error('Failed to load forum posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostClick = async (post: ForumPost) => {
    try {
      const fullPost = await forumService.getPostById(post.id);
      setSelectedPost(fullPost);
    } catch (error) {
      toast.error('Failed to load post details');
    }
  };

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts by search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = [
    {
      label: 'Total Posts',
      value: posts.length,
      icon: MessageSquare,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Solved',
      value: posts.filter(p => p.solved).length,
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      label: 'Unsolved',
      value: posts.filter(p => !p.solved).length,
      icon: MessageCircle,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      label: 'My Posts',
      value: posts.filter(p => p.userId === user?.id).length,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -ml-48 -mb-48" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3 mb-4"
              >
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <MessageSquare className="text-white" size={24} />
                </div>
                <span className="text-white/90 font-medium">Discussion Forum</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-3"
              >
                Community Forum
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-white/90 text-lg max-w-2xl"
              >
                Ask questions, share knowledge, and collaborate with your peers
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
            >
              <Plus size={20} />
              <span>New Post</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow" />
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                  <stat.icon className={stat.iconColor} size={24} />
                </div>
              </div>
              <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Filter by Status */}
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filterSolved === undefined ? 'all' : filterSolved ? 'solved' : 'unsolved'}
              onChange={(e) => {
                const value = e.target.value;
                setFilterSolved(value === 'all' ? undefined : value === 'solved');
              }}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="all">All Posts</option>
              <option value="unsolved">Unsolved</option>
              <option value="solved">Solved</option>
            </select>
          </div>

          {/* Filter by Tag */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          )}
        </div>
      </motion.div>

      {/* Posts List */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
          />
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => handlePostClick(post)}
              className="group relative cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md group-hover:shadow-xl transition-all" />
              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {post.user.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                          {post.title}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span className="font-medium">{post.user.name}</span>
                          <span>•</span>
                          <span>{post.cohort.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </div>
                      {post.solved && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold flex-shrink-0">
                          <CheckCircle size={16} />
                          Solved
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.content}</p>

                    {/* Tags */}
                    {post.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        {post.tags.map(tag => (
                          <span
                            key={tag}
                            className="flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-medium"
                          >
                            <Tag size={12} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Eye size={16} />
                        <span>{post.views} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle size={16} />
                        <span>{post._count?.answers || 0} answers</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare size={40} className="text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No posts found</h3>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {searchQuery || selectedTag || filterSolved !== undefined
              ? 'Try adjusting your filters or search query'
              : 'Be the first to start a discussion!'}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all"
          >
            Create Your First Post
          </motion.button>
        </motion.div>
      )}

      {/* Create Post Modal */}
      <ForumPostCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchPosts();
          setShowCreateModal(false);
        }}
      />

      {/* Post Detail Modal */}
      {selectedPost && (
        <ForumPostDetailModal
          post={selectedPost}
          isOpen={!!selectedPost}
          onClose={() => setSelectedPost(null)}
          onUpdate={fetchPosts}
        />
      )}
    </div>
  );
}
