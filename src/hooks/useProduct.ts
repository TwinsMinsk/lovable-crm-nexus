
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["product", id],
    queryFn: async (): Promise<Product | null> => {
      if (!id) return null;
      
      // Use any type to bypass TypeScript's type checking
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Product not found
        }
        throw new Error(error.message);
      }

      // Ensure the data matches the Product interface
      const product: Product = {
        id: data.id,
        created_at: data.created_at,
        name: data.name,
        description: data.description || null,
        sku: data.sku || null,
        price: data.price || 0,
        image_url: data.image_url || null,
        user_id: data.user_id,
        default_supplier_id: data.default_supplier_id || null
      };

      return product;
    },
    enabled: !!id
  });
}
