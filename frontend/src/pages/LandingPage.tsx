import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { LAB_CATEGORIES, LABS_REGISTRY } from '@/labs/registry';
import { ExperimentEngine } from '@/components/HeroLabPreview';

/* ── Helpers ────────────────────────────── */
const CATEGORY_VAR: Record<string, string> = {
  ai: 'var(--cat-ai)',
  ml: 'var(--cat-ml)',
  probability: 'var(--cat-probability)',
  fun: 'var(--cat-fun)',
  game: 'var(--cat-game)',
  utility: 'var(--cat-utility)',
  analytics: 'var(--cat-analytics)',
};

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Section divider ─────────────────────── */
const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-4 py-2">
    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '0.5625rem',
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
    <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
  </div>
);

/* ── Lab card (Experiment Module) ───────── */
interface LabCardProps {
  lab: typeof LABS_REGISTRY[0];
  index: number;
  onClick: () => void;
}

const LabCard: React.FC<LabCardProps> = ({ lab, index, onClick }) => {
  const catColor = CATEGORY_VAR[lab.category] || 'var(--signal)';
  const isActive = lab.status === 'active';
  const num = String(index + 1).padStart(3, '0');

  return (
    <motion.div
      whileHover={isActive ? { y: -2 } : {}}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      onClick={isActive ? onClick : undefined}
      data-cursor={isActive ? 'run' : 'soon'}
      style={{
        position: 'relative',
        padding: '1.5rem',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        cursor: isActive ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: 220,
        opacity: isActive ? 1 : 0.7,
        transition: 'border-color 0.18s ease, background 0.18s ease',
        overflow: 'hidden',
      }}
      className={isActive ? 'experiment-card-active' : ''}
      onMouseEnter={(e) => {
        if (isActive) {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
          (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
        (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
      }}
    >
      {/* Left category accent */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: catColor,
          opacity: isActive ? 0.7 : 0.25,
        }}
      />

      <div>
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: catColor,
                opacity: 0.8,
              }}
            >
              LAB_{num}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: isActive ? 'var(--signal-text)' : 'var(--cat-fun)',
              border: `1px solid ${isActive ? 'var(--border-signal)' : 'rgba(251,146,60,0.25)'}`,
              padding: '2px 6px',
            }}
          >
            {isActive ? 'ACTIVE' : lab.releaseDate || 'SOON'}
          </span>
        </div>

        {/* Lab name */}
        <h3
          style={{
            fontSize: '1rem',
            fontWeight: 800,
            letterSpacing: '-0.01em',
            lineHeight: 1.25,
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
          }}
        >
          {lab.name}
        </h3>

        <p
          style={{
            fontSize: '0.6875rem',
            color: 'var(--text-tertiary)',
            lineHeight: 1.65,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {lab.description}
        </p>
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between"
        style={{
          marginTop: '1.25rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: catColor,
            opacity: 0.7,
          }}
        >
          {lab.category.toUpperCase()}
        </span>
        {isActive && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            RUN ↗
          </span>
        )}
      </div>
    </motion.div>
  );
};

