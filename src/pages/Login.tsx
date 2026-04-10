import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { sileo } from "sileo";
import { Key, AlertCircle } from 'lucide-react';
import appLogo from '../assets/image.png';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    // Wrap the login call in a Sileo Promise for professional UX
    const loginPromise = login({ email, password });

    sileo.promise(loginPromise, {
      loading: { title: "Decrypting Credentials..." },
      success: { title: "Access Granted" },
      error: (err: unknown) => ({
        title: "Breach Detected",
        description:
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
            ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
            : "Access Denied",
      }),
    });

    try {
      await loginPromise;
      // Slight delay (800ms) so user can see the "Success" toast before redirect
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-8 md:py-14 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 rounded-2xl border border-border bg-card p-8 md:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground">
            <img src={appLogo} alt="ZeroDay logo" className="h-12 w-12 object-contain scale-[1.8]" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">ZeroDay Login</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your researcher credentials to access the feed.
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-bold text-destructive">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Email Address</label>
              <input
                type="email"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                placeholder="hacker@zeroday.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Terminal Password</label>
              <input
                type="password"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3.5 font-black text-primary-foreground transition-all duration-200 motion-reduce:transition-none hover:opacity-90 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Key size={18} />
            <span>Initialize Session</span>
          </button>

          <div className="flex items-center justify-center gap-2 pt-4">
            <p className="text-sm text-muted-foreground font-medium">New researcher?</p>
            <Link 
              to="/register" 
              className="text-sm font-black text-primary hover:opacity-80 underline underline-offset-4"
            >
              Create Identity
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};