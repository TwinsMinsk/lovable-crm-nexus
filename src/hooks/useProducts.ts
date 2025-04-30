
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Product } from "@/types/product";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async (): Promise<Product[]> => {
      // Use any type to bypass TypeScript's type checking for the table name
      // since the database schema might not be fully reflected in the types
      const { data, error } = await (supabase as any)
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Ensure the data matches the Product interface
      const products = data?.map(item => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        description: item.description || null,
        sku: item.sku || null,
        price: item.price || 0,
        image_url: item.image_url || null,
        user_id: item.user_id
      })) || [];

      return products;
    }
  });
}
