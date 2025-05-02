import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useTask } from "@/hooks/useTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: task, isLoading, error } = useTask(id);
  const { mutate: updateTask } = useUpdateTask();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: "",
    status: "",
    due_date: "",
    responsible_user_id: ""
  });
  
  const taskStatuses = ["Новая", "В работе", "Выполнена", "Отменена"];
  
  // Initialize form data when task is loaded
  useEffect(() => {
    if (task) {
      setFormData({
        description: task.description || "",
        status: task.status || "",
        due_date: task.due_date || "",
        responsible_user_id: task.responsible_user_id || ""
      });
    }
  }, [task]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateTask(
      { 
        id, 
        data: formData
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Задача успешно обновлена");
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    );
  };
  
  const handleEdit = () => {
    if (task) {
      setFormData({
        description: task.description || "",
        status: task.status || "",
        due_date: task.due_date || "",
        responsible_user_id: task.responsible_user_id || ""
      });
      setIsEditing(true);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Новая":
        return <Badge variant="outline">Новая</Badge>;
      case "В работе":
        return <Badge variant="secondary">В работе</Badge>;
      case "Выполнена":
        return <Badge variant="default">Выполнена</Badge>;
      case "Отменена":
        return <Badge variant="destructive">Отменена</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-48" /> : "Задача"}
        </h1>
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => navigate("/tasks")}
          >
            Назад к списку
          </Button>
          {!isEditing && (
            <Button 
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Pencil className="h-4 w-4" /> Редактировать
            </Button>
          )}
        </div>
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>
              {isEditing ? "Редактирование задачи" : "Информация о задаче"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Описание</Label>
                  <Textarea 
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
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
                    <Label htmlFor="due_date">Срок выполнения</Label>
                    <Input 
                      id="due_date" 
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleInputChange("due_date", e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsible_user_id">Ответственный</Label>
                    <Input 
                      id="responsible_user_id"
                      value={formData.responsible_user_id}
                      onChange={(e) => handleInputChange("responsible_user_id", e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Отмена
                  </Button>
                  <Button type="submit">Сохранить</Button>
                </div>
              </form>
            ) : task ? (
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Статус</p>
                  <div className="mt-1">{getStatusBadge(task.status)}</div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Описание</p>
                  <p className="text-lg whitespace-pre-wrap">{task.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Срок выполнения</p>
                    <p>{format(new Date(task.due_date), 'dd MMMM yyyy', { locale: ru })}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ответственный</p>
                    <p>{getResponsibleName(task.responsible_user_id)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Контакт</p>
                    <p>{task.contact?.name || "-"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Заказ</p>
                    <p>{task.order?.order_number || "-"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>Данные не найдены</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
