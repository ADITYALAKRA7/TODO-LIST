
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://jhnptadhfbyhnynoziwb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpobnB0YWRoZmJ5aG55bm96aXdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxODA5NTUsImV4cCI6MjA2Mzc1Njk1NX0.dN11pqN9pFOV9c23j3dvX3T-gjk5lyzpDT55trRuf9k";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
