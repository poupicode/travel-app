import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://yltjsrufzpjsowkrpjov.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsdGpzcnVmenBqc293a3Jwam92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjIwODUsImV4cCI6MjA4Njg5ODA4NX0.EAN7p7dj9oJtCX85wXfB_fx6YKMCIUS6ZpU9hYDBFxg';

// Adaptateur SecureStore pour persister la session sur mobile
const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
