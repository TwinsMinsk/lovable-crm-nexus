
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { Partner } from "@/types/partner";

export function usePartner(id: string | undefined) {
  return useQuery({
    queryKey: ["partner", id],
    queryFn: async (): Promise<Partner | null> => {
      if (!id) return null;
      
      // Use any type to bypass TypeScript's type checking
      const { data, error } = await (supabase as any)
        .from("partners")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Partner not found
        }
        throw new Error(error.message);
      }

      // Ensure the data matches the Partner interface
      const partner: Partner = {
        id: data.id,
        created_at: data.created_at,
        name: data.name,
        user_id: data.user_id,
        contact_person: data.contact_person || null,
        phone: data.phone || null,
        email: data.email || null,
        specialization: data.specialization || null,
        terms: data.terms || null
      };

      return partner;
    },
    enabled: !!id
  });
}
