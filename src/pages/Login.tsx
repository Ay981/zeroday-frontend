import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';
import { sileo } from "sileo";
import { Shield, Key, AlertCircle } from 'lucide-react';

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4 text-blue-600">
            <Shield size={42} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tight">ZeroDay Login</h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            Enter your researcher credentials to access the feed.
          </p>
        </div>

        {/* Local Error Feedback */}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="hacker@zeroday.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1 ml-1">Terminal Password</label>
              <input
                type="password"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all active:scale-[0.98]"
          >
            <Key size={18} />
            <span>Initialize Session</span>
          </button>

          <div className="flex items-center justify-center gap-2 pt-4">
            <p className="text-sm text-gray-400 font-medium">New researcher?</p>
            <Link 
              to="/register" 
              className="text-sm font-black text-gray-600 hover:text-gray-900 underline underline-offset-4"
            >
              Create Identity
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};