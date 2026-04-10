import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { registerSchema } from '../types/schemas';
import type { RegisterFormData } from '../types/schemas';
import  { registerUser } from '../api/auth';
import { UserPlus, AlertCircle } from 'lucide-react';
import appLogo from '../assets/image.png';

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
    <div className="min-h-screen bg-background text-foreground px-4 py-8 md:py-14 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
            <img src={appLogo} alt="ZeroDay logo" className="h-12 w-12 object-contain scale-[1.8]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Create Identity</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Join the ZeroDay network to begin reporting.
          </p>
        </div>

        {serverError && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-bold text-destructive">
            <AlertCircle size={18} />
            <span>{serverError}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Full Name</label>
            <input
              {...register('name')}
              type="text"
              placeholder="e.g. John Doe"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.name ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            />
            {errors.name && <p className="mt-1 text-xs font-semibold text-destructive">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Email Address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="hacker@zeroday.com"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.email ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            />
            {errors.email && <p className="mt-1 text-xs font-semibold text-destructive">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Terminal Password</label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.password ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            />
            {errors.password && <p className="mt-1 text-xs font-semibold text-destructive">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Confirm Password</label>
            <input
              {...register('password_confirmation')}
              type="password"
              placeholder="••••••••"
              className={`w-full rounded-lg border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none ${errors.password_confirmation ? 'border-destructive/60 focus-visible:ring-destructive/50' : 'border-border hover:border-primary/40'} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            />
            {errors.password_confirmation && <p className="mt-1 text-xs font-semibold text-destructive">{errors.password_confirmation.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-black text-primary-foreground transition-all duration-200 motion-reduce:transition-none hover:opacity-90 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {isLoading ? 'Encrypting Identity...' : (
              <>
                <UserPlus size={18} />
                <span>Initialize Account</span>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm font-bold text-muted-foreground">
          Existing researcher? {' '}
          <Link to="/login" className="text-primary hover:underline">
            Login to Terminal
          </Link>
        </p>
      </div>
    </div>
  );
};