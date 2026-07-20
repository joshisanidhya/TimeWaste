import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { LabIcon } from '@/components/LabIcon';
import { 
  LogOut, 
  Flame, 
  Menu, 
  X, 
  Moon, 
  Sun 
} from 'lucide-react';

interface SidebarLink {
  name: string;
  path: string;
  icon: string;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, theme, setTheme, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links: SidebarLink[] = [
    { name: 'Home', path: '/', icon: 'Home' },
    { name: 'Labs', path: '/labs', icon: 'LayoutGrid' },
    { name: 'Leaderboard', path: '/leaderboard', icon: 'Trophy' },
    { name: 'Profile', path: '/profile', icon: 'User' },
    { name: 'Settings', path: '/settings', icon: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  if (!user) {
    return <>{children}</>;
  }

  // XP calculations
  const xpInCurrentLevel = user.xp % 500;
  const xpProgressPercent = (xpInCurrentLevel / 500) * 100;

  return (
    <div className="min-h-screen bg-bg-dark text-zinc-100 flex flex-col font-sans">
      {/* Background ambient glows */}
      <div className="ambient-glow -top-40 -left-40 bg-indigo-500/10"></div>
      <div className="ambient-glow top-1/2 -right-40 bg-pink-500/10"></div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border-dark glass-panel backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 font-semibold text-lg tracking-wider">
              <span className="p-1.5 bg-violet-600 rounded-lg text-white">
                <LabIcon name="Sparkles" size={18} />
              </span>
              <span className="text-white font-extrabold tracking-tight">
                Play<span className="text-violet-400">orithm</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive 
                        ? 'bg-violet-500/10 text-violet-400 border border-violet-500/20' 
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Status and Quick Action Controls */}
          <div className="flex items-center gap-4">
            {/* Gamification Streak & XP */}
            <div className="hidden sm:flex items-center gap-4 border-r border-border-dark pr-4 mr-2">
              {/* Streak */}
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg text-xs font-semibold border border-amber-500/20">
                <Flame size={14} className="fill-amber-500" />
                <span>{user.streak} Day Streak</span>
              </div>

              {/* XP Level Bar */}
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-medium text-zinc-400">
                  LVL <span className="text-white font-bold">{user.level}</span>
                </span>
                <div className="w-28 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${xpProgressPercent}%` }}
                  ></div>
                </div>
                <span className="text-[10px] text-zinc-500">{xpInCurrentLevel}/500 XP</span>
              </div>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-white/5 border border-transparent hover:border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-all"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Profile Dropdown Trigger */}
            <div className="flex items-center gap-3">
              <Link to="/profile" className="flex items-center gap-2">
                <img 
                  src={user.avatar} 
                  alt={user.username} 
                  className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 hover:scale-105 transition-transform"
                />
                <span className="hidden lg:inline text-sm font-medium text-zinc-200 hover:text-white">
                  {user.username.split('_')[0]}
                </span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/5 transition-all"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-zinc-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border-dark glass-panel backdrop-blur-md absolute top-16 left-0 right-0 z-30 py-4 px-4 flex flex-col gap-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-violet-500/10 text-violet-400' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="flex items-center justify-between border-t border-border-dark pt-4 mt-2">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-amber-500" />
              <span className="text-xs text-zinc-300 font-medium">{user.streak} Day Streak</span>
            </div>
            <div className="text-xs text-zinc-400">
              Level {user.level} • {user.xp % 500}/500 XP
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border-dark py-8 bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Playorithm. Built with Passion by Developers for Developers.
          </div>
          <div className="flex items-center gap-6 text-sm text-zinc-400">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">GitHub</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
