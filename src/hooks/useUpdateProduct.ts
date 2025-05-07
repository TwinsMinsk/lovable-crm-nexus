
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { UpdateProductData } from "@/types/product";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProductData) => {
      const { id, ...productData } = data;

      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.id] });
    }
  });
}
