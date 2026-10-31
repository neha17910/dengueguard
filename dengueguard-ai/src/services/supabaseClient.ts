import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables or local storage overrides
const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const getStoredSupabaseConfig = () => {
  const customUrl = localStorage.getItem('dengueguard_supabase_url');
  const customKey = localStorage.getItem('dengueguard_supabase_key');
  return {
    url: customUrl || envUrl || '',
    key: customKey || envKey || '',
  };
};

export const saveSupabaseConfig = (url: string, key: string) => {
  if (url) localStorage.setItem('dengueguard_supabase_url', url);
  else localStorage.removeItem('dengueguard_supabase_url');

  if (key) localStorage.setItem('dengueguard_supabase_key', key);
  else localStorage.removeItem('dengueguard_supabase_key');
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key } = getStoredSupabaseConfig();
  if (!url || !key) {
    return null;
  }
  if (!cachedClient) {
    try {
      cachedClient = createClient(url, key);
    } catch (e) {
      console.warn('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return cachedClient;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getStoredSupabaseConfig();
  return Boolean(url && key && url.startsWith('http'));
};
