
import { useTasks } from "@/hooks/useTasks";
import { AddTaskDialog } from "@/components/tasks/AddTaskDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export default function Tasks() {
  const { data: tasks, isLoading, error } = useTasks();
  const navigate = useNavigate();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Новая":
        return <Badge variant="outline">Новая</Badge>;
      case "В работе":
        return <Badge variant="secondary">В работе</Badge>;
      case "Выполнена":
        return <Badge variant="default">Выполнена</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Задачи</h1>
        <AddTaskDialog />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Описание</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Срок</TableHead>
              <TableHead>Контакт</TableHead>
              <TableHead>Заказ</TableHead>
              <TableHead>Ответственный</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks?.map((task) => (
              <TableRow key={task.id}>
                <TableCell>{task.description}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>
                  {format(new Date(task.due_date), 'dd MMM yyyy', { locale: ru })}
                </TableCell>
                <TableCell>{task.contact?.name || "-"}</TableCell>
                <TableCell>{task.order?.order_number || "-"}</TableCell>
                <TableCell>{task.responsible_user_id || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" /> 
                    Просмотр
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
