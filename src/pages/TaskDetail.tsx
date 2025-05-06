
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTask } from "@/hooks/useTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/context/AuthContext";
import { fixDateTimezoneIssue } from "@/lib/dateUtils";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(id);
  const { mutate: updateTask, isPending } = useUpdateTask();
  const { user } = useAuth();
  
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Новая");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [contactId, setContactId] = useState<string | undefined>(undefined);
  const [orderId, setOrderId] = useState<string | undefined>(undefined);
  const [responsibleUserId, setResponsibleUserId] = useState<string | undefined>(undefined);
  
  // Update form when task data is loaded
  useEffect(() => {
    if (task) {
      setDescription(task.description || "");
      setStatus(task.status || "Новая");
      // Parse the date string to a Date object
      setDueDate(task.due_date ? new Date(task.due_date) : undefined);
      setContactId(task.contact_id || undefined);
      setOrderId(task.order_id || undefined);
      setResponsibleUserId(task.responsible_user_id || undefined);
    }
  }, [task]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    // Fix timezone issue by setting the time to noon
    const adjustedDate = fixDateTimezoneIssue(dueDate);
    
    updateTask(
      {
        id,
        data: {
          description,
          status,
          due_date: adjustedDate,
          contact_id: contactId || null,
          order_id: orderId || null,
          responsible_user_id: responsibleUserId || null,
        }
      },
      {
        onSuccess: () => {
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
  
  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке задачи: {error.message}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <Button 
        variant="outline" 
        onClick={() => navigate('/tasks')}
        className="mb-4 flex items-center gap-2"
      >
        <ChevronLeft className="h-4 w-4" /> Назад к задачам
      </Button>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isLoading ? <Skeleton className="h-8 w-48" /> : 
              task ? "Редактирование задачи" : "Задача не найдена"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : task ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Описание задачи"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Статус</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Выберите статус" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Новая">Новая</SelectItem>
                    <SelectItem value="В работе">В работе</SelectItem>
                    <SelectItem value="На проверке">На проверке</SelectItem>
                    <SelectItem value="Выполнена">Выполнена</SelectItem>
                    <SelectItem value="Отложена">Отложена</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Срок выполнения</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dueDate && "text-muted-foreground"
                      )}
                      id="dueDate"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PP") : <span>Выбрать дату</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responsible">Ответственный</Label>
                <Input 
                  id="responsible"
                  value={responsibleUserId || ""}
                  onChange={(e) => setResponsibleUserId(e.target.value || undefined)}
                  placeholder="ID ответственного пользователя"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  {getResponsibleName(responsibleUserId)}
                </p>
              </div>
              
              {task.contact && (
                <div className="space-y-2">
                  <Label>Контакт</Label>
                  <p>{task.contact.name}</p>
                </div>
              )}
              
              {task.order && (
                <div className="space-y-2">
                  <Label>Заказ</Label>
                  <p>№{task.order.order_number}</p>
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2"
                disabled={isPending}
              >
                <Save className="h-4 w-4" />
                {isPending ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </form>
          ) : (
            <p>Задача не найдена</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
