
import { supabase } from "@/lib/supabaseClient";

export type CreateNotificationParams = {
  userId: string;
  message: string;
  relatedTable?: string;
  relatedId?: string;
};

export const createNotification = async ({
  userId,
  message,
  relatedTable,
  relatedId,
}: CreateNotificationParams) => {
  try {
    const { error } = await supabase.from("notifications").insert({
      user_id: userId,
      message,
      related_table: relatedTable,
      related_id: relatedId,
    });

    if (error) {
      console.error("Error creating notification:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (err) {
    console.error("Error creating notification:", err);
    return { success: false, error: err };
  }
};
