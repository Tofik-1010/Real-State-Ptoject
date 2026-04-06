import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

interface MockUser {
  email: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'propnest_user';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, _password: string) => {
    const u = { email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { error: null };
  };

  const signIn = async (email: string, _password: string) => {
    const u = { email };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    setUser(u);
    return { error: null };
  };

  const signOut = async () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
