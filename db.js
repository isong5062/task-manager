// src/db.js

/**
 * Supabase Client Configuration
 * -----------------------------
 * This file sets up the Supabase client to interact with the Supabase backend database.
 * It reads the URL and public key from environment variables for security.
 * The client is then used throughout the application for database interactions.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase URL and Anonymous Key from environment variables for security
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Initialize and export Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);