import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { LABS_REGISTRY, LAB_CATEGORIES } from '@/labs/registry';
import { LabIcon } from '@/components/LabIcon';
import { Search, Star, Sparkles, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, toggleBookmark, addXP, logActivity } = useAppStore();
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const activeCategory = searchParams.get('category') || 'all';
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'coming-soon'>('all');
  const [requestedLabs, setRequestedLabs] = useState<string[]>([]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', categoryId);
    }
    setSearchParams(searchParams);
  };

  // Filtered labs
  const filteredLabs = useMemo(() => {
    return LABS_REGISTRY.filter((lab) => {
      const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            lab.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || lab.category === activeCategory;
      const matchesStatus = statusFilter === 'all' || lab.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, activeCategory, statusFilter]);

  // Request Feature action
  const handleRequestFeature = (labId: string, labName: string) => {
    if (requestedLabs.includes(labId)) return;
    setRequestedLabs((prev) => [...prev, labId]);
    
    // Reward XP for platform interaction
    addXP(10, `Requested feature: ${labName} 💡`);
    logActivity(labId, 0); // log activity without earning duplicate activity XP
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-dark pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight m-0">Developer Labs</h1>
          <p className="text-zinc-400 text-xs mt-1">Select any intelligence module to enter or request future integrations.</p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search labs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-zinc-200 placeholder-zinc-600"
          />
        </div>
      </div>

      {/* Category Pills & Status Filter */}
      <div className="flex flex-col gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleCategorySelect('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              activeCategory === 'all'
                ? 'bg-white text-zinc-950 border-white'
                : 'text-zinc-400 border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
            }`}
          >
            All Categories
          </button>
          
          {LAB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                activeCategory === cat.id
                  ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-500/20'
                  : 'text-zinc-400 border-zinc-800 bg-zinc-900/30 hover:border-zinc-700'
              }`}
            >
              <LabIcon name={cat.icon} size={14} />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-2 border-t border-border-dark/50 pt-4">
          <span className="text-xs text-zinc-500 font-medium mr-2">Filter Status:</span>
          {(['all', 'active', 'coming-soon'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === status
                  ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300 border border-transparent'
              }`}
            >
              {status === 'coming-soon' ? 'Coming Soon' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Labs Grid */}
      {filteredLabs.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 text-sm">No labs found matching your query.</p>
        </div>
      ) : (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredLabs.map((lab) => {
              const isActive = lab.status === 'active';
              const isBookmarked = user?.bookmarks.includes(lab.id);
              const hasRequested = requestedLabs.includes(lab.id);
              const catDef = LAB_CATEGORIES.find(c => c.id === lab.category);

              return (
                <motion.div
                  key={lab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`p-6 rounded-2xl glass-panel relative overflow-hidden flex flex-col justify-between h-64 border transition-all ${
                    isActive 
                      ? 'border-zinc-800 hover:border-violet-500/30 shadow-lg hover:shadow-violet-600/5' 
                      : 'border-zinc-900/50 opacity-75 hover:opacity-90'
                  }`}
                >
                  <div>
                    {/* Lab Card Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${catDef?.colorClass || 'from-zinc-500 to-zinc-600'} bg-opacity-10 border border-white/5`}>
                        <LabIcon name={lab.icon} className="text-white" size={18} />
                      </div>

                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <button
                            onClick={() => toggleBookmark(lab.id)}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isBookmarked
                                ? 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                                : 'text-zinc-500 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
                            }`}
                            title={isBookmarked ? 'Remove bookmark' : 'Bookmark lab'}
                          >
                            <Star size={14} className={isBookmarked ? 'fill-amber-500' : ''} />
                          </button>
                        ) : (
                          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 bg-zinc-950 px-2 py-0.5 border border-zinc-800 rounded">
                            {lab.releaseDate || 'Soon'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Lab Metadata */}
                    <h3 className="text-lg font-bold text-zinc-100 mb-2">{lab.name}</h3>
                    <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">{lab.description}</p>
                  </div>

                  {/* Lab Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-border-dark flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">
                      {catDef?.name}
                    </span>

                    {isActive ? (
                      <button
                        onClick={() => navigate(`/labs/${lab.id}`)}
                        className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-md shadow-violet-600/15"
                      >
                        <span>Enter Lab</span>
                        <Sparkles size={12} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestFeature(lab.id, lab.name)}
                        disabled={hasRequested}
                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                          hasRequested
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                        }`}
                      >
                        {hasRequested ? (
                          <>
                            <Check size={12} />
                            <span>Requested</span>
                          </>
                        ) : (
                          <>
                            <Send size={12} />
                            <span>Request Feature</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};
