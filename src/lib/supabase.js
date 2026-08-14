import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://icvbteranfzufwzwnjyc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImljdmJ0ZXJhbmZ6dWZ3enduanljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDYxMjksImV4cCI6MjEwMjI4MjEyOX0.aB1KY_gLVwdmXY-jqGcXfKDnZPKr6z0vhMoJLXCB3eE';

export const isSupabaseConfigured = () => {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL.includes('supabase.co'));
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
