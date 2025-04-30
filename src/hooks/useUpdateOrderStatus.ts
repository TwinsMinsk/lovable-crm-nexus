
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface UpdateOrderParams {
  orderId: string;
  newStatus: string;
  extraData?: Record<string, any>;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ orderId, newStatus, extraData = {} }: UpdateOrderParams) => {
      const updateData = {
        status: newStatus,
        ...extraData
      };
      
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
      
      return { id: orderId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", data.id] });
      toast.success("Статус заказа обновлен");
    },
    onError: (error: Error) => {
      toast.error(`Ошибка: ${error.message}`);
    }
  });
};
