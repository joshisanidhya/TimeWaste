import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Wrench, ShieldAlert, Monitor, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Settings: React.FC = () => {
  const { user, theme, setTheme, logout } = useAppStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState(user?.username || '');
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    useAppStore.setState({
      user: {
        ...user,
        username: username.trim(),
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${username.trim()}`,
      }
    });

    setSuccess(true);
    setTimeout(() => setSuccess(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear your local profile, achievements, and streak? This action is irreversible.')) {
      localStorage.removeItem('playorithm-storage');
      logout();
      navigate('/auth');
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b border-border-dark pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Settings</h1>
        <p className="text-zinc-400 text-xs mt-1">Configure your local workspace credentials and dashboard parameters.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Editing Form */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Monitor size={16} className="text-violet-400" />
            <span>Workspace Profile</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-500 mb-1.5">Your Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-xl glass-input text-zinc-200 text-sm"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-1.5"
            >
              {success ? (
                <>
                  <Check size={12} />
                  <span>Saved Credentials</span>
                </>
              ) : (
                'Update Handle'
              )}
            </button>
          </form>
        </section>

        {/* Global theme selection */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
            <Wrench size={16} className="text-indigo-400" />
            <span>Visual Parameters</span>
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="block text-sm font-semibold text-zinc-200">Visual Theme</span>
              <span className="block text-zinc-500 text-[10px] mt-0.5">Toggle between dark obsidian and bright solar modes.</span>
            </div>
            
            <div className="flex bg-zinc-950 p-1 rounded-xl border border-border-dark">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                    theme === t
                      ? 'bg-zinc-800 text-white shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Diagnostic Developer Stats */}
        <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 space-y-4">
          <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Environment Telemetry</h3>
          <div className="grid grid-cols-2 gap-4 text-xs font-mono text-zinc-400">
            <div>
              <span className="text-[10px] text-zinc-500 block">Gateway Server Host</span>
              <span className="text-zinc-300">http://localhost:5000</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">ML Microservice Host</span>
              <span className="text-zinc-300">http://localhost:8000</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Telemetry Collector</span>
              <span className="text-zinc-300">OpenTelemetry / SigNoz</span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 block">Persistence State</span>
              <span className="text-zinc-300">localStorage / IndexedDB</span>
            </div>
          </div>
        </section>

        {/* Destruction danger zone */}
        <section className="p-6 rounded-2xl border border-rose-950 bg-rose-950/5 space-y-4">
          <h3 className="text-sm font-bold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldAlert size={16} />
            <span>Danger Zone</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="block text-sm font-semibold text-zinc-200">Reset Local Sandbox Data</span>
              <span className="block text-zinc-500 text-[10px] mt-0.5">Wipe all XP levels, unlocked achievements, active streaks, and logged records.</span>
            </div>
            
            <button
              onClick={handleReset}
              className="px-4 py-2.5 bg-rose-900/20 hover:bg-rose-900 text-rose-300 font-bold rounded-xl text-xs border border-rose-900/40 transition-all text-center"
            >
              Factory Reset Platform
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
