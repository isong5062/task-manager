// src/supabaseClient.js

// Import the createClient function from the Supabase JavaScript library
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with environment variables
// Supabase URL: URL to your Supabase instance
// Supabase Key: Anon key to allow public access to the Supabase instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create and export the Supabase client instance
// This instance is used throughout the application to interact with the database
export const supabase = createClient(supabaseUrl, supabaseKey);
