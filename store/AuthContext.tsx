import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signOut as supaSignOut,
  signUpWithEmail,
} from '@/services/supabase/authService';
import type { SupabaseUser } from '@/services/supabase/authService';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  initialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      try {
        const current = await getCurrentSession();
        setSession(current);
        setUser(current?.user ?? null);
      } finally {
        setInitialized(true);
      }
    };
    void init();

    const subscription = onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await signInWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      await signUpWithEmail(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      await supaSignOut();
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo(
    () => ({ user, session, signIn, signUp, signOut, loading, initialized }),
    [user, session, loading, initialized]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
