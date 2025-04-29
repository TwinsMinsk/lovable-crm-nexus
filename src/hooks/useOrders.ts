
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          client:client_id(id, name),
          partner:partner_id(id, name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
