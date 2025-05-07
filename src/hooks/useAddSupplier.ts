
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { CreateSupplierData, Supplier } from "@/types/supplier";
import { useAuth } from "@/context/AuthContext";

export function useAddSupplier() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (supplierData: Omit<CreateSupplierData, "user_id">): Promise<Supplier> => {
      if (!user) {
        throw new Error("Пользователь не авторизован");
      }

      const newSupplier = {
        ...supplierData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from("suppliers")
        .insert(newSupplier)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
    }
  });
}
