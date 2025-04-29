
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AddTaskData {
  description: string;
  status: "Новая" | "В работе" | "Выполнена";
  due_date: string;
  responsible_user_id?: string;
  contact_id?: string;
  order_id?: string;
}

export const useAddTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddTaskData) => {
      const { error } = await supabase.from("tasks").insert({
        ...data,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Задача успешно добавлена");
    },
    onError: (error) => {
      toast.error(`Ошибка при добавлении задачи: ${error.message}`);
    },
  });
};
