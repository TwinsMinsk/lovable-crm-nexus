
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Supplier } from "@/types/supplier";

export function useUpdateSupplier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...supplierData }: Partial<Supplier> & { id: string }): Promise<Supplier> => {
      // Include updated_at
      const updatedData = {
        ...supplierData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from("suppliers")
        .update(updatedData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      queryClient.invalidateQueries({ queryKey: ["supplier", variables.id] });
    }
  });
}
