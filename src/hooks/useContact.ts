
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Json } from "@/integrations/supabase/types";

export interface FileInfo {
  path: string;
  url: string;
  name: string;
  size?: number;
  type?: string;
}

export interface Contact {
  id: string;
  name: string;
  phones: Json;
  emails: Json;
  files: Json;
  responsible_user_id: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
}

export const useContact = (id: string | undefined) => {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Contact;
    },
    enabled: !!id,
  });
};
