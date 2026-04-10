import { Link } from 'react-router-dom';
import { logout } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Shield, UserRound } from 'lucide-react';

export const Navbar = () => {
  const { data: user } = useAuth();
  const userInitial = user?.name?.charAt(0).toUpperCase() ?? 'R';

  return (
    <nav className="sticky top-0 z-10 border-b border-border/80 bg-card/95 backdrop-blur px-4 md:px-6 py-3 flex justify-between items-center">
      <Link to="/dashboard" className="flex items-center gap-2.5 text-primary rounded-lg transition-all duration-200 motion-reduce:transition-none hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Shield size={16} strokeWidth={2.5} />
        </span>
        <span className="font-black text-lg tracking-tight text-foreground">ZeroDay</span>
      </Link>

      <div className="flex items-center">
        <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background p-1.5">
        {user && (
          <Link
            to="/profile"
            className="hidden md:flex items-center gap-3 rounded-md px-3 py-2 hover:bg-card transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <div className="h-8 w-8 rounded-md bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs">
              {userInitial}
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-black text-foreground">{user.name}</span>
              <span className="text-[10px] mt-1 text-muted-foreground">{user.email}</span>
            </div>
            <UserRound size={14} className="text-muted-foreground" />
          </Link>
        )}

        <button
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-xs md:text-sm font-bold text-muted-foreground hover:bg-card hover:text-destructive transition-all duration-200 motion-reduce:transition-none active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Terminate Session</span>
        </button>
        </div>
      </div>
    </nav>
  );
};