const SUPABASE_URL = 'https://inzlukavtebaspwapxbd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluemx1a2F2dGViYXNwd2FweGJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NjQwNTIsImV4cCI6MjA2MTM0MDA1Mn0.buI2zUOxv1HdP_G-gmhKihPLDqRvwOYuA5PUV3wyPfY';

window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);