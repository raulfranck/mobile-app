import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import supabase from './client';

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
};

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<void> => {
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
};

export const signOut = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentSession = async (): Promise<Session | null> => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

export const onAuthStateChange = (
  callback: (
    _event:
      | 'SIGNED_IN'
      | 'SIGNED_OUT'
      | 'TOKEN_REFRESHED'
      | 'USER_UPDATED'
      | 'USER_DELETED',
    _session: Session | null
  ) => void
) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    // Narrow types for Supabase v2 signature (event: AuthChangeEvent, session: Session | null)
    callback(event as unknown as any, session);
  });
  return data.subscription;
};

export type { SupabaseUser };
