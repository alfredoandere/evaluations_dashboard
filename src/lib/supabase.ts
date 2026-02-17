import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://tcmcxkqyijemoerlunfw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tnvkwM2BOobwKmgWnPCwOA_OCozuhof';

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Missing Supabase environment variables. Auth disabled.');
  const noopResult = {
    data: { session: null, subscription: { unsubscribe: () => {} }, user: null },
    error: null,
    then: (fn: (v: unknown) => unknown) => Promise.resolve(fn({ data: { session: null }, error: null })),
  };
  const handler: ProxyHandler<object> = {
    get: () => new Proxy(() => noopResult, handler),
    apply: () => noopResult,
  };
  supabase = new Proxy({} as unknown as SupabaseClient, handler) as SupabaseClient;
}

export { supabase };
