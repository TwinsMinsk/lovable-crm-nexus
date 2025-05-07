
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Supplier } from "@/types/supplier";

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ["supplier", id],
    queryFn: async (): Promise<Supplier | null> => {
      if (!id) return null;
      
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Supplier not found
        }
        throw new Error(error.message);
      }

      return data;
    },
    enabled: !!id
  });
}
