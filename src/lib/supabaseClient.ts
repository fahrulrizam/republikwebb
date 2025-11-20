// File: src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Pastikan variabel lingkungan dimuat sebelum membuat client
if (typeof supabaseUrl !== 'string' || !supabaseUrl) {
  throw new Error("🚨 Variabel lingkungan VITE_SUPABASE_URL tidak ditemukan.");
}

if (typeof supabaseAnonKey !== 'string' || !supabaseAnonKey) {
  throw new Error("🚨 Variabel lingkungan VITE_SUPABASE_ANON_KEY tidak ditemukan.");
}

// Karena kita sudah memastikan variabel lingkungan ada dan berupa string,
// kita bisa menginisialisasi client tanpa fallback || ''.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);