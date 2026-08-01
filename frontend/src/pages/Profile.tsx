import React from 'react';
import { useAppStore } from '@/store/useAppStore';
import { LabIcon } from '@/components/LabIcon';
import { LABS_REGISTRY } from '@/labs/registry';
import { Link } from 'react-router-dom';

interface AchievementMeta {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const ACHIEVEMENTS_METADATA: AchievementMeta[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Earn your first 100 XP.',
    icon: 'Compass',
    color: 'var(--cat-game)',
  },
  {
    id: 'grindmaster',
    name: 'Grindmaster',
    description: 'Reach 1,000 total XP.',
    icon: 'Trophy',
    color: 'var(--cat-fun)',
  },
  {
    id: 'elite-dev',
    name: 'Elite Architect',
    description: 'Reach Level 5.',
    icon: 'Award',
    color: 'var(--cat-ai)',
  },
];

export const Profile: React.FC = () => {
  const { user } = useAppStore();
  if (!user) return null;

  const xpProgress = user.xp % 500;
  const xpNeeded = 500 - xpProgress;
  const xpPercent = (xpProgress / 500) * 100;

  const levelStr = String(user.level).padStart(2, '0');

  return (
    <div style={{ paddingBottom: '4rem', maxWidth: 960, margin: '0 auto' }}>

      {/* ─── Identity Header ─── */}
      <div
        style={{
          paddingTop: 'clamp(2rem, 4vw, 3.5rem)',
          paddingBottom: 'clamp(2rem, 4vw, 3rem)',
          borderBottom: '1px solid var(--border-subtle)',
          marginBottom: '3rem',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: 'var(--signal-text)',
            marginBottom: '1rem',
          }}
        >
          DEVELOPER IDENTITY
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <img
              src={user.avatar}
              alt={user.username}
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                border: '1px solid var(--border-default)',
                background: 'var(--bg-surface)',
              }}
            />
            {user.isGuest && (
              <div
                style={{
                  position: 'absolute',
                  bottom: -4,
                  right: -4,
                  padding: '1px 6px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-default)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.4375rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                GUEST
              </div>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1,
                color: 'var(--text-primary)',
                margin: 0,
              }}
            >
              {user.username.toUpperCase()}
            </h1>

            <div className="flex flex-wrap items-center gap-5 mt-3">
              <div className="flex items-baseline gap-1.5">
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: 'var(--signal-text)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  LVL {levelStr}
                </span>
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-tertiary)',
                }}
              >
                {user.xp} XP TOTAL
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--cat-fun)',
                }}
              >
                🔥 {user.streak} DAY STREAK
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  color: 'var(--text-tertiary)',
                }}
              >
                {user.history.length} EXPERIMENTS RUN
              </div>
            </div>
          </div>

          {/* XP progress */}
          <div style={{ minWidth: 180 }}>
            <div
              className="flex items-center justify-between mb-2"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              <span>{xpProgress}/500 XP</span>
              <span>{xpNeeded} TO LVL {user.level + 1}</span>
            </div>
            <div
              style={{
                width: '100%',
                height: 3,
                background: 'var(--bg-surface)',
                borderRadius: 1.5,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${xpPercent}%`,
                  height: '100%',
                  background: 'var(--signal)',
                  borderRadius: 1.5,
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Two column layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Achievements */}
          <section>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
              }}
            >
              PLATFORM BADGES
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {ACHIEVEMENTS_METADATA.map((badge) => {
                const isUnlocked = user.achievements.includes(badge.id);
                return (
                  <div
                    key={badge.id}
                    style={{
                      padding: '1.25rem',
                      border: `1px solid ${isUnlocked ? badge.color + '30' : 'var(--border-subtle)'}`,
                      background: isUnlocked
                        ? `color-mix(in srgb, ${badge.color} 6%, var(--bg-elevated))`
                        : 'var(--bg-elevated)',
                      opacity: isUnlocked ? 1 : 0.4,
                      display: 'flex',
                      flexDirection: 'column' as const,
                      alignItems: 'center',
                      textAlign: 'center' as const,
                      gap: '0.75rem',
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        border: `1px solid ${isUnlocked ? badge.color + '40' : 'var(--border-subtle)'}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isUnlocked ? badge.color : 'var(--text-tertiary)',
                      }}
                    >
                      <LabIcon name={badge.icon} size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {badge.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: isUnlocked ? 'var(--signal-text)' : 'var(--text-tertiary)' }}>
                        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Activity log */}
          <section>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
              }}
            >
              RECENT EXPERIMENTS
            </div>

            {user.history.length === 0 ? (
              <div
                style={{
                  padding: '3rem',
                  border: '1px dashed var(--border-default)',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--signal-text)',
                    marginBottom: '0.5rem',
                  }}
                >
                  NO EXPERIMENTS YET.
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Your laboratory is suspiciously clean.
                </p>
                <Link
                  to="/labs"
                  style={{
                    display: 'inline-flex',
                    marginTop: '1rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.5625rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--signal-text)',
                    textDecoration: 'none',
                  }}
                >
                  RUN YOUR FIRST LAB →
                </Link>
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border-subtle)' }}>
                {user.history.map((log, idx) => {
                  const lab = LABS_REGISTRY.find((l) => l.id === log.labId);
                  const num = lab ? String(LABS_REGISTRY.indexOf(lab) + 1).padStart(3, '0') : '???';
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                      style={{
                        padding: '0.875rem 1rem',
                        borderBottom: idx < user.history.length - 1 ? '1px solid var(--border-subtle)' : undefined,
                        fontSize: '0.75rem',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.5625rem',
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'var(--signal-text)',
                            marginRight: '0.5rem',
                          }}
                        >
                          RAN LAB_{num}
                        </span>
                        <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                          {lab?.name || log.labId}
                        </span>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.5rem',
                            letterSpacing: '0.08em',
                            color: 'var(--text-tertiary)',
                            marginTop: 2,
                          }}
                        >
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </div>
                      {log.xpEarned > 0 && (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.6875rem',
                            fontWeight: 700,
                            color: 'var(--signal-text)',
                          }}
                        >
                          +{log.xpEarned} XP
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right: Metrics + Bookmarks */}
        <div className="space-y-6">
          {/* Stats */}
          <section>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
              }}
            >
              WORKSPACE METRICS
            </div>
            <div
              style={{
                border: '1px solid var(--border-subtle)',
              }}
            >
              {[
                { label: 'TOTAL XP', value: user.xp, color: 'var(--text-primary)' },
                { label: 'LEVEL', value: levelStr, color: 'var(--signal-text)' },
                { label: 'STREAK', value: `${user.streak}D`, color: 'var(--cat-fun)' },
                { label: 'EXPERIMENTS', value: user.history.length, color: 'var(--text-primary)' },
                { label: 'BOOKMARKS', value: user.bookmarks.length, color: 'var(--text-primary)' },
              ].map((m, i) => (
                <div
                  key={m.label}
                  className="flex items-center justify-between"
                  style={{
                    padding: '0.875rem 1rem',
                    borderBottom: i < 4 ? '1px solid var(--border-subtle)' : undefined,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {m.label}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.875rem',
                      fontWeight: 900,
                      color: m.color,
                    }}
                  >
                    {m.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Bookmarks */}
          <section>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.5rem',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
                marginBottom: '1rem',
              }}
            >
              BOOKMARKED LABS
            </div>

            {user.bookmarks.length === 0 ? (
              <div
                style={{
                  padding: '1.5rem',
                  border: '1px dashed var(--border-default)',
                  textAlign: 'center',
                  fontSize: '0.6875rem',
                  color: 'var(--text-tertiary)',
                }}
              >
                No bookmarked labs yet.
              </div>
            ) : (
              <div style={{ border: '1px solid var(--border-subtle)' }}>
                {user.bookmarks.map((bId, i) => {
                  const lab = LABS_REGISTRY.find((l) => l.id === bId);
                  return (
                    <div
                      key={bId}
                      className="flex items-center justify-between"
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: i < user.bookmarks.length - 1 ? '1px solid var(--border-subtle)' : undefined,
                      }}
                    >
                      <Link
                        to={`/labs/${bId}`}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          color: 'var(--text-primary)',
                          textDecoration: 'none',
                        }}
                      >
                        {lab?.name || bId}
                      </Link>
                      <button
                        onClick={() => useAppStore.getState().toggleBookmark(bId)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.4375rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        REMOVE
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
