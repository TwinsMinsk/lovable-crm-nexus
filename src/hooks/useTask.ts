
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useTask = (id: string | undefined) => {
  return useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          contact:contact_id(id, name),
          order:order_id(id, order_number)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};
