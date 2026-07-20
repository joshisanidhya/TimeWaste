import React, { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { Trophy, Medal, Flame, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  rank: number;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export const Leaderboard: React.FC = () => {
  const { user } = useAppStore();

  const leaderboardData = useMemo(() => {
    const mockUsers: Omit<LeaderboardUser, 'rank'>[] = [
      { username: 'VimSorcerer', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=VimSorcerer', level: 12, xp: 5800, streak: 42 },
      { username: 'LambaNinja', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=LambaNinja', level: 9, xp: 4200, streak: 18 },
      { username: 'VercelFanboy', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=VercelFanboy', level: 8, xp: 3950, streak: 25 },
      { username: 'StackOverflowCopier', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=StackOverflowCopier', level: 6, xp: 2800, streak: 4 },
      { username: 'GitMergeConflict', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=GitMergeConflict', level: 5, xp: 2150, streak: 12 },
      { username: 'NullPointerWizard', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=NullPointerWizard', level: 4, xp: 1900, streak: 7 },
    ];

    if (user) {
      // Append current user
      mockUsers.push({
        username: user.username.split('_')[0],
        avatar: user.avatar,
        level: user.level,
        xp: user.xp,
        streak: user.streak,
        isCurrentUser: true,
      });
    }

    // Sort by XP descending
    const sorted = mockUsers.sort((a, b) => b.xp - a.xp);

    // Map ranks
    return sorted.map((u, index) => ({
      ...u,
      rank: index + 1,
    }));
  }, [user]);

  const currentUserRank = useMemo(() => {
    return leaderboardData.find((u) => u.isCurrentUser)?.rank || 0;
  }, [leaderboardData]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Global Leaderboard</h1>
          <p className="text-zinc-400 text-xs mt-1">See how you rank against developers in the intelligence playground.</p>
        </div>

        {user && (
          <div className="flex items-center gap-4 bg-violet-600/10 border border-violet-500/20 px-4 py-3 rounded-2xl">
            <Medal className="text-violet-400" size={24} />
            <div>
              <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Your Position</div>
              <div className="text-sm font-bold text-white">Rank #{currentUserRank} of {leaderboardData.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard Table List */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/10 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-6 py-4 bg-zinc-950/50 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-500">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-5">Developer</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-right">Streak</div>
          <div className="col-span-1 text-right">XP</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-900">
          {leaderboardData.map((u, idx) => (
            <motion.div
              key={u.username + idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`grid grid-cols-12 gap-2 items-center px-6 py-4 transition-all ${
                u.isCurrentUser 
                  ? 'bg-violet-600/5 border-l-2 border-l-violet-500 font-semibold' 
                  : 'hover:bg-zinc-900/30'
              }`}
            >
              {/* Rank column */}
              <div className="col-span-2 flex items-center justify-center">
                {u.rank === 1 && <Trophy className="text-amber-500" size={20} />}
                {u.rank === 2 && <Trophy className="text-zinc-300" size={18} />}
                {u.rank === 3 && <Trophy className="text-amber-700" size={16} />}
                {u.rank > 3 && <span className="text-sm text-zinc-500 font-mono">{u.rank}</span>}
              </div>

              {/* Avatar & Username column */}
              <div className="col-span-5 flex items-center gap-3">
                <img 
                  src={u.avatar} 
                  alt={u.username} 
                  className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800"
                />
                <span className={`text-sm truncate ${u.isCurrentUser ? 'text-violet-400 font-bold' : 'text-zinc-200'}`}>
                  {u.username}
                  {u.isCurrentUser && (
                    <span className="ml-2 text-[9px] bg-violet-500/20 text-violet-400 px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      You
                    </span>
                  )}
                </span>
              </div>

              {/* Level column */}
              <div className="col-span-2 text-center">
                <span className="text-sm font-mono text-zinc-300">Lvl {u.level}</span>
              </div>

              {/* Streak column */}
              <div className="col-span-2 flex items-center justify-end gap-1 text-amber-500 font-semibold text-sm">
                <Flame size={14} className="fill-amber-500" />
                <span className="font-mono">{u.streak}d</span>
              </div>

              {/* XP column */}
              <div className="col-span-1 text-right">
                <span className="text-sm font-mono font-bold text-zinc-100">{u.xp}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard CTA */}
      <div className="p-6 rounded-2xl glass-panel border border-zinc-800 text-center space-y-4">
        <Sparkles className="text-violet-400 mx-auto" size={24} />
        <h4 className="text-base font-bold text-white">Want to claim the top spot?</h4>
        <p className="text-zinc-400 text-xs max-w-sm mx-auto">
          Complete high-yield AI labs and coding quiz visualizers. Daily challenges reward +100 bonus XP.
        </p>
      </div>
    </div>
  );
};
