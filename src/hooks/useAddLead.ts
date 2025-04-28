
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AddLeadData {
  name: string;
  phone?: string;
  email?: string;
  source?: string;
  status: string;
  responsible_user_id?: string;
  comment?: string;
}

export const useAddLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddLeadData) => {
      const { error } = await supabase.from("leads").insert({
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Лид успешно добавлен");
    },
    onError: (error) => {
      toast.error(`Ошибка при добавлении лида: ${error.message}`);
    },
  });
};
