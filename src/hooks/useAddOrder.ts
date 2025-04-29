
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AddOrderData {
  order_number: string;
  client_id: string;
  order_type: "Изготовление" | "Готовая мебель";
  status: string;
  amount: number;
  responsible_user_id?: string;
  partner_id?: string;
  items?: any[];
  payment_status?: string;
  addresses?: any[];
  notes?: string;
}

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddOrderData) => {
      const { error } = await supabase.from("orders").insert({
        ...data,
        items: data.items || [],
        addresses: data.addresses || [],
        payment_status: data.payment_status || "Не оплачен",
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Заказ успешно добавлен");
    },
    onError: (error) => {
      toast.error(`Ошибка при добавлении заказа: ${error.message}`);
    },
  });
};
