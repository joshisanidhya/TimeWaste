import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GitHubRoast() {
  const { addXP } = useAppStore();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [roast, setRoast] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ egoHit: number; indentationDisaster: number; lateCommits: number } | null>(null);

  const statuses = [
    'Scanning public repositories...',
    'Inspecting README markdown files...',
    'Analyzing commit message quality...',
    'Evaluating copy-paste density...',
    'Analyzing code commits authored at 3:00 AM...',
    'Calculating StackOverflow reliance coefficient...',
  ];

  const handleRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setRoast(null);
    setMetrics(null);

    // Dynamic status text sequence
    let currentStep = 0;
    setStatusText(statuses[0]);
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statuses.length) {
        setStatusText(statuses[currentStep]);
      }
    }, 900);

    setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
      
      // Roast Generation
      const jokes = [
        `Ah, ${username}. Your GitHub is where code goes to die, or rather, collect dust. You have repositories that haven't been touched since the first lockdown, yet you still list them on your resume as "active research". Your commit messages read like a diary of increasing desperation: "fix", "please work", "PLEASE", "revert please".`,
        `Oh look, ${username} is a master of the dark arts: copying from StackOverflow, renaming the variables, and claiming it is a custom state machine. Your contributions grid looks like a patchy grass lawn in summer—long stretches of absolute desert interrupted by a frantic green week where you forced yourself to code so recruiters wouldn't think you switched careers.`,
        `Checking ${username}'s profile. It looks like you spent more time styling your profile README.md with customized SVGs, glowing badges, and visitor counters than actually writing code. You are using React for simple projects that could have been a static HTML page, just to feel like you're deploying a microservice architecture.`,
      ];

      setRoast(jokes[Math.floor(Math.random() * jokes.length)]);
      setMetrics({
        egoHit: Math.floor(80 + Math.random() * 20),
        indentationDisaster: Math.floor(40 + Math.random() * 55),
        lateCommits: Math.floor(60 + Math.random() * 35),
      });

      // Reward XP for completing activity
      addXP(50, `Successfully roasted GitHub user: ${username} 🔥`);
    }, 5500);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Description */}
      <div className="text-zinc-400 text-xs leading-relaxed">
        Let our AI model dissect your public repository commits, contribution schedules, and project complexities to provide a brutally honest evaluation.
      </div>

      {/* Input Form */}
      <form onSubmit={handleRoast} className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-[16px] h-[16px] fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
            </svg>
            <input
              type="text"
              required
              placeholder="Enter GitHub handle (e.g. torvalds)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-zinc-200 text-xs placeholder-zinc-600"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 shadow-lg shadow-violet-600/15 disabled:opacity-50"
          >
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>Roast Profile</span>
          </button>
        </div>
      </form>

      {/* Loading Screen */}
      {loading && (
        <div className="p-8 rounded-xl border border-zinc-800 bg-zinc-950/40 text-center space-y-4">
          <RefreshCw size={24} className="animate-spin text-violet-400 mx-auto" />
          <div className="text-xs text-zinc-300 font-mono">{statusText}</div>
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-violet-500 rounded-full animate-shimmer" style={{ width: '40%' }}></div>
          </div>
        </div>
      )}

      {/* Roast Result */}
      {roast && metrics && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Roast Message */}
          <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/20 relative">
            <div className="absolute -top-3 left-6 px-2.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-1">
              <AlertTriangle size={12} className="text-amber-500" /> AI Diagnosis
            </div>
            <p className="text-zinc-200 text-xs leading-relaxed font-mono whitespace-pre-line mt-2">
              {roast}
            </p>
          </div>

          {/* Diagnostic Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Ego Hit</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{metrics.egoHit}%</span>
            </div>
            
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">Tab-Space Ratio</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{metrics.indentationDisaster}%</span>
            </div>

            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/10 text-center">
              <span className="block text-zinc-500 text-[9px] uppercase font-bold tracking-wider">3 AM commits</span>
              <span className="text-xl font-bold font-mono text-zinc-200 mt-1 block">{metrics.lateCommits}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
