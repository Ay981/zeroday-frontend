import { logout } from '../api/auth';
import { LogOut, Shield } from 'lucide-react';

export const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center space-x-2 text-blue-600">
        <Shield size={20} strokeWidth={3} />
        <span className="font-black text-lg tracking-tight text-gray-900">ZeroDay</span>
      </div>

      <button
        onClick={logout}
        className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition text-sm font-bold"
      >
        <LogOut size={16} />
        <span>Logout</span>
      </button>
    </nav>
  );
};