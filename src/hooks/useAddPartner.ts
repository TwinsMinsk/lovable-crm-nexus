
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { CreatePartnerData, Partner } from "@/types/partner";
import { useAuth } from "@/context/AuthContext";

export function useAddPartner() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (partnerData: Omit<CreatePartnerData, "user_id">): Promise<Partner> => {
      if (!user) {
        throw new Error("Пользователь не авторизован");
      }

      const newPartner = {
        ...partnerData,
        user_id: user.id
      };

      const { data, error } = await supabase
        .from("partners")
        .insert(newPartner)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
    }
  });
}
