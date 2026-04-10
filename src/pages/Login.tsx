import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../api/auth';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password });
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (err: unknown) {
      // Catch 401 (Wrong password) or 422 (Bad email format)
      setError((err as { response?: { data?: { message?: string } } }).response?.data?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-center text-3xl font-black text-gray-900 tracking-tight">
            ZeroDay Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500">
            Enter your researcher credentials to access the feed.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <input
              type="email"
              required
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              required
              className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gray-900 hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Access Terminal'}
          </button>
            <div className='flex items-center justify-center gap-3'>
              <p className="text-center text-sm text-gray-500">
                Don't have an account?{' '} </p>
                <Link to="/register" className="font-bold text-gray-900 hover:underline inline-flex items-center underline  transition">
                  Create Identity
                </Link>
            </div>
        </form>
      </div>
    </div>
  );
};