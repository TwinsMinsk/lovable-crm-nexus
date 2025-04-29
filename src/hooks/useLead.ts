
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useLead = (id: string | undefined) => {
  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
