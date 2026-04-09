import { logout } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Shield, User } from 'lucide-react';

export const Navbar = () => {
  const { data: user, isLoading } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10 shadow-sm">
      <div className="flex items-center space-x-2 text-blue-600">
        <Shield size={20} strokeWidth={3} />
        <span className="font-black text-lg tracking-tight text-gray-900">ZeroDay</span>
      </div>

      <div className="flex items-center space-x-6">
        {user && (
          <div className="hidden md:flex items-center space-x-2 text-gray-600">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <User size={16} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-gray-900 leading-none">{user.name}</span>
              <span className="text-[10px] font-medium text-gray-400">{user.email}</span>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="flex items-center space-x-2 text-gray-400 hover:text-red-600 transition text-sm font-bold border-l pl-6"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Terminate Session</span>
        </button>
      </div>
    </nav>
  );
};