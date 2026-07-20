import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LabIcon } from '@/components/LabIcon';
import { Calendar, Award, Compass, Star } from 'lucide-react';

interface AchievementMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  colorClass: string;
}

const ACHIEVEMENTS_METADATA: AchievementMeta[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Earn your first 100 XP in the Playground.',
    icon: 'Compass',
    colorClass: 'from-blue-500 to-indigo-500 text-blue-400',
  },
  {
    id: 'grindmaster',
    name: 'Grindmaster',
    description: 'Reach a total of 1,000 XP through code analysis.',
    icon: 'Trophy',
    colorClass: 'from-amber-500 to-orange-500 text-orange-400',
  },
  {
    id: 'elite-dev',
    name: 'Elite Architect',
    description: 'Reach Level 5 in the Developer Platform.',
    icon: 'Award',
    colorClass: 'from-violet-500 to-fuchsia-500 text-fuchsia-400',
  },
];

export const Profile: React.FC = () => {
  const { user } = useAppStore();

  if (!user) return null;

  const xpProgress = user.xp % 500;
  const xpNeeded = 500 - xpProgress;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Profile Banner / Header */}
      <div className="p-8 rounded-3xl border border-zinc-800 bg-zinc-900/10 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6">
        <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/5 blur-3xl rounded-full"></div>
        
        <img 
          src={user.avatar} 
          alt={user.username} 
          className="w-24 h-24 rounded-full bg-zinc-950 border border-zinc-800 mx-auto md:mx-0 shadow-lg"
        />

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight m-0">
              {user.username}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-xs font-bold text-violet-400">
              Level {user.level}
            </span>
            {user.isGuest && (
              <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                Guest Mode
              </span>
            )}
          </div>
          <p className="text-zinc-500 text-xs flex items-center justify-center md:justify-start gap-1">
            <Calendar size={12} /> Active session synchronized: {new Date(user.lastActive).toLocaleDateString()}
          </p>
          
          {/* Level Progress */}
          <div className="pt-2 max-w-md mx-auto md:mx-0">
            <div className="flex justify-between text-[10px] text-zinc-500 font-bold mb-1">
              <span>{xpProgress}/500 XP</span>
              <span>{xpNeeded} XP to Level {user.level + 1}</span>
            </div>
            <div className="w-full h-2 bg-zinc-950 border border-zinc-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${(xpProgress / 500) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid containing Stats & Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Stats & Achievements */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Achievements Grid */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={20} className="text-violet-400" />
              <span>Platform Badges</span>
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ACHIEVEMENTS_METADATA.map((badge) => {
                const isUnlocked = user.achievements.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-5 rounded-2xl border flex flex-col items-center text-center transition-all ${
                      isUnlocked
                        ? 'bg-zinc-900/30 border-zinc-800'
                        : 'bg-zinc-950/20 border-zinc-900/60 opacity-40'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.colorClass} bg-opacity-10 border border-white/5 flex items-center justify-center mb-4`}>
                      <LabIcon name={badge.icon} className={isUnlocked ? 'text-white' : 'text-zinc-600'} size={22} />
                    </div>
                    
                    <h4 className="text-sm font-bold text-zinc-200">{badge.name}</h4>
                    <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">{badge.description}</p>
                    
                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-4 px-2 py-0.5 rounded ${
                      isUnlocked
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-900 text-zinc-600'
                    }`}>
                      {isUnlocked ? 'Unlocked' : 'Locked'}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activity Log */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass size={20} className="text-indigo-400" />
              <span>Activity History</span>
            </h3>

            {user.history.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-800 rounded-2xl text-zinc-500 text-xs">
                No recent activity logged. Enter any Lab to start tracking metrics.
              </div>
            ) : (
              <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 overflow-hidden divide-y divide-zinc-900">
                {user.history.map((log, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between text-xs hover:bg-zinc-900/25 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400">
                        <LabIcon name="Terminal" size={14} />
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-200">Ran module: {log.labId}</span>
                        <span className="block text-[10px] text-zinc-500 mt-0.5">{new Date(log.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {log.xpEarned > 0 && (
                      <span className="font-mono font-bold text-violet-400">+{log.xpEarned} XP</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Bookmarks & Summaries */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Stats Panel */}
          <section className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/25 space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">Workspace Metrics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-900">
                <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Total XP</span>
                <span className="text-xl font-black font-mono text-zinc-100 mt-1 block">{user.xp}</span>
              </div>
              
              <div className="p-4 rounded-xl bg-zinc-950/50 border border-zinc-900">
                <span className="block text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Streak</span>
                <span className="text-xl font-black font-mono text-amber-500 mt-1 block">{user.streak} Days</span>
              </div>
            </div>
          </section>

          {/* Bookmarks */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
              <Star size={16} className="text-amber-500 fill-amber-500" />
              <span>Bookmarks</span>
            </h3>

            {user.bookmarks.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl text-zinc-500 text-xs">
                No bookmarked labs yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {user.bookmarks.map((bId) => (
                  <div key={bId} className="p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/10 flex items-center justify-between text-xs hover:border-zinc-700 transition-colors">
                    <span className="font-semibold text-zinc-200">{bId}</span>
                    <button 
                      onClick={() => useAppStore.getState().toggleBookmark(bId)}
                      className="text-zinc-500 hover:text-zinc-300"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
};
