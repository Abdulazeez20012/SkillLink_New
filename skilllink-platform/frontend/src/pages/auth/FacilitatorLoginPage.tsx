import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

interface FacilitatorLoginForm {
  email: string;
  password: string;
  accessCode: string;
}

export default function FacilitatorLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FacilitatorLoginForm>();

  const onSubmit = async (data: FacilitatorLoginForm) => {
    setLoading(true);
    try {
      await authService.facilitatorLogin(data);
      toast.success('Login successful!');
      navigate('/facilitator');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Facilitator Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Back to standard login
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register('email', { required: 'Email is required' })}
                type="email"
                className="input"
                placeholder="Email address"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <input
                {...register('password', { required: 'Password is required' })}
                type="password"
                className="input"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <div>
              <input
                {...register('accessCode', { 
                  required: 'Access code is required',
                  minLength: { value: 6, message: 'Access code must be 6 characters' },
                  maxLength: { value: 6, message: 'Access code must be 6 characters' }
                })}
                type="text"
                className="input uppercase"
                placeholder="Access Code (6 characters)"
                maxLength={6}
              />
              {errors.accessCode && <p className="text-red-500 text-sm mt-1">{errors.accessCode.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Signing in...' : 'Sign in as Facilitator'}
          </button>
        </form>
      </div>
    </div>
  );
}
