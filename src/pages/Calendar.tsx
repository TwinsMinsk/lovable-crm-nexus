
import { useMemo, useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import moment from "moment";
import "moment/locale/ru";
import { useTasks } from "@/hooks/useTasks";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useTask } from "@/hooks/useTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from "@/context/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { data: selectedTask } = useTask(selectedTaskId || undefined);
  const { mutate: updateTask } = useUpdateTask();
  const [formData, setFormData] = useState({
    status: "",
    due_date: "",
    description: ""
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Reset form data when task changes
  useMemo(() => {
    if (selectedTask) {
      setFormData({
        status: selectedTask.status,
        due_date: selectedTask.due_date,
        description: selectedTask.description
      });
      setSelectedDate(new Date(selectedTask.due_date));
    }
  }, [selectedTask]);

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
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedTaskId(event.id);
    setTaskDialogOpen(true);
    setEditMode(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setFormData({
        ...formData,
        due_date: format(date, "yyyy-MM-dd"),
      });
    }
  };

  const handleSaveTask = () => {
    if (!selectedTaskId) return;

    updateTask(
      { 
        id: selectedTaskId, 
        data: formData 
      },
      {
        onSuccess: () => {
          setEditMode(false);
          toast.success("Задача успешно обновлена");
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    );
  };

  const getResponsibleName = (userId?: string) => {
    if (!userId) return "-";
    
    if (userId === user?.id) {
      return user?.user_metadata?.full_name || "Вы";
    }
    
    return "Пользователь " + userId.substring(0, 8);
  };
  
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
        backgroundColor,
        cursor: "pointer"
      }
    };
  };

  // Task statuses
  const taskStatuses = ["Новая", "В работе", "Выполнена", "Отменена"];
  
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
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке задач: {error.message}
        </div>
      </div>
    );
  }

  return (
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
            onSelectEvent={handleEventClick}
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

      {/* Task Details Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{editMode ? "Редактирование задачи" : "Детали задачи"}</span>
              {!editMode && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-1"
                >
                  <Pencil className="h-4 w-4" />
                  Редактировать
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTask ? (
            <div className="space-y-4">
              {editMode ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Описание</label>
                    <textarea 
                      className="w-full p-2 border rounded-md"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Статус</label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => setFormData({...formData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Выберите статус" />
                        </SelectTrigger>
                        <SelectContent>
                          {taskStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Дата</label>
                      <div className="border rounded-md p-3 pointer-events-auto">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          className="pointer-events-auto"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setEditMode(false)}
                    >
                      Отмена
                    </Button>
                    <Button onClick={handleSaveTask}>
                      Сохранить
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Статус</h3>
                    <p className="mt-1">
                      <Badge variant={
                        selectedTask.status === "Выполнена" ? "default" :
                        selectedTask.status === "В работе" ? "secondary" :
                        selectedTask.status === "Отменена" ? "destructive" : "outline"
                      }>
                        {selectedTask.status}
                      </Badge>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Описание</h3>
                    <p className="text-lg">{selectedTask.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Срок выполнения</h3>
                      <p>{format(new Date(selectedTask.due_date), 'dd MMMM yyyy', { locale: ru })}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Ответственный</h3>
                      <p>{getResponsibleName(selectedTask.responsible_user_id)}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedTask.contact && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Контакт</h3>
                        <p>{selectedTask.contact.name}</p>
                      </div>
                    )}
                    
                    {selectedTask.order && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Заказ</h3>
                        <p>{selectedTask.order.order_number}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setTaskDialogOpen(false)}
                    >
                      Закрыть
                    </Button>
                    <Button 
                      onClick={() => navigate(`/tasks/${selectedTask.id}`)}
                    >
                      Открыть детальную страницу
                    </Button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="p-4 text-center">
              <Skeleton className="h-[200px] w-full" />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
