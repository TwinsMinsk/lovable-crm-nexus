
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { UpdatePartnerData } from "@/types/partner";

export function useUpdatePartner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdatePartnerData) => {
      const { id, ...updateData } = data;

      const { error } = await supabase
        .from("partners")
        .update(updateData)
        .eq("id", id);

      if (error) {
        throw new Error(error.message);
      }

      return { id };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["partners"] });
      queryClient.invalidateQueries({ queryKey: ["partner", data.id] });
    }
  });
}
