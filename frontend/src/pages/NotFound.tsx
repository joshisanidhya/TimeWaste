import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col items-start justify-end p-[clamp(2rem,6vw,5rem)] relative overflow-hidden"
      style={{ background: 'var(--bg-obsidian)' }}
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-pattern opacity-25 pointer-events-none" />

      {/* Large 404 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
        style={{
          fontSize: 'clamp(8rem, 28vw, 22rem)',
          fontWeight: 900,
          letterSpacing: '-0.05em',
          lineHeight: 1,
          color: 'var(--bg-elevated)',
        }}
      >
        404
      </motion.div>

      {/* Bottom-left content */}
      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--signal-text)',
          }}
        >
          EXPERIMENT FAILED
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            marginTop: '0.5rem',
          }}
        >
          The requested reality<br />could not be reproduced.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6875rem',
            letterSpacing: '0.08em',
            color: 'var(--text-tertiary)',
            marginTop: '1rem',
          }}
        >
          ERROR_CODE: 404 · PATH_NOT_FOUND · EXPERIMENT_ABORTED
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.42 }}
          onClick={() => navigate('/')}
          data-cursor="open"
          className="btn-signal mt-8 px-6 py-3 text-sm font-bold tracking-wide"
          style={{
            background: 'var(--signal)',
            color: 'var(--bg-obsidian)',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          RETURN TO LAB →
        </motion.button>
      </div>
    </div>
  );
};
