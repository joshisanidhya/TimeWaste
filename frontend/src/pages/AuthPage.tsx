import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import { authApi } from '@/api/authApi';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Shield, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const {
    user,
    loginAsGuest,
    loginWithCredentials,
    registerWithCredentials,
    promoteGuestAccount,
    authError,
    clearAuthError,
  } = useAppStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialMode = searchParams.get('mode');
  const [mode, setMode] = useState<'guest' | 'login' | 'signup'>(
    initialMode === 'login' ? 'login' : initialMode === 'signup' ? 'signup' : 'guest'
  );

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successState, setSuccessState] = useState<string | null>(null);

  const errorParam = searchParams.get('error');
  const oauthMsg = errorParam === 'invalid_state'
    ? 'OAuth state verification failed. Please try again.'
    : errorParam === 'github_token_failed'
    ? 'Failed to authenticate with GitHub.'
    : errorParam
    ? 'GitHub authentication encountered an issue.'
    : null;

  const handleGuestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();
    setIsLoading(true);
    try {
      await loginAsGuest(username.trim() || undefined);
      setSuccessState('GUEST SESSION INITIALIZED');
      setTimeout(() => navigate('/'), 700);
    } catch {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();

    if (mode === 'signup') {
      if (!username || username.trim().length < 3) {
        setValidationError('Username must be at least 3 characters.');
        return;
      }
      if (password.length < 6) {
        setValidationError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setValidationError('Passwords do not match.');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithCredentials(email, password);
      } else {
        if (user && user.isGuest) {
          await promoteGuestAccount(username.trim(), email.trim(), password);
        } else {
          await registerWithCredentials(username.trim(), email.trim(), password);
        }
      }
      const displayName = username || email.split('@')[0];
      setSuccessState(`IDENTITY VERIFIED / Welcome, ${displayName}`);
      setTimeout(() => navigate('/'), 900);
    } catch {
      setIsLoading(false);
    }
  };

  const handleGitHubClick = () => {
    setIsLoading(true);
    window.location.href = authApi.getGithubOAuthUrl();
  };

  const TABS = [
    { key: 'guest' as const, label: 'GUEST' },
    { key: 'login' as const, label: 'LOG IN' },
    { key: 'signup' as const, label: 'REGISTER' },
  ];

  const LEFT_COPY: Record<typeof mode, { headline: string; sub: string }> = {
    guest: {
      headline: 'GUEST SESSION',
      sub: 'No account required. Explore experiments immediately. Progress can be promoted to an account later.',
    },
    login: {
      headline: 'IDENTITY GATE',
      sub: 'Experiments are better when they remember you. Sign in to restore your progress, XP, and streak.',
    },
    signup: {
      headline: 'CREATE IDENTITY',
      sub: 'Join the laboratory. Earn XP, unlock achievements, build streaks, and appear on the leaderboard.',
    },
  };

  if (successState) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--bg-obsidian)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center' }}
        >
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--signal-text)',
              marginBottom: '1rem',
            }}
          >
            {successState}
          </div>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--text-tertiary)',
            }}
          >
            RESTORING EXPERIMENTS...
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: 'var(--bg-obsidian)' }}
    >
      {/* ─── Left Panel ─── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 xl:p-16"
        style={{
          width: '42%',
          flexShrink: 0,
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-carbon)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Grid background */}
        <div className="absolute inset-0 grid-pattern opacity-40 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div
            style={{
              width: 20,
              height: 20,
              border: '1.5px solid var(--signal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.4rem',
                fontWeight: 900,
                color: 'var(--signal)',
              }}
            >
              PL
            </span>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 900,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            PLAYORITHM
          </span>
        </div>

        {/* Center copy — changes with mode */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="relative z-10"
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
              {LEFT_COPY[mode].headline}
            </div>
            <p
              style={{
                fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: '1.5rem',
              }}
            >
              {mode === 'guest' && 'No account required.'}
              {mode === 'login' && 'Welcome back,\nexperimenter.'}
              {mode === 'signup' && 'Build your developer identity.'}
            </p>
            <p
              style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 320,
              }}
            >
              {LEFT_COPY[mode].sub}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div
          className="relative z-10"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.5rem',
            letterSpacing: '0.1em',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
          }}
        >
          DIGITAL EXPERIMENTAL LABORATORY · 2026
        </div>
      </div>

      {/* ─── Right Panel ─── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          style={{ width: '100%', maxWidth: 440 }}
        >
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div
              style={{
                width: 18,
                height: 18,
                border: '1.5px solid var(--signal)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.35rem', fontWeight: 900, color: 'var(--signal)' }}>PL</span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>PLAYORITHM</span>
          </div>

          {/* Guest promotion banner */}
          {user && user.isGuest && (
            <div
              style={{
                padding: '12px 16px',
                border: '1px solid var(--border-signal)',
                background: 'var(--signal-dim)',
                marginBottom: '1.5rem',
                fontSize: '0.6875rem',
                color: 'var(--signal-text)',
                lineHeight: 1.6,
              }}
            >
              Create an account to preserve your guest XP ({user.xp} XP) and achievements.
            </div>
          )}

          {/* Tab controls */}
          <div
            className="flex mb-8"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setMode(tab.key);
                  setValidationError(null);
                  clearAuthError();
                }}
                style={{
                  flex: 1,
                  padding: '10px 4px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: `2px solid ${mode === tab.key ? 'var(--signal)' : 'transparent'}`,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.5625rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: mode === tab.key ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  fontWeight: mode === tab.key ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'color 0.15s ease, border-color 0.15s ease',
                  marginBottom: -1,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Errors */}
          {(validationError || authError || oauthMsg) && (
            <div
              style={{
                padding: '12px 16px',
                border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.06)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                fontSize: '0.6875rem',
                color: '#f87171',
                lineHeight: 1.6,
              }}
            >
              <AlertCircle size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{validationError || authError || oauthMsg}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Guest form */}
              {mode === 'guest' && (
                <form onSubmit={handleGuestSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      GUEST HANDLE (OPTIONAL)
                    </label>
                    <input
                      type="text"
                      placeholder="LambdaCoder"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      maxLength={20}
                      className="glass-input"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '0.875rem',
                        borderRadius: 0,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    data-cursor="open"
                    style={{
                      width: '100%',
                      padding: '13px',
                      background: 'var(--signal)',
                      color: 'var(--bg-obsidian)',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    {isLoading ? (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: '2px solid var(--bg-obsidian)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                        }}
                      />
                    ) : (
                      <>CONTINUE AS GUEST <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>
              )}

              {/* Login/Signup form */}
              {(mode === 'login' || mode === 'signup') && (
                <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {mode === 'signup' && (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        USERNAME
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="sanidhya_dev"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="glass-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          fontSize: '0.875rem',
                          borderRadius: 0,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  )}

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="dev@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="glass-input"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '0.875rem',
                        borderRadius: 0,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.5rem',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: 'var(--text-tertiary)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="glass-input"
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        fontSize: '0.875rem',
                        borderRadius: 0,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {mode === 'signup' && (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.5rem',
                          letterSpacing: '0.12em',
                          textTransform: 'uppercase',
                          color: 'var(--text-tertiary)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        CONFIRM PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="glass-input"
                        style={{
                          width: '100%',
                          padding: '11px 14px',
                          fontSize: '0.875rem',
                          borderRadius: 0,
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    data-cursor="open"
                    style={{
                      width: '100%',
                      padding: '13px',
                      background: 'var(--signal)',
                      color: 'var(--bg-obsidian)',
                      border: 'none',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.6875rem',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      fontWeight: 700,
                      cursor: isLoading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      opacity: isLoading ? 0.7 : 1,
                      transition: 'opacity 0.15s ease',
                    }}
                  >
                    {isLoading ? (
                      <div
                        style={{
                          width: 16,
                          height: 16,
                          border: '2px solid var(--bg-obsidian)',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          animation: 'spin 0.7s linear infinite',
                        }}
                      />
                    ) : mode === 'login' ? (
                      <>ENTER PLAYORITHM <ArrowRight size={14} /></>
                    ) : (
                      <>CREATE IDENTITY <ArrowRight size={14} /></>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Divider */}
          <div
            className="flex items-center gap-3 my-6"
          >
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.4375rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              OR CONTINUE WITH
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
          </div>

          {/* GitHub button */}
          <button
            onClick={handleGitHubClick}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '13px',
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-default)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: isLoading ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'border-color 0.15s ease, background 0.15s ease',
              opacity: isLoading ? 0.6 : 1,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-strong)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-surface)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-default)';
              (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            CONTINUE WITH GITHUB
          </button>

          {/* Security note */}
          <div
            className="flex items-center justify-center gap-2 mt-6"
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5rem',
              letterSpacing: '0.08em',
              color: 'var(--text-tertiary)',
            }}
          >
            <Shield size={11} style={{ color: 'var(--signal-text)', opacity: 0.6 }} />
            ENCRYPTED JWT SESSIONS · HTTPONLY COOKIES
          </div>
        </motion.div>
      </div>
    </div>
  );
};

/* Keyframe for loading spinner */
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
if (typeof document !== 'undefined' && !document.getElementById('auth-spin')) {
  style.id = 'auth-spin';
  document.head.appendChild(style);
}
