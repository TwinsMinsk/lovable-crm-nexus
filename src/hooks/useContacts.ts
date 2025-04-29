
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useContacts = () => {
  return useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};