/* ── Main Component ──────────────────────── */
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppStore((state) => state.user);
  useScrollReveal();

  const activeLabs = LABS_REGISTRY.filter((l) => l.status === 'active');
  const comingSoonLabs = LABS_REGISTRY.filter((l) => l.status === 'coming-soon').slice(0, 6);



  return (
    <div className="relative" style={{ paddingBottom: '4rem' }}>

      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        className="relative"
        style={{
          paddingTop: 'clamp(3rem, 6vw, 6rem)',
          paddingBottom: 'clamp(3rem, 6vw, 5rem)',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: editorial headline */}
          <div>
            {/* Year/brand label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--signal-text)',
                marginBottom: '1.5rem',
              }}
            >
              PLAYORITHM / 2026 / DIGITAL EXPERIMENTAL LABORATORY
            </motion.div>

            {/* Headline — asymmetric, editorial */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 5.5rem)',
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
              }}
            >
              WHERE<br />
              DEVELOPERS<br />
              PLAY WITH<br />
              <span style={{ color: 'var(--signal-text)' }}>INTELLIGENCE.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.2 }}
              style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 420,
                marginBottom: '2rem',
              }}
            >
              AI roasts, ML predictions, probability experiments, developer tests,
              utilities and games — all inside one experimental laboratory.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3"
            >
              <button
                onClick={() => navigate('/labs')}
                data-cursor="open"
                style={{
                  background: 'var(--signal)',
                  color: 'var(--bg-obsidian)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '12px 28px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'opacity 0.15s ease, transform 0.15s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.88'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
              >
                ENTER LABS →
              </button>

              <button
                onClick={() => navigate(user ? '/labs' : '/auth?mode=guest')}
                style={{
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  padding: '12px 22px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                }}
              >
                CONTINUE AS GUEST
              </button>
            </motion.div>

            {/* Spec strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex flex-wrap items-center gap-5 mt-8"
            >
              {[
                { val: '8', label: 'ACTIVE LABS' },
                { val: '7', label: 'CATEGORIES' },
                { val: 'AI+ML', label: 'POWERED' },
                { val: '100%', label: 'OPEN SOURCE' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-baseline gap-1.5">
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {stat.val}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Experiment Engine */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <ExperimentEngine />
          </motion.div>
        </div>
      </section>

      {/* ── SECTION: MOST RUN EXPERIMENTS ──────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <SectionDivider label="MOST RUN EXPERIMENTS" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 reveal">
          {activeLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              index={LABS_REGISTRY.indexOf(lab)}
              onClick={() => navigate(`/labs/${lab.id}`)}
            />
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate('/labs')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 0',
              transition: 'color 0.15s ease',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--signal-text)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)')}
          >
            VIEW ALL {LABS_REGISTRY.length} EXPERIMENTS →
          </button>
        </div>
      </section>

      {/* ── SECTION: EXPERIMENT DOMAINS ─────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <SectionDivider label="EXPERIMENT DOMAINS" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mt-8 reveal" style={{ border: '1px solid var(--border-subtle)' }}>
          {LAB_CATEGORIES.map((cat, i) => {
            const catColor = CATEGORY_VAR[cat.id];
            return (
              <div
                key={cat.id}
                onClick={() => navigate(`/labs?category=${cat.id}`)}
                data-cursor="open"
                style={{
                  padding: '1.5rem',
                  borderRight: i % 3 !== 2 ? '1px solid var(--border-subtle)' : undefined,
                  borderBottom: i < 4 ? '1px solid var(--border-subtle)' : undefined,
                  cursor: 'pointer',
                  transition: 'background 0.18s ease',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                }}
              >
                {/* Number */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5rem',
                    letterSpacing: '0.14em',
                    color: catColor,
                    opacity: 0.7,
                    marginBottom: '0.75rem',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </div>

                <h3
                  style={{
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    color: 'var(--text-primary)',
                    marginBottom: '0.4rem',
                  }}
                >
                  {cat.name}
                </h3>

                <p
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--text-tertiary)',
                    lineHeight: 1.6,
                  }}
                >
                  {cat.description}
                </p>

                {/* Bottom accent line on hover */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: catColor,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.25s ease',
                  }}
                  className="cat-hover-line"
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── SECTION: HOW IT WORKS ─────────────────────────── */}
      <section id="how-it-works" style={{ marginTop: '5rem' }}>
        <SectionDivider label="HOW IT WORKS" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 reveal">
          {[
            {
              num: '01',
              title: 'Choose an Experiment',
              desc: 'Select from AI profile roasters, ML predictors, probability simulators, or developer personality tests.',
            },
            {
              num: '02',
              title: 'Run the Lab',
              desc: 'Input data, execute algorithms, simulate Monte Carlo paths, or get roasted by LLMs in real time.',
            },
            {
              num: '03',
              title: 'Earn XP & Streaks',
              desc: 'Track achievements, build daily streaks, level up your developer rank, and compare on the leaderboard.',
            },
          ].map((step) => (
            <div
              key={step.num}
              style={{
                padding: '1.5rem',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-elevated)',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: 'var(--signal-text)',
                  opacity: 0.35,
                  letterSpacing: '-0.02em',
                  marginBottom: '1rem',
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                  letterSpacing: '-0.01em',
                }}
              >
                {step.title}
              </h3>
              <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', lineHeight: 1.65 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION: IN DEVELOPMENT ──────────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <SectionDivider label="IN DEVELOPMENT" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 reveal">
          {comingSoonLabs.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              index={LABS_REGISTRY.indexOf(lab)}
              onClick={() => {}}
            />
          ))}
        </div>
      </section>

      {/* ── SECTION: START EXPERIMENTING ─────────────────── */}
      <section style={{ marginTop: '5rem' }}>
        <SectionDivider label="START EXPERIMENTING" />

        <div
          className="reveal"
          style={{
            marginTop: '2rem',
            padding: 'clamp(2.5rem, 6vw, 5rem)',
            border: '1px solid var(--border-signal)',
            background: 'var(--bg-elevated)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Signal background orb */}
          <div
            style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: 400,
              height: 400,
              background: 'radial-gradient(circle, rgba(199,255,61,0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              pointerEvents: 'none',
            }}
          />

          <div className="relative z-10 max-w-2xl">
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5625rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--signal-text)',
                marginBottom: '1rem',
              }}
            >
              READY TO EXPERIMENT?
            </div>

            <h2
              style={{
                fontSize: 'clamp(1.75rem, 4vw, 3rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: 'var(--text-primary)',
                marginBottom: '1rem',
              }}
            >
              Ready to waste time<br />productively?
            </h2>

            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Step into the laboratory. Run AI roasts, ML predictions, and probability simulations. No setup required.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate(user ? '/labs' : '/auth')}
                data-cursor="open"
                style={{
                  background: 'var(--signal)',
                  color: 'var(--bg-obsidian)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '14px 32px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontWeight: 700,
                  transition: 'opacity 0.15s ease',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.88')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                {user ? 'ENTER DASHBOARD →' : 'GET STARTED NOW →'}
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'transparent',
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border-default)',
                  cursor: 'pointer',
                  padding: '14px 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = 'var(--text-tertiary)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                VIEW GITHUB
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
