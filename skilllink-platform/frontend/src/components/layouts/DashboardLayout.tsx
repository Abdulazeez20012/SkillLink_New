import { ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, LayoutDashboard, Users, BookOpen, GraduationCap } from 'lucide-react';
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
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-primary-600">
                SkillLink
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">{user?.name}</span>
              <span className="badge badge-primary">{user?.role}</span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {navItems.length > 0 && (
          <div className="mb-6">
            <nav className="flex space-x-4">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        <main>{children}</main>
      </div>
    </div>
  );
}
