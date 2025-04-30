
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Partner } from "@/types/partner";

export function usePartner(id: string | undefined) {
  return useQuery({
    queryKey: ["partner", id],
    queryFn: async (): Promise<Partner | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Partner not found
        }
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });
}
