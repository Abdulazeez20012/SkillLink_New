import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { authService } from '../../services/auth.service';

interface StudentRegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function StudentRegisterPage() {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<StudentRegisterForm>();

  const onSubmit = async (data: StudentRegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!token) {
      toast.error('Invalid invite link');
      return;
    }

    setLoading(true);
    try {
      await authService.registerStudent({
        name: data.name,
        email: data.email,
        password: data.password,
        inviteToken: token
      });
      toast.success('Registration successful!');
      navigate('/student');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gray-900">
            Join SkillLink
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Register as a student
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div>
              <input
                {...register('name', { required: 'Name is required' })}
                type="text"
                className="input"
                placeholder="Full Name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
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
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' }
                })}
                type="password"
                className="input"
                placeholder="Password"
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            
            <div>
              <input
                {...register('confirmPassword', { required: 'Please confirm password' })}
                type="password"
                className="input"
                placeholder="Confirm Password"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
}
