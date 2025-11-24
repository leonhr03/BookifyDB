import { createClient } from '@supabase/supabase-js';


const SUPABASE_URL = 'https://svprfnonvhnlmlwimwvf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2cHJmbm9udmhubG1sd2ltd3ZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5MTk0NTgsImV4cCI6MjA3OTQ5NTQ1OH0.xsXkeOJSIQsMQl5kc1YOyC22jDuhLJbnjAdTBmd7_Ik';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
