import { Link, useLocation } from 'react-router-dom';
import { Building2, Heart, LayoutDashboard, LogIn, LogOut, Menu, Search, X, Calculator, ArrowLeftRight, Sparkles, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useFavorites } from '@/lib/favorites';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { favorites } = useFavorites();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully');
  };

  const mainLinks = [
    { to: '/', label: 'Home', icon: Building2 },
    ...(user ? [
      { to: '/properties', label: 'Properties', icon: Search },
      { to: '/favorites', label: 'Favorites', icon: Heart, badge: favorites.length },
    ] : []),
  ];

  const toolLinks = [
    { to: '/emi-calculator', label: 'EMI Calculator', icon: Calculator },
    ...(user ? [
      { to: '/compare', label: 'Compare', icon: ArrowLeftRight },
      { to: '/ai-recommend', label: 'Smart Assist', icon: Sparkles },
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/inquiries', label: 'Inquiries', icon: MessageSquare },
    ] : []),
  ];

  const allLinks = [...mainLinks, ...toolLinks] as Array<{ to: string; label: string; icon: React.ElementType; badge?: number }>;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg hero-gradient flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">PropNest</span>
        </Link>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-0.5">
          {mainLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                isActive(l.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
              {l.badge ? (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {l.badge}
                </span>
              ) : null}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          {toolLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive(l.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <l.icon className="w-3.5 h-3.5" />
              {l.label}
            </Link>
          ))}

          <div className="w-px h-6 bg-border mx-1" />

          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/login')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-border bg-card p-4 space-y-1">
          {allLinks.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive(l.to)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <l.icon className="w-4 h-4" />
              {l.label}
              {l.badge ? (
                <span className="ml-auto w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-bold">
                  {l.badge}
                </span>
              ) : null}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { handleLogout(); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary w-full"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive('/login')
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
