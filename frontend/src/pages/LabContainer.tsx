import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LABS_REGISTRY, LAB_CATEGORIES } from '@/labs/registry';
import { useAppStore } from '@/store/useAppStore';
import { LabIcon } from '@/components/LabIcon';
import { ChevronLeft, Star, Clock } from 'lucide-react';

export const LabContainer: React.FC = () => {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const { user, toggleBookmark, logActivity } = useAppStore();

  const lab = LABS_REGISTRY.find((l) => l.id === labId && l.status === 'active');

  useEffect(() => {
    if (!lab) {
      navigate('/labs');
      return;
    }
    
    // Log activity and reward XP when entering a Lab
    logActivity(lab.id, 25);
  }, [labId, lab, navigate, logActivity]);

  if (!lab) return null;

  const isBookmarked = user?.bookmarks.includes(lab.id);
  const catDef = LAB_CATEGORIES.find((c) => c.id === lab.category);
  const ActiveComponent = lab.component;

  return (
    <div className="space-y-6">
      {/* Lab Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/labs')}
            className="p-2 rounded-lg border border-zinc-800 hover:border-zinc-700 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 transition-all"
            title="Back to Labs"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-br ${catDef?.colorClass || 'from-zinc-500 to-zinc-600'} bg-opacity-10 border border-white/5`}>
              <LabIcon name={lab.icon} className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight m-0">{lab.name}</h1>
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest block mt-0.5">
                {catDef?.name} • Active Lab Module
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active stats */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-950 text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            <Clock size={12} className="text-indigo-400" />
            <span>Earns +25 XP Entry</span>
          </div>

          <button
            onClick={() => toggleBookmark(lab.id)}
            className={`p-2 rounded-lg border transition-all ${
              isBookmarked
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark lab'}
          >
            <Star size={16} className={isBookmarked ? 'fill-amber-500' : ''} />
          </button>
        </div>
      </div>

      {/* Main Lab Screen Area */}
      <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/10 relative min-h-[450px]">
        {ActiveComponent ? (
          <React.Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-zinc-950/20 backdrop-blur-sm rounded-2xl">
                <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-zinc-500 font-semibold tracking-wider uppercase">Loading Sandbox Module...</span>
              </div>
            }
          >
            <ActiveComponent />
          </React.Suspense>
        ) : (
          <div className="text-center py-20 text-zinc-500">
            Internal module loading failed. Component reference missing.
          </div>
        )}
      </div>
    </div>
  );
};
