import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { LABS_REGISTRY, LAB_CATEGORIES } from '@/labs/registry';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, Check, Send, LayoutGrid, List } from 'lucide-react';

const CATEGORY_VAR: Record<string, string> = {
  ai: 'var(--cat-ai)',
  ml: 'var(--cat-ml)',
  probability: 'var(--cat-probability)',
  fun: 'var(--cat-fun)',
  game: 'var(--cat-game)',
  utility: 'var(--cat-utility)',
  analytics: 'var(--cat-analytics)',
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, toggleBookmark, addXP, logActivity } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'index'>('grid');
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

  const filteredLabs = useMemo(() => {
    return LABS_REGISTRY.filter((lab) => {
      const matchesSearch =
        lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lab.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || lab.category === activeCategory;
      const matchesStatus = statusFilter === 'all' || lab.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchQuery, activeCategory, statusFilter]);

  const handleRequestFeature = (labId: string, labName: string) => {
    if (requestedLabs.includes(labId)) return;
    setRequestedLabs((prev) => [...prev, labId]);
    addXP(10, `Requested feature: ${labName} 💡`);
    logActivity(labId, 0);
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* ─── Header ─── */}
      <div
        className="flex flex-col md:flex-row md:items-end justify-between gap-5 pb-6 mb-6"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--signal-text)',
              marginBottom: '0.4rem',
            }}
          >
            EXPERIMENT CATALOGUE
          </div>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 900,
              letterSpacing: '-0.025em',
              color: 'var(--text-primary)',
              margin: 0,
            }}
          >
            Developer Labs{' '}
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                color: 'var(--text-tertiary)',
                verticalAlign: 'middle',
              }}
            >
              [{filteredLabs.length}]
            </span>
          </h1>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
            Select any intelligence module to run, or request future integrations.
          </p>
        </div>

        {/* Search + view toggle */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
              }}
            />
            <input
              type="text"
              placeholder="Search experiments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="glass-input"
              style={{
                paddingLeft: 32,
                paddingRight: 14,
                paddingTop: 8,
                paddingBottom: 8,
                fontSize: '0.75rem',
                borderRadius: 0,
                minWidth: 220,
                fontFamily: 'var(--font-sans)',
              }}
            />
          </div>

          {/* View mode */}
          <div
            className="flex"
            style={{ border: '1px solid var(--border-default)' }}
          >
            {(['grid', 'index'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: '7px 10px',
                  background: viewMode === mode ? 'var(--bg-surface)' : 'transparent',
                  border: 'none',
                  color: viewMode === mode ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'all 0.15s ease',
                }}
              >
                {mode === 'grid' ? <LayoutGrid size={14} /> : <List size={14} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Category Filter ─── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {[{ id: 'all', name: 'ALL' }, ...LAB_CATEGORIES.map((c) => ({ id: c.id, name: c.name.toUpperCase() }))].map(
          (cat) => {
            const isActive = activeCategory === cat.id;
            const catColor = CATEGORY_VAR[cat.id] || 'var(--text-primary)';
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  padding: '5px 12px',
                  border: `1px solid ${isActive ? catColor : 'var(--border-default)'}`,
                  background: isActive ? `${catColor}14` : 'transparent',
                  color: isActive ? catColor : 'var(--text-tertiary)',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 400,
                  transition: 'all 0.15s ease',
                }}
              >
                {cat.name}
              </button>
            );
          }
        )}
      </div>

      {/* Status pills */}
      <div className="flex items-center gap-2 mb-8">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-tertiary)',
          }}
        >
          STATUS:
        </span>
        {(['all', 'active', 'coming-soon'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              background: statusFilter === s ? 'var(--bg-surface)' : 'transparent',
              border: `1px solid ${statusFilter === s ? 'var(--border-strong)' : 'transparent'}`,
              color: statusFilter === s ? 'var(--text-primary)' : 'var(--text-tertiary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {s === 'coming-soon' ? 'IN DEVELOPMENT' : s.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ─── Empty State ─── */}
      {filteredLabs.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '5rem 2rem',
            border: '1px dashed var(--border-default)',
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
            NO EXPERIMENTS FOUND.
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Adjust your filters and try again.
          </p>
        </div>
      )}

      {/* ─── Grid View ─── */}
      {filteredLabs.length > 0 && viewMode === 'grid' && (
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredLabs.map((lab) => {
              const isActive = lab.status === 'active';
              const isBookmarked = user?.bookmarks.includes(lab.id);
              const hasRequested = requestedLabs.includes(lab.id);
              const catColor = CATEGORY_VAR[lab.category] || 'var(--signal)';
              const num = String(LABS_REGISTRY.indexOf(lab) + 1).padStart(3, '0');

              return (
                <motion.div
                  key={lab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  data-cursor={isActive ? 'run' : 'soon'}
                  style={{
                    padding: '1.5rem',
                    border: '1px solid var(--border-default)',
                    background: 'var(--bg-elevated)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 220,
                    opacity: isActive ? 1 : 0.65,
                    cursor: isActive ? 'pointer' : 'default',
                    transition: 'border-color 0.15s ease, background 0.15s ease',
                  }}
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
                  {/* Left accent */}
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 3,
                      background: catColor,
                      opacity: isActive ? 0.6 : 0.2,
                    }}
                  />

                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.14em',
                          color: catColor,
                          opacity: 0.8,
                        }}
                      >
                        LAB_{num}
                      </span>
                      <div className="flex items-center gap-2">
                        {isActive ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleBookmark(lab.id); }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              cursor: 'pointer',
                              color: isBookmarked ? 'var(--cat-fun)' : 'var(--text-tertiary)',
                              padding: '2px',
                              display: 'flex',
                              transition: 'color 0.15s ease',
                            }}
                          >
                            <Star size={13} fill={isBookmarked ? 'currentColor' : 'none'} />
                          </button>
                        ) : (
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.5rem',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--cat-fun)',
                              border: '1px solid rgba(251,146,60,0.25)',
                              padding: '2px 6px',
                            }}
                          >
                            {lab.releaseDate || 'SOON'}
                          </span>
                        )}
                      </div>
                    </div>

                    <h3
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        letterSpacing: '-0.01em',
                        color: 'var(--text-primary)',
                        marginBottom: '0.4rem',
                      }}
                    >
                      {lab.name}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.6875rem',
                        color: 'var(--text-tertiary)',
                        lineHeight: 1.6,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {lab.description}
                    </p>
                  </div>

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

                    {isActive ? (
                      <button
                        onClick={() => navigate(`/labs/${lab.id}`)}
                        style={{
                          background: 'var(--signal)',
                          color: 'var(--bg-obsidian)',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '5px 14px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'opacity 0.15s ease',
                        }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = '0.85')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = '1')}
                      >
                        RUN ↗
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRequestFeature(lab.id, lab.name)}
                        disabled={hasRequested}
                        style={{
                          background: hasRequested ? 'rgba(199,255,61,0.06)' : 'transparent',
                          color: hasRequested ? 'var(--signal-text)' : 'var(--text-tertiary)',
                          border: `1px solid ${hasRequested ? 'var(--border-signal)' : 'var(--border-default)'}`,
                          cursor: hasRequested ? 'default' : 'pointer',
                          padding: '4px 10px',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {hasRequested ? (
                          <><Check size={11} /> REQUESTED</>
                        ) : (
                          <><Send size={11} /> REQUEST</>
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

      {/* ─── Index View ─── */}
      {filteredLabs.length > 0 && viewMode === 'index' && (
        <div style={{ border: '1px solid var(--border-subtle)' }}>
          {/* Header row */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: '3rem 1fr 7rem 5rem 5rem',
              padding: '0.5rem 1rem',
              borderBottom: '1px solid var(--border-default)',
              background: 'var(--bg-elevated)',
            }}
          >
            {['#', 'EXPERIMENT', 'CATEGORY', 'STATUS', 'ACTION'].map((h) => (
              <span
                key={h}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                }}
              >
                {h}
              </span>
            ))}
          </div>

          <AnimatePresence>
            {filteredLabs.map((lab, i) => {
              const isActive = lab.status === 'active';
              const catColor = CATEGORY_VAR[lab.category] || 'var(--signal)';
              const num = String(LABS_REGISTRY.indexOf(lab) + 1).padStart(3, '0');

              return (
                <motion.div
                  key={lab.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, delay: i * 0.02 }}
                  className="grid lab-index-row"
                  style={{
                    gridTemplateColumns: '3rem 1fr 7rem 5rem 5rem',
                    padding: '0.875rem 1rem',
                    cursor: isActive ? 'pointer' : 'default',
                    opacity: isActive ? 1 : 0.55,
                    alignItems: 'center',
                  }}
                  data-cursor={isActive ? 'run' : 'soon'}
                  onClick={() => isActive && navigate(`/labs/${lab.id}`)}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5625rem',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {num}
                  </span>
                  <div>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {lab.name}
                    </span>
                    <span
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.08em',
                        color: 'var(--text-tertiary)',
                        marginTop: 2,
                      }}
                    >
                      {lab.description.slice(0, 60)}...
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: catColor,
                    }}
                  >
                    {lab.category.toUpperCase()}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isActive ? 'var(--signal-text)' : 'var(--cat-fun)',
                    }}
                  >
                    {isActive ? 'ACTIVE' : 'SOON'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.5rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {isActive ? 'RUN ↗' : lab.releaseDate || '—'}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
