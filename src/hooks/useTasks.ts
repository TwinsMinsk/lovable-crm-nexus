
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          contact:contact_id(id, name),
          order:order_id(id, order_number)
        `)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data;
    },
  });
};
