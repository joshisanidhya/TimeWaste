import React, { useEffect, useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

const INIT_STEPS = [
  { label: 'EXPERIMENT ENGINE', delay: 120 },
  { label: 'AI MODULES', delay: 280 },
  { label: 'ML RUNTIME', delay: 420 },
  { label: 'PROBABILITY ENGINE', delay: 560 },
  { label: 'SESSION', delay: 680 },
];

const COUNT_SEQUENCE = [0, 8, 19, 31, 47, 62, 78, 89, 96, 100];

interface PreloaderProps {
  onComplete: () => void;
  minDuration?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({
  onComplete,
  minDuration = 700,
}) => {
  const [count, setCount] = useState(0);
  const [readyLines, setReadyLines] = useState<string[]>([]);
  const [showReady, setShowReady] = useState(false);
  const [exiting, setExiting] = useState(false);



  // Check prefers-reduced-motion — skip instantly
  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  useEffect(() => {
    if (prefersReduced) {
      onComplete();
      return;
    }

    // Animate count sequence
    let seqIdx = 0;
    const totalDuration = minDuration * 0.85;
    const interval = totalDuration / COUNT_SEQUENCE.length;

    const countTimer = setInterval(() => {
      seqIdx++;
      if (seqIdx < COUNT_SEQUENCE.length) {
        setCount(COUNT_SEQUENCE[seqIdx]);
      } else {
        clearInterval(countTimer);
        setCount(100);
      }
    }, interval);

    // Animate ready status lines
    INIT_STEPS.forEach((step) => {
      setTimeout(() => {
        setReadyLines((prev) => [...prev, step.label]);
      }, step.delay);
    });

    // Show "READY." after minDuration
    const readyTimer = setTimeout(() => {
      setShowReady(true);
    }, minDuration);

    // Exit after READY is shown
    const exitTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(onComplete, 550);
    }, minDuration + 280);

    return () => {
      clearInterval(countTimer);
      clearTimeout(readyTimer);
      clearTimeout(exitTimer);
    };
  }, [onComplete, minDuration, prefersReduced]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          key="preloader"
          className="preloader"
          initial={{ opacity: 1 }}
          exit={{
            clipPath: 'inset(0 0 100% 0)',
            transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          {/* Grid pattern background */}
          <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

          {/* Scan line effect */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-[var(--signal)] opacity-15 pointer-events-none"
            initial={{ top: '-1px' }}
            animate={{ top: '100vh' }}
            transition={{
              duration: 1.4,
              ease: 'linear',
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />

          {/* Top-left: wordmark */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="preloader-wordmark"
            >
              PLAYORITHM
            </motion.div>

            {/* Status lines */}
            <div className="mt-6 space-y-1.5">
              {INIT_STEPS.map((step, i) => {
                const isReady = readyLines.includes(step.label);
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: isReady ? 1 : 0, x: isReady ? 0 : -8 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="preloader-status flex items-center gap-3"
                    style={{ transitionDelay: `${i * 20}ms` }}
                  >
                    <span className="w-24 inline-block">{step.label}</span>
                    <span className="flex-1 inline-block">
                      {'·'.repeat(Math.max(0, 20 - step.label.length))}
                    </span>
                    {showReady ? (
                      <span className="ready">READY</span>
                    ) : (
                      <span className="text-[var(--signal-text)] opacity-60">···</span>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* READY. headline */}
            <AnimatePresence>
              {showReady && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-8"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.75rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--signal-text)',
                  }}
                >
                  ENTER PLAYORITHM →
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom-right: large counter */}
          <motion.div
            className="preloader-counter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <motion.span
              key={count}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {String(count).padStart(2, '0')}
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
