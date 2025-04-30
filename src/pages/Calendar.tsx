
import { useMemo } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import "moment/locale/ru";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTasks } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Set up the localizer for the calendar
moment.locale("ru");
const localizer = momentLocalizer(moment);

// Define event (task) type for the calendar
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  allDay: boolean;
}

export default function CalendarPage() {
  const { data: tasks, isLoading, error } = useTasks();
  
  // Transform tasks into calendar events
  const events = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.map((task) => {
      // Create a date object from the due_date
      const taskDate = new Date(task.due_date);
      
      return {
        id: task.id,
        title: task.description,
        start: taskDate,
        end: taskDate,
        status: task.status,
        allDay: true, // Set tasks as all-day events
      };
    });
  }, [tasks]);
  
  const getEventStyle = (event: CalendarEvent) => {
    let backgroundColor = "#3b82f6"; // Default blue
    
    switch (event.status) {
      case "Новая":
        backgroundColor = "#e2e8f0"; // Light gray
        break;
      case "В работе":
        backgroundColor = "#7c3aed"; // Purple
        break;
      case "Выполнена":
        backgroundColor = "#10b981"; // Green
        break;
      case "Отменена":
        backgroundColor = "#ef4444"; // Red
        break;
    }
    
    return {
      style: {
        backgroundColor
      }
    };
  };
  
  // Custom event component to display tasks with status
  const EventComponent = ({ event }: { event: CalendarEvent }) => (
    <div className="text-xs">
      <div className="font-medium truncate">{event.title}</div>
      <div>
        <Badge variant="secondary" className="text-[10px] h-4">
          {event.status}
        </Badge>
      </div>
    </div>
  );

  if (error) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="text-red-500">
            Ошибка при загрузке задач: {error.message}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Календарь задач</h1>
        
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-[600px] w-full" />
          </div>
        ) : (
          <div className="h-[600px] bg-white rounded-md border shadow-sm">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%', padding: '1rem' }}
              views={['month', 'week', 'day']}
              eventPropGetter={getEventStyle}
              components={{
                event: EventComponent,
              }}
              messages={{
                next: "Следующий",
                previous: "Предыдущий",
                today: "Сегодня",
                month: "Месяц",
                week: "Неделя",
                day: "День",
                noEventsInRange: "Нет задач в этом диапазоне",
              }}
            />
          </div>
        )}
      </div>
    </MainLayout>
  );
}
