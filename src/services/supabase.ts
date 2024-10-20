import { createClient } from "@supabase/supabase-js";
export const supabaseUrl = "https://qakfqnihmzheictikheu.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFha2ZxbmlobXpoZWljdGlraGV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzODU5ODYsImV4cCI6MjA0MDk2MTk4Nn0.BeJrBl0KGG2x7Zju_6uMwit2NWc2v4kU23FltI4HXBk";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
