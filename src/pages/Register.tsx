import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema } from '../types/schemas';
import type { RegisterFormData } from '../types/schemas';
import  { registerUser } from '../api/auth';
import { Shield, UserPlus, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setServerError(null);

    try {
      await registerUser(data);
      // Hard refresh to reset React Query and detect the new token
      window.location.href = '/dashboard';
    } catch (err: unknown) {
      // Catch Laravel's "Email already taken" or other server errors
      setServerError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4 text-blue-600">
            <Shield size={40} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">Create Identity</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Join the ZeroDay network to begin reporting.
          </p>
        </div>

        {/* Server-side Error Alert */}
        {serverError && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 animate-shake">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Name Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Full Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. John Doe"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="hacker@zeroday.com"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Terminal Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.password && <p className="mt-1 text-xs text-red-500 font-bold">{errors.password.message}</p>}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-400 mb-1 ml-1">Confirm Password</label>
            <input
              {...register('password_confirmation')}
              type="password"
              placeholder="••••••••"
              className={`w-full px-4 py-3 rounded-xl border outline-none transition ${errors.password_confirmation ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-blue-500'}`}
            />
            {errors.password_confirmation && <p className="mt-1 text-xs text-red-500 font-bold">{errors.password_confirmation.message}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? 'Encrypting Identity...' : (
              <>
                <UserPlus size={18} />
                <span>Initialize Account</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm font-bold text-gray-400">
          Existing researcher? {' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login to Terminal
          </Link>
        </p>
      </div>
    </div>
  );
};