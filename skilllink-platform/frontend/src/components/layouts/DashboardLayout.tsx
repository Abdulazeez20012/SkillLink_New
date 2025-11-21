import { ReactNode, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  GraduationCap,
  Menu,
  X,
  Bell,
  Settings,
  User,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import toast from 'react-hot-toast';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getNavItems = () => {
    if (user?.role === UserRole.ADMIN) {
      return [
        { path: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/admin/cohorts', label: 'Cohorts', icon: <BookOpen size={20} /> },
        { path: '/admin/facilitators', label: 'Facilitators', icon: <Users size={20} /> },
        { path: '/admin/students', label: 'Students', icon: <GraduationCap size={20} /> }
      ];
    }
    if (user?.role === UserRole.FACILITATOR) {
      return [
        { path: '/facilitator', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/facilitator/cohorts', label: 'My Cohorts', icon: <BookOpen size={20} /> }
      ];
    }
    if (user?.role === UserRole.STUDENT) {
      return [
        { path: '/student', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/student/assignments', label: 'Assignments', icon: <BookOpen size={20} /> },
        { path: '/student/progress', label: 'Progress', icon: <GraduationCap size={20} /> },
        { path: '/student/attendance', label: 'Attendance', icon: <Calendar size={20} /> },
        { path: '/student/forum', label: 'Forum', icon: <MessageSquare size={20} /> }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763405995/semicolon_wlxrru.png" 
                alt="SkillLink Logo" 
                className="w-7 h-7 rounded-lg object-cover"
              />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="text-xl font-bold tracking-tight"
              >
                <span className="text-gray-900">Skill</span>
                <span className="text-brand-red">Link</span>
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-sm transition-all ${
                        isActive
                          ? 'bg-brand-red text-white shadow-sm'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-full hover:bg-gray-100 relative"
              >
                <Bell size={18} className="text-gray-700" />
                <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-brand-red rounded-full"></span>
              </motion.button>

              {/* User Menu */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                </motion.button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-200"
                    >
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm">
                        <User size={14} />
                        <span>Profile</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700 text-sm">
                        <Settings size={14} />
                        <span>Settings</span>
                      </button>
                      <hr className="my-1 border-gray-200" />
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left hover:bg-red-50 flex items-center gap-2 text-red-600 font-medium text-sm"
                      >
                        <LogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200/50"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                        isActive
                          ? 'bg-brand-red text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
