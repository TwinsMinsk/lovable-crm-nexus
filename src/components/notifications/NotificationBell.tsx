
import { useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, isLoading, markAsRead, markAllAsRead } = useNotifications();

  const handleNotificationClick = (
    notification: {
      id: string;
      related_table?: string;
      related_id?: string;
    }
  ) => {
    markAsRead(notification.id);
    
    // Если есть связанная таблица и ID, перенаправляем на соответствующую страницу
    if (notification.related_table && notification.related_id) {
      const routeMap: Record<string, string> = {
        tasks: `/tasks/${notification.related_id}`,
        orders: `/orders/${notification.related_id}`,
        leads: `/leads/${notification.related_id}`,
        contacts: `/contacts/${notification.related_id}`,
      };
      
      const route = routeMap[notification.related_table];
      if (route) {
        navigate(route);
        setOpen(false);
      }
    }
  };

  const formatNotificationDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "d MMM, HH:mm", { locale: ru });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-xs rounded-full"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex items-center justify-between">
          <h4 className="font-medium">Уведомления</h4>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 px-2"
              onClick={() => markAllAsRead()}
            >
              Прочитать все
            </Button>
          )}
        </div>
        
        <ScrollArea className="max-h-[350px]">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <Skeleton className="h-4 w-[80%] mb-1" />
                  <Skeleton className="h-3 w-[60%]" />
                </div>
              ))}
            </div>
          ) : notifications && notifications.length > 0 ? (
            <div className="py-1">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 transition-colors ${
                    !notification.is_read ? "bg-muted" : ""
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="font-medium">{notification.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {formatNotificationDate(notification.created_at)}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Нет новых уведомлений
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
