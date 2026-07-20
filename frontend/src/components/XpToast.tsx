import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { Sparkles, Trophy } from 'lucide-react';

export const XpToast: React.FC = () => {
  const xpToast = useAppStore((state) => state.xpToast);
  const dismissXpToast = useAppStore((state) => state.dismissXpToast);

  useEffect(() => {
    if (xpToast?.show) {
      const timer = setTimeout(() => {
        dismissXpToast();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [xpToast, dismissXpToast]);

  const isLevelUp = xpToast?.message.includes('LEVEL UP');

  return (
    <AnimatePresence>
      {xpToast?.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl glass-panel border border-violet-500/30 p-4 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${isLevelUp ? 'bg-amber-500/20 text-amber-400' : 'bg-violet-500/20 text-violet-400'}`}>
              {isLevelUp ? <Trophy size={24} className="animate-bounce" /> : <Sparkles size={24} className="animate-spin" />}
            </div>
            
            <div className="flex-1">
              <div className="text-sm font-semibold text-zinc-100">
                {isLevelUp ? 'Level Up!' : `+${xpToast.amount} XP Unlocked`}
              </div>
              <div className="text-xs text-zinc-400 mt-0.5">
                {xpToast.message}
              </div>
            </div>
            
            <button 
              onClick={dismissXpToast}
              className="text-zinc-500 hover:text-zinc-300 text-xs px-2 py-1 rounded hover:bg-white/5"
            >
              Close
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
