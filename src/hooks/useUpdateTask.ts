
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/utils/notificationHelpers";

interface UpdateTaskParams {
  id: string;
  data: {
    description?: string;
    status?: string;
    due_date?: string | null;
    contact_id?: string | null;
    order_id?: string | null;
    responsible_user_id?: string | null;
  };
}

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateTaskParams) => {
      // Получаем текущую задачу для получения данных перед обновлением
      const { data: currentTask, error: fetchError } = await supabase
        .from("tasks")
        .select("responsible_user_id, description")
        .eq("id", id)
        .single();
        
      if (fetchError) throw fetchError;
      
      // Обновляем задачу
      const { data: updatedTask, error } = await supabase
        .from("tasks")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      
      // Если изменился ответственный, отправляем уведомление
      if (data.responsible_user_id && 
          data.responsible_user_id !== currentTask?.responsible_user_id &&
          user?.id) {
          
        await createNotification({
          userId: data.responsible_user_id,
          message: `Вам назначена задача: ${data.description || currentTask?.description}`,
          relatedTable: "tasks",
          relatedId: id,
        });
      }
      
      // Если изменился статус, отправляем уведомление текущему ответственному
      if (data.status && currentTask?.responsible_user_id) {
        await createNotification({
          userId: currentTask.responsible_user_id,
          message: `Задача "${data.description || currentTask.description}" изменила статус на "${data.status}"`,
          relatedTable: "tasks",
          relatedId: id,
        });
      }
      
      return updatedTask;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.id] });
    },
  });
};
