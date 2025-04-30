
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      // Use any type to bypass TypeScript's type checking
      const { error } = await (supabase as any)
        .from("products")
        .delete()
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return { id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
