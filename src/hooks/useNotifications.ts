
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";

export type Notification = {
  id: string;
  created_at: string;
  message: string;
  is_read: boolean;
  related_table?: string;
  related_id?: string;
};

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [unreadCount, setUnreadCount] = useState(0);

  // Запрос для получения уведомлений текущего пользователя
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) {
        console.error("Error fetching notifications:", error);
        return [];
      }
      
      return data as Notification[];
    },
    enabled: !!user?.id,
  });

  // Мутация для отметки уведомления как прочитанного
  const { mutate: markAsRead } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("id", id);
        
      if (error) throw error;
      
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        (old: Notification[] | undefined) =>
          old?.map(notification =>
            notification.id === id
              ? { ...notification, is_read: true }
              : notification
          ) || []
      );
    },
  });

  // Мутация для отметки всех уведомлений как прочитанных
  const { mutate: markAllAsRead } = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;
      
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.setQueryData(
        ["notifications", user?.id],
        (old: Notification[] | undefined) =>
          old?.map(notification => ({ ...notification, is_read: true })) || []
      );
    },
  });

  // Подписка на обновления уведомлений через Supabase Realtime
  useEffect(() => {
    if (!user?.id) return;

    // Создаем канал для уведомлений текущего пользователя
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("New notification:", payload);
          
          // Обновляем кеш React Query
          queryClient.setQueryData(
            ["notifications", user.id],
            (old: Notification[] | undefined) => {
              const newNotification = payload.new as Notification;
              return [newNotification, ...(old || [])];
            }
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("Updated notification:", payload);
          
          // Обновляем кеш React Query
          queryClient.setQueryData(
            ["notifications", user.id],
            (old: Notification[] | undefined) =>
              old?.map(notification =>
                notification.id === payload.new.id
                  ? { ...notification, ...payload.new }
                  : notification
              ) || []
          );
        }
      )
      .subscribe();

    // Отписываемся при размонтировании компонента
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Подсчитываем количество непрочитанных уведомлений
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter(n => !n.is_read).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  return {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  };
};
