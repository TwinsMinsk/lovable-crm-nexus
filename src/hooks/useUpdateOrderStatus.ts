
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      orderId, 
      newStatus,
      extraData = {} 
    }: { 
      orderId: string; 
      newStatus: string;
      extraData?: Record<string, any>;
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status: newStatus, ...extraData })
        .eq("id", orderId)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
    },
  });
};
