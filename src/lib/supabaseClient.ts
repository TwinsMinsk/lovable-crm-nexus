
import { createClient } from "@supabase/supabase-js";

// Use the client from integrations which has proper typings
import { supabase as typedClient } from "@/integrations/supabase/client";

export const supabase = typedClient;
