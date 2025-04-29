
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useOrder = (id: string | undefined) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          client:client_id(id, name),
          partner:partner_id(id, name)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
