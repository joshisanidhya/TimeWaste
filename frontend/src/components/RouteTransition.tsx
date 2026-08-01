import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LABS_REGISTRY } from '@/labs/registry';

// Map lab IDs to zero-padded indices
const LAB_INDEX: Record<string, string> = {};
LABS_REGISTRY.forEach((lab, i) => {
  LAB_INDEX[lab.id] = String(i + 1).padStart(3, '0');
});

interface TransitionMeta {
  id: string;
  name: string;
  category?: string;
}

function getLabMeta(pathname: string): TransitionMeta | null {
  const labMatch = pathname.match(/^\/labs\/(.+)$/);
  if (!labMatch) return null;
  const labId = labMatch[1];
  const lab = LABS_REGISTRY.find((l) => l.id === labId);
  if (!lab) return null;
  return {
    id: `LAB_${LAB_INDEX[labId] || '???'}`,
    name: lab.name.toUpperCase(),
    category: lab.category.toUpperCase(),
  };
}

interface RouteTransitionProps {
  children: React.ReactNode;
}

export const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [meta, setMeta] = useState<TransitionMeta | null>(null);

  // Reduced motion check — stable value, computed once
  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (prefersReduced) return;

    const labMeta = getLabMeta(location.pathname);
    if (!labMeta) return;

    // Use setTimeout so setState fires async (not synchronously in effect body)
    const show = setTimeout(() => {
      setMeta(labMeta);
      setIsTransitioning(true);
    }, 0);

    const hide = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);

    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <>
      {/* Lab identifier overlay */}
      <AnimatePresence>
        {isTransitioning && meta && (
          <motion.div
            key={location.pathname + '-overlay'}
            className="route-overlay"
            initial={{ clipPath: 'inset(0 100% 0 0)' }}
            animate={{ clipPath: 'inset(0 0% 0 0)' }}
            exit={{
              clipPath: 'inset(0 0 0 100%)',
              transition: { duration: 0.38, ease: [0.16, 1, 0.3, 1] },
            }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="route-overlay-id"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.08 }}
            >
              {meta.id}
              {meta.category && ` / ${meta.category}`}
            </motion.div>

            <motion.div
              className="route-overlay-name"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.14 }}
            >
              {meta.name}
            </motion.div>

            <motion.div
              className="route-overlay-sub"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.24 }}
            >
              LOADING EXPERIMENT
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Page fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: prefersReduced ? 1 : 0, y: prefersReduced ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: prefersReduced ? 1 : 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.24, ease: [0.4, 0, 0.2, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
};
