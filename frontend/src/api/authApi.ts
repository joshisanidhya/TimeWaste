import type { UserProfile } from '../store/useAppStore';

const API_BASE = 'http://localhost:5000/api/auth';

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Ensure HttpOnly cookies are sent and received
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Authentication error occurred.');
  }

  return data as T;
}

export const authApi = {
  async me(): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/me');
  },

  async register(username: string, email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async guestLogin(username?: string): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/guest', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  async logout(): Promise<void> {
    await apiFetch<{ message: string }>('/logout', { method: 'POST' });
  },

  async promoteGuest(
    username: string,
    email: string,
    password: string,
    guestData?: Partial<UserProfile>
  ): Promise<AuthResponse> {
    return apiFetch<AuthResponse>('/promote-guest', {
      method: 'POST',
      body: JSON.stringify({ username, email, password, guestData }),
    });
  },

  getGithubOAuthUrl(): string {
    return `${API_BASE}/github`;
  },
};
