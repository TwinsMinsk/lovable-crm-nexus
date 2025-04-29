
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

interface AddContactData {
  name: string;
  phones?: any[];
  emails?: any[];
  responsible_user_id?: string;
  notes?: string;
}

export const useAddContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddContactData) => {
      const { error } = await supabase.from("contacts").insert({
        ...data,
        phones: data.phones || [],
        emails: data.emails || [],
        user_id: (await supabase.auth.getUser()).data.user?.id,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast.success("Контакт успешно добавлен");
    },
    onError: (error) => {
      toast.error(`Ошибка при добавлении контакта: ${error.message}`);
    },
  });
};
