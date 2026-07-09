/**
 * @author Raja Haikal
 * @description Supabase client instance
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey);

const createDisabledSupabaseClient = (): SupabaseClient => {
  const query = {
    select: () => query,
    eq: () => query,
    order: () => query,
    update: () => query,
    insert: () => query,
    delete: () => query,
    then: (resolve: (value: { data: unknown[]; error: null }) => void) =>
      Promise.resolve({ data: [] as unknown[], error: null }).then(resolve),
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => undefined,
          },
        },
      }),
      signInWithPassword: async () => ({
        data: { user: null, session: null },
        error: { message: 'Supabase is not configured.' },
      }),
      signOut: async () => ({ error: null }),
    },
    from: () => query,
  } as unknown as SupabaseClient;
};

export const supabase = hasSupabaseConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createDisabledSupabaseClient();
