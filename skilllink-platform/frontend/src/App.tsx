import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';
import FacilitatorLoginPage from './pages/auth/FacilitatorLoginPage';
import StudentRegisterPage from './pages/auth/StudentRegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import FacilitatorDashboard from './pages/facilitator/FacilitatorDashboard';
import StudentDashboard from './pages/student/StudentDashboard';
import { UserRole } from './types';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const getDashboardRoute = () => {
    if (!user) return '/login';
    switch (user.role) {
      case UserRole.ADMIN:
        return '/admin';
      case UserRole.FACILITATOR:
        return '/facilitator';
      case UserRole.STUDENT:
        return '/student';
      default:
        return '/login';
    }
  };

  return (
    <Routes>
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/admin/register" element={!user ? <AdminRegisterPage /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/facilitator/login" element={!user ? <FacilitatorLoginPage /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/register/student" element={!user ? <StudentRegisterPage /> : <Navigate to={getDashboardRoute()} />} />
      <Route path="/student/register/:token" element={!user ? <StudentRegisterPage /> : <Navigate to={getDashboardRoute()} />} />
      
      <Route
        path="/admin/*"
        element={user?.role === UserRole.ADMIN ? <AdminDashboard /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/facilitator/*"
        element={user?.role === UserRole.FACILITATOR ? <FacilitatorDashboard /> : <Navigate to="/login" />}
      />
      
      <Route
        path="/student/*"
        element={user?.role === UserRole.STUDENT ? <StudentDashboard /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
