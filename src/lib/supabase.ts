import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.error('Missing Supabase environment variables. Check your .env file.');
  const handler: ProxyHandler<object> = {
    get: () => new Proxy(() => Promise.resolve({ data: { session: null, subscription: { unsubscribe: () => {} } }, error: null }), handler),
  };
  supabase = new Proxy({} as unknown as SupabaseClient, handler) as SupabaseClient;
}

export { supabase };
