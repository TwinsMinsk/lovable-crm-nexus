
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kfujvyirpoukoitnqjmu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmdWp2eWlycG91a29pdG5xam11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4Mzc0MzcsImV4cCI6MjA2MTQxMzQzN30.623eJwmM5xmifbBmCS3pay6SFMXxJFm_OQjhEdrQ59g";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
