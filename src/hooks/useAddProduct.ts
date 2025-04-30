
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { CreateProductData, Product } from "@/types/product";
import { useAuth } from "@/context/AuthContext";

export function useAddProduct() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (productData: Omit<CreateProductData, "user_id">): Promise<Product> => {
      if (!user) {
        throw new Error("Пользователь не авторизован");
      }

      const newProduct = {
        ...productData,
        user_id: user.id
      };

      // Use any type to bypass TypeScript's type checking
      const { data, error } = await (supabase as any)
        .from("products")
        .insert(newProduct)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    }
  });
}
