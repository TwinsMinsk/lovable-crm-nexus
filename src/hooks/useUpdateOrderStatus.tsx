
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/utils/notificationHelpers";

interface UpdateOrderParams {
  orderId: string;
  newStatus: string;
  extraData?: Record<string, any>;
}

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ orderId, newStatus, extraData = {} }: UpdateOrderParams) => {
      const updateData = {
        status: newStatus,
        ...extraData
      };
      
      // Получаем информацию о заказе перед обновлением
      const { data: orderData, error: fetchError } = await supabase
        .from("orders")
        .select("responsible_user_id, order_number")
        .eq("id", orderId)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Обновляем заказ
      const { error } = await supabase
        .from("orders")
        .update(updateData)
        .eq("id", orderId);

      if (error) throw error;
      
      // Если есть ответственный пользователь, создаем уведомление
      if (orderData?.responsible_user_id && user?.id) {
        await createNotification({
          userId: orderData.responsible_user_id,
          message: `Заказ №${orderData.order_number} изменил статус на "${newStatus}"`,
          relatedTable: "orders",
          relatedId: orderId,
        });
      }
      
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
