
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Partner } from "@/types/partner";

export function usePartners() {
  return useQuery({
    queryKey: ["partners"],
    queryFn: async (): Promise<Partner[]> => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      // Ensure the data matches the Partner interface
      const partners = data?.map(item => ({
        id: item.id,
        created_at: item.created_at,
        name: item.name,
        user_id: item.user_id,
        contact_person: item.contact_person || null,
        phone: item.phone || null,
        email: item.email || null,
        specialization: item.specialization || null,
        terms: item.terms || null
      })) || [];

      return partners;
    }
  });
}
