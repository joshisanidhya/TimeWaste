import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore, type ThemeMode } from '@/store/useAppStore';
import { TechBackground } from '@/components/TechBackground';
import {
  LogOut,
  Flame,
  Menu,
  X,
  Moon,
  Sun,
  Laptop,
  LogIn,
  UserPlus,
  ChevronRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavLink {
  name: string;
  path: string;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, theme, setTheme, logout } = useAppStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = user && !user.isGuest;

  const publicLinks: NavLink[] = [
    { name: 'HOME', path: '/' },
    { name: 'LABS', path: '/labs' },
    { name: 'LEADERBOARD', path: '/leaderboard' },
  ];

  const authenticatedLinks: NavLink[] = [
    ...publicLinks,
    { name: 'PROFILE', path: '/profile' },
    { name: 'SETTINGS', path: '/settings' },
  ];

  const links = isAuthenticated ? authenticatedLinks : publicLinks;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const cycleTheme = () => {
    const nextTheme: Record<ThemeMode, ThemeMode> = {
      dark: 'light',
      light: 'system',
      system: 'dark',
    };
    setTheme(nextTheme[theme]);
  };

  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const streak = user?.streak || 1;
  const xpInCurrentLevel = xp % 500;
  const xpProgressPercent = (xpInCurrentLevel / 500) * 100;

  return (
    <div
      className="min-h-screen flex flex-col font-sans relative overflow-hidden"
      style={{
        background: 'var(--bg-carbon)',
        color: 'var(--text-primary)',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      <TechBackground />

      {/* ─── Navigation ─── */}
      <header
        className="sticky top-0 z-50"
        style={{
          borderBottom: '1px solid var(--border-subtle)',
          background: 'color-mix(in srgb, var(--bg-carbon) 90%, transparent)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            style={{ textDecoration: 'none' }}
          >
            {/* Signal mark */}
            <div
              className="flex items-center justify-center"
              style={{
                width: 22,
                height: 22,
                border: '1.5px solid var(--signal)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  fontWeight: 900,
                  color: 'var(--signal)',
                  letterSpacing: '-0.02em',
                }}
              >
                PL
              </span>
            </div>
            <span
              style={{
                fontWeight: 900,
                fontSize: '0.875rem',
                letterSpacing: '0.1em',
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
              }}
            >
              PLAYORITHM
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? 'var(--signal-text)' : 'var(--text-tertiary)',
                    transition: 'color 0.15s ease',
                    fontWeight: isActive ? 700 : 400,
                  }}
                  onMouseEnter={(e) =>
                    !isActive && ((e.target as HTMLElement).style.color = 'var(--text-secondary)')
                  }
                  onMouseLeave={(e) =>
                    !isActive && ((e.target as HTMLElement).style.color = 'var(--text-tertiary)')
                  }
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-3">
            {isAuthenticated ? (
              <>
                {/* Streak & XP — desktop */}
                <div
                  className="hidden lg:flex items-center gap-4 pr-3 mr-1"
                  style={{ borderRight: '1px solid var(--border-subtle)' }}
                >
                  {/* Streak */}
                  <div
                    className="flex items-center gap-1"
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      color: 'var(--cat-fun)',
                    }}
                  >
                    <Flame size={12} />
                    <span>{streak}D</span>
                  </div>

                  {/* XP */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.1em',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        LVL {level}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        {xpInCurrentLevel}/500
                      </span>
                    </div>
                    <div
                      style={{
                        width: 72,
                        height: 2,
                        background: 'var(--bg-surface)',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${xpProgressPercent}%`,
                          height: '100%',
                          background: 'var(--signal)',
                          borderRadius: 1,
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2"
                  style={{ textDecoration: 'none' }}
                >
                  <img
                    src={user?.avatar}
                    alt={user?.username}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      border: '1px solid var(--border-default)',
                      background: 'var(--bg-surface)',
                    }}
                  />
                  <span
                    className="hidden sm:inline"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {user?.username.split('_')[0]}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  title="Log out"
                  style={{
                    padding: '6px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 4,
                    transition: 'color 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = '#ef4444')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')
                  }
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth?mode=login"
                  className="hidden md:inline-flex items-center gap-1.5"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: 'var(--text-tertiary)',
                    padding: '5px 10px',
                    border: '1px solid var(--border-default)',
                    transition: 'color 0.15s ease, border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.color = 'var(--text-primary)';
                    el.style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.color = 'var(--text-tertiary)';
                    el.style.borderColor = 'var(--border-default)';
                  }}
                >
                  <LogIn size={12} />
                  LOG IN
                </Link>

                <Link
                  to="/auth?mode=signup"
                  data-cursor="open"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.625rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: 'var(--bg-obsidian)',
                    background: 'var(--signal)',
                    padding: '5px 12px',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'opacity 0.15s ease',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = '0.85')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.opacity = '1')
                  }
                >
                  <UserPlus size={11} />
                  GET STARTED
                </Link>
              </div>
            )}

            {/* Theme toggle */}
            <button
              onClick={cycleTheme}
              title={`Theme: ${theme.toUpperCase()}`}
              style={{
                padding: '6px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-tertiary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text-primary)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')
              }
            >
              {theme === 'dark' ? (
                <Moon size={16} />
              ) : theme === 'light' ? (
                <Sun size={16} />
              ) : (
                <Laptop size={16} />
              )}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden"
              style={{
                padding: '6px',
                background: 'transparent',
                border: '1px solid var(--border-default)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* ─── Mobile Menu ─── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden relative z-40 overflow-hidden"
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              background: 'var(--bg-elevated)',
            }}
          >
            <div className="px-5 py-4 flex flex-col gap-1">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: isActive ? 'var(--signal-text)' : 'var(--text-secondary)',
                      padding: '10px 0',
                      borderBottom: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {link.name}
                    <ChevronRight size={14} style={{ opacity: 0.4 }} />
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="flex gap-3 pt-3">
                  <Link
                    to="/auth?mode=login"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'var(--text-secondary)',
                      padding: '10px',
                      border: '1px solid var(--border-default)',
                    }}
                  >
                    LOG IN
                  </Link>
                  <Link
                    to="/auth?mode=signup"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.625rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'var(--bg-obsidian)',
                      background: 'var(--signal)',
                      padding: '10px',
                      fontWeight: 700,
                    }}
                  >
                    GET STARTED
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Main Content ─── */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 sm:px-8 py-8 z-10">
        {children}
      </main>

      {/* ─── Footer ─── */}
      <footer
        className="relative z-10"
        style={{
          borderTop: '1px solid var(--border-subtle)',
          background: 'var(--bg-obsidian)',
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {/* Brand */}
            <div className="md:col-span-1 space-y-3">
              <div className="flex items-center gap-2">
                <div
                  style={{
                    width: 18,
                    height: 18,
                    border: '1.5px solid var(--signal)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.4rem', fontWeight: 900, color: 'var(--signal)' }}>PL</span>
                </div>
                <span style={{ fontWeight: 900, fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>PLAYORITHM</span>
              </div>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: 240 }}>
                Digital experimental laboratory for developers. AI, ML, probability, algorithms, and games.
              </p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', opacity: 0.6 }}>
                STATUS: ALL SYSTEMS OPERATIONAL · v1.0
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="section-label mb-4">PRODUCT</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'Experiment Catalogue', path: '/labs' },
                  { label: 'Leaderboard', path: '/leaderboard' },
                  { label: 'Developer Profile', path: '/profile' },
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-tertiary)')}
                    >{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Labs */}
            <div>
              <h4 className="section-label mb-4">FLAGSHIP LABS</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'GitHub Roast AI', path: '/labs/github-roast' },
                  { label: 'Salary Predictor', path: '/labs/salary-predictor' },
                  { label: 'Monte Carlo Simulator', path: '/labs/monte-carlo' },
                  { label: 'Interview Simulator', path: '/labs/interview-simulator' },
                ].map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-tertiary)')}
                    >{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Project */}
            <div>
              <h4 className="section-label mb-4">PROJECT</h4>
              <ul className="space-y-2.5">
                {[
                  { label: 'GitHub Repository', href: 'https://github.com' },
                  { label: 'LinkedIn Showcase', href: 'https://linkedin.com' },
                ].map((l) => (
                  <li key={l.label}>
                    <a href={l.href} target="_blank" rel="noreferrer" style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', textDecoration: 'none', transition: 'color 0.15s ease' }}
                      onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text-primary)')}
                      onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-tertiary)')}
                    >{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5625rem', letterSpacing: '0.1em', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}
          >
            <div>© {new Date().getFullYear()} PLAYORITHM — OPEN SOURCE DEVELOPER PLATFORM</div>
            <div>BUILT WITH REACT · VITE · EXPRESS · PRISMA</div>
          </div>
        </div>
      </footer>
    </div>
  );
};
