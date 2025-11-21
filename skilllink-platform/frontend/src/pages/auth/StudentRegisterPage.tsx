import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../context/AuthContext';

interface StudentRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function StudentRegisterPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { refreshUser, user, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<StudentRegisterForm>();

  // Debug: Log token on component mount
  useState(() => {
    console.log('Registration page loaded with token:', token);
  });

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully. You can now register.');
  };

  const onSubmit = async (data: StudentRegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid invite link - No token found in URL');
      console.error('No token in URL params');
      return;
    }

    console.log('Attempting registration with token:', token);
    setLoading(true);
    try {
      await authService.registerStudent({
        name: data.name,
        email: data.email,
        password: data.password,
        inviteToken: token
      });
      await refreshUser(); // Update auth context with user data
      toast.success('Registration successful!');
      navigate('/student');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-red-50/30 to-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-red/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex max-w-4xl w-full glass rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl border border-white/30"
      >
        {/* Left Panel - Branded */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-brand-red to-red-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-8"
            >
              <img 
                src="https://res.cloudinary.com/dwiewdn6f/image/upload/v1763405995/semicolon_wlxrru.png" 
                alt="SkillLink Logo" 
                className="w-20 h-20 mx-auto rounded-2xl mb-6 object-cover"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              SkillLink
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-white/90"
            >
              Empowering the future of learning, one assignment at a time.
            </motion.p>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full md:w-1/2 p-12 bg-white/60 backdrop-blur-md">
          <div className="max-w-md mx-auto">
            {/* Show logout option if already logged in */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <p className="text-sm text-yellow-800 mb-2">
                  You're currently logged in as <strong>{user.name}</strong> ({user.role})
                </p>
                <button
                  onClick={handleLogout}
                  className="text-sm text-brand-red hover:text-red-700 font-semibold"
                >
                  Logout to register a new account
                </button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600 mb-2">Join the community</p>
              
              {/* Debug: Show token status */}
              {!token && (
                <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-600">
                  ⚠️ No invite token detected in URL
                </div>
              )}
              {token && (
                <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-600">
                  ✓ Valid invite link detected
                </div>
              )}
            </motion.div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' }
                  })}
                  type="password"
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  {...register('confirmPassword', { required: 'Please confirm password' })}
                  type="password"
                  disabled={!!user}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                disabled={loading || !!user}
                className="w-full bg-brand-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : user ? 'Logout first to register' : 'Sign Up'}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">Already have an account? </span>
              <Link to="/login" className="text-brand-red hover:text-red-700 font-semibold">
                Log In
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
