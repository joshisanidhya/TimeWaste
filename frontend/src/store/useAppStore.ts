import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';

export interface UserProfile {
  id?: string;
  username: string;
  email?: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  isGuest: boolean;
  achievements: string[];
  bookmarks: string[];
  history: { labId: string; timestamp: string; xpEarned: number }[];
}

export type ThemeMode = 'dark' | 'light' | 'system';

interface AppState {
  user: UserProfile | null;
  theme: ThemeMode;
  token: string | null;
  activeLabId: string | null;
  xpToast: { show: boolean; amount: number; message: string } | null;
  isAuthInitializing: boolean;
  authError: string | null;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  checkSession: () => Promise<void>;
  loginAsGuest: (username?: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  registerWithCredentials: (username: string, email: string, password: string) => Promise<void>;
  promoteGuestAccount: (username: string, email: string, password: string) => Promise<void>;
  loginWithToken: (token: string, profile: UserProfile) => void;
  logout: () => Promise<void>;
  setActiveLab: (labId: string | null) => void;
  addXP: (amount: number, reason: string) => void;
  toggleBookmark: (labId: string) => void;
  logActivity: (labId: string, xpEarned: number) => void;
  dismissXpToast: () => void;
  clearAuthError: () => void;
}

const DEFAULT_GUEST_PROFILE = (name: string): UserProfile => ({
  username: name,
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
  xp: 0,
  level: 1,
  streak: 1,
  lastActive: new Date().toISOString(),
  isGuest: true,
  achievements: [],
  bookmarks: [],
  history: [],
});

export const applyThemeToDom = (theme: ThemeMode) => {
  let isDark: boolean;
  if (theme === 'system') {
    isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    isDark = theme === 'dark';
  }
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'dark',
      token: null,
      activeLabId: null,
      xpToast: null,
      isAuthInitializing: true,
      authError: null,

      setTheme: (theme) => {
        set({ theme });
        applyThemeToDom(theme);
      },

      clearAuthError: () => set({ authError: null }),

      checkSession: async () => {
        applyThemeToDom(get().theme);
        set({ isAuthInitializing: true, authError: null });
        try {
          const res = await authApi.me();
          if (res.user) {
            set({ user: res.user, token: res.token || get().token, isAuthInitializing: false });
            return;
          }
        } catch {
          const currentUser = get().user;
          if (currentUser && !currentUser.isGuest) {
            set({ user: null, token: null, isAuthInitializing: false });
            return;
          }
        }
        set({ isAuthInitializing: false });
      },

      loginAsGuest: async (username = 'GuestCoder') => {
        set({ authError: null });
        try {
          const res = await authApi.guestLogin(username);
          set({ user: res.user, token: res.token || 'guest-session-token' });
        } catch {
          const uniqueName = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
          set({
            user: DEFAULT_GUEST_PROFILE(uniqueName),
            token: 'guest-session-token',
          });
        }
      },

      loginWithCredentials: async (email, password) => {
        set({ authError: null });
        try {
          const res = await authApi.login(email, password);
          set({ user: res.user, token: res.token || 'app-session-token' });
        } catch (error: unknown) {
          set({ authError: (error as Error).message || 'Login failed.' });
          throw error;
        }
      },

      registerWithCredentials: async (username, email, password) => {
        set({ authError: null });
        try {
          const res = await authApi.register(username, email, password);
          set({ user: res.user, token: res.token || 'app-session-token' });
        } catch (error: unknown) {
          set({ authError: (error as Error).message || 'Registration failed.' });
          throw error;
        }
      },

      promoteGuestAccount: async (username, email, password) => {
        set({ authError: null });
        const guestUser = get().user;
        try {
          const res = await authApi.promoteGuest(username, email, password, guestUser || undefined);
          set({ user: res.user, token: res.token || 'app-session-token' });
        } catch (error: unknown) {
          set({ authError: (error as Error).message || 'Guest account promotion failed.' });
          throw error;
        }
      },

      loginWithToken: (token, profile) => {
        set({ token, user: profile, authError: null });
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch {
          // Silent fallback
        }
        set({ user: null, token: null, activeLabId: null, authError: null });
      },

      setActiveLab: (labId) => {
        set({ activeLabId: labId });
      },

      addXP: (amount, reason) => {
        const state = get();
        if (!state.user) return;

        const currentXp = state.user.xp + amount;
        const newLevel = Math.floor(currentXp / 500) + 1;
        const leveledUp = newLevel > state.user.level;

        const updatedAchievements = [...state.user.achievements];
        if (currentXp >= 100 && !updatedAchievements.includes('first-steps')) {
          updatedAchievements.push('first-steps');
        }
        if (currentXp >= 1000 && !updatedAchievements.includes('grindmaster')) {
          updatedAchievements.push('grindmaster');
        }
        if (newLevel >= 5 && !updatedAchievements.includes('elite-dev')) {
          updatedAchievements.push('elite-dev');
        }

        set({
          user: {
            ...state.user,
            xp: currentXp,
            level: newLevel,
            achievements: updatedAchievements,
          },
          xpToast: {
            show: true,
            amount,
            message: leveledUp ? `LEVEL UP! You reached Level ${newLevel}! 🎉` : reason,
          },
        });
      },

      toggleBookmark: (labId) => {
        const state = get();
        if (!state.user) return;

        const isBookmarked = state.user.bookmarks.includes(labId);
        const bookmarks = isBookmarked
          ? state.user.bookmarks.filter((id) => id !== labId)
          : [...state.user.bookmarks, labId];

        set({
          user: {
            ...state.user,
            bookmarks,
          },
        });
      },

      logActivity: (labId, xpEarned) => {
        const state = get();
        if (!state.user) return;

        const newLog = {
          labId,
          timestamp: new Date().toISOString(),
          xpEarned,
        };

        set({
          user: {
            ...state.user,
            history: [newLog, ...state.user.history].slice(0, 50),
          },
        });
        
        if (xpEarned > 0) {
          get().addXP(xpEarned, `Completed activity in ${labId}`);
        }
      },

      dismissXpToast: () => {
        set({ xpToast: null });
      },
    }),
    {
      name: 'playorithm-storage',
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        token: state.token,
      }),
    }
  )
);

// Apply saved theme on boot
if (typeof window !== 'undefined') {
  setTimeout(() => {
    applyThemeToDom(useAppStore.getState().theme);
  }, 0);
}
