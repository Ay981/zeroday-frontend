import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { sileo } from "sileo";
import { Key, CircleAlert, EyeOffIcon } from 'lucide-react';
import appLogo from '../assets/image.png';
import { EyeIcon } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  
  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }


  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError('');

    const promise = login.mutateAsync({ email, password });

    sileo.promise(promise, {
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
      await promise;
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

        {error && (() => {
          const friendlyError =
            /invalid|unauthorized|401|403|credential|password|email/i.test(error)
              ? "That email or password doesn't look right. Please try again."
              : /network|fetch|timeout|offline|internet/i.test(error)
              ? "We couldn’t reach the server. Please check your connection and try again."
              : /too many|rate limit|429/i.test(error)
              ? "Too many attempts. Please wait a moment before trying again."
              : "Something went wrong while signing you in. Please try again.";

          return (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-sm font-bold text-destructive">
              <CircleAlert size={18} />
              <span>{friendlyError}</span>
            </div>
          );
        })()}

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


            <div className="flex flex-col">
              <label className="mb-1 ml-1 block text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground self-start">Terminal Password</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-10 text-foreground outline-none transition-all duration-200 motion-reduce:transition-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-muted-foreground/80 focus:outline-none flex items-center justify-center"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
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