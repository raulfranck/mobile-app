import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey: string = process.env
  .EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail fast to help diagnose missing env vars during development

  console.warn(
    'Supabase environment variables are missing. Check .env and EXPO_PUBLIC_* values.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as unknown as ReturnType<
      typeof createClient
    >['auth']['storage'],
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default supabase;
