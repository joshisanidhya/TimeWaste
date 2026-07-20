import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { motion } from 'framer-motion';
import { Sparkles, Terminal, Shield } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const loginAsGuest = useAppStore((state) => state.loginAsGuest);
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'guest' | 'login' | 'signup'>('guest');
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      loginAsGuest(username.trim() || undefined);
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock standard authentication
    setTimeout(() => {
      const mockProfile = {
        username: email.split('@')[0],
        email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
        xp: 0,
        level: 1,
        streak: 1,
        lastActive: new Date().toISOString(),
        isGuest: false,
        achievements: [],
        bookmarks: [],
        history: [],
      };
      useAppStore.getState().loginWithToken('mock-jwt-token', mockProfile);
      setIsLoading(false);
      navigate('/');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="ambient-glow -top-20 -right-20 bg-violet-600/10"></div>
      <div className="ambient-glow -bottom-20 -left-20 bg-indigo-600/10"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md rounded-2xl glass-panel p-8 shadow-2xl relative z-10 border border-zinc-800"
      >
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-violet-600/10 text-violet-400 rounded-2xl border border-violet-500/20 mb-4">
            <Sparkles size={32} className="animate-pulse" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Play<span className="text-violet-400">orithm</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-2">
            Where Developers Play with Intelligence.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-border-dark mb-6">
          {(['guest', 'login', 'signup'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setMode(t)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all ${
                mode === t
                  ? 'bg-zinc-800 text-white shadow-md'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {t === 'guest' ? 'Guest Access' : t}
            </button>
          ))}
        </div>

        {mode === 'guest' ? (
          <form onSubmit={handleGuestLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Choose a Handle / Username
              </label>
              <div className="relative">
                <Terminal size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  placeholder="e.g. LambdaCoder (Optional)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  maxLength={15}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-zinc-200 text-sm placeholder-zinc-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                'Enter Playground'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="dev@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-200 text-sm placeholder-zinc-600"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-200 text-sm placeholder-zinc-600"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-zinc-100 hover:bg-white text-zinc-950 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : mode === 'login' ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-6 flex items-center justify-center gap-3">
          <div className="h-px bg-zinc-800 flex-1"></div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Or Continue With</span>
          <div className="h-px bg-zinc-800 flex-1"></div>
        </div>

        {/* OAuth Buttons */}
        <button
          onClick={() => {
            setIsLoading(true);
            setTimeout(() => {
              // Mock GitHub login
              const mockGitHubProfile = {
                username: 'Octocat',
                email: 'octocat@github.com',
                avatar: 'https://avatars.githubusercontent.com/u/5832347?v=4',
                xp: 150,
                level: 1,
                streak: 3,
                lastActive: new Date().toISOString(),
                isGuest: false,
                achievements: ['first-steps'],
                bookmarks: [],
                history: [],
              };
              useAppStore.getState().loginWithToken('github-oauth-token', mockGitHubProfile);
              setIsLoading(false);
              navigate('/');
            }, 1000);
          }}
          className="w-full py-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 text-zinc-300 font-medium text-sm flex items-center justify-center gap-3 transition-all hover:border-zinc-700"
        >
          <svg className="w-[18px] h-[18px] fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span>GitHub Account</span>
        </button>

        <p className="text-center text-[11px] text-zinc-500 mt-6 flex items-center justify-center gap-1">
          <Shield size={12} /> Secure sandbox workspace. No telemetry logs stored.
        </p>
      </motion.div>
    </div>
  );
};
