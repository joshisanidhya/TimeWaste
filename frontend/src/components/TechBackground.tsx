import React from 'react';

export const TechBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* Very subtle signal-colored orb — top right */}
      <div
        className="absolute -top-40 -right-40 rounded-full"
        style={{
          width: 600,
          height: 600,
          background: 'radial-gradient(circle at center, rgba(199,255,61,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Dimmer carbon orb — bottom left */}
      <div
        className="absolute -bottom-40 -left-20 rounded-full"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle at center, rgba(255,255,255,0.025) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Technical annotation lines — top left */}
      <div
        className="absolute top-8 left-8 hidden lg:block"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.1em',
          color: 'var(--text-tertiary)',
          opacity: 0.3,
          lineHeight: 2,
        }}
      >
        <div>P(A|B) = P(B|A)·P(A) / P(B)</div>
        <div>O(n log n) · f(x) = ∑λᵢxᵢ</div>
        <div>argmax Q(s,a) · ∇L(θ) = E[∇log p]</div>
      </div>

      {/* Technical annotation — bottom right */}
      <div
        className="absolute bottom-8 right-8 text-right hidden lg:block"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.5625rem',
          letterSpacing: '0.1em',
          color: 'var(--text-tertiary)',
          opacity: 0.3,
          lineHeight: 2,
        }}
      >
        <div>Monte Carlo N=100k</div>
        <div>Random Forest n_trees=500</div>
        <div>PLAYORITHM v1.0 · EXPERIMENT ENGINE</div>
      </div>
    </div>
  );
};
