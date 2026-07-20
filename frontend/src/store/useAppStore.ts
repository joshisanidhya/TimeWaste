import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProfile {
  username: string;
  email?: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastActive: string;
  isGuest: boolean;
  achievements: string[]; // List of unlocked achievement IDs
  bookmarks: string[]; // List of bookmarked lab IDs
  history: { labId: string; timestamp: string; xpEarned: number }[];
}

interface AppState {
  user: UserProfile | null;
  theme: 'dark' | 'light';
  token: string | null;
  activeLabId: string | null;
  xpToast: { show: boolean; amount: number; message: string } | null;
  
  // Actions
  setTheme: (theme: 'dark' | 'light') => void;
  loginAsGuest: (username?: string) => void;
  loginWithToken: (token: string, profile: UserProfile) => void;
  logout: () => void;
  setActiveLab: (labId: string | null) => void;
  addXP: (amount: number, reason: string) => void;
  toggleBookmark: (labId: string) => void;
  logActivity: (labId: string, xpEarned: number) => void;
  dismissXpToast: () => void;
}

const DEFAULT_GUEST_PROFILE = (name: string): UserProfile => ({
  username: name,
  avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${name}`,
  xp: 0,
  level: 1,
  streak: 1,
  lastActive: new Date().toISOString(),
  isGuest: true,
  achievements: [],
  bookmarks: [],
  history: [],
});

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      theme: 'dark',
      token: null,
      activeLabId: null,
      xpToast: null,

      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },

      loginAsGuest: (username = 'GuestCoder') => {
        const uniqueName = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
        set({
          user: DEFAULT_GUEST_PROFILE(uniqueName),
          token: 'guest-session-token',
        });
      },

      loginWithToken: (token, profile) => {
        set({ token, user: profile });
      },

      logout: () => {
        set({ user: null, token: null, activeLabId: null });
      },

      setActiveLab: (labId) => {
        set({ activeLabId: labId });
      },

      addXP: (amount, reason) => {
        const state = get();
        if (!state.user) return;

        const currentXp = state.user.xp + amount;
        // Formula: 500 XP per level
        const newLevel = Math.floor(currentXp / 500) + 1;
        const leveledUp = newLevel > state.user.level;

        const updatedAchievements = [...state.user.achievements];
        // Check for specific XP-based achievements
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
            history: [newLog, ...state.user.history].slice(0, 50), // Limit history length
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
