
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAddTask } from "@/hooks/useAddTask";
import { useContacts } from "@/hooks/useContacts";
import { useOrders } from "@/hooks/useOrders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const AddTaskDialog = () => {
  const { user } = useAuth();
  const addTask = useAddTask();
  const { data: contacts, isLoading: isLoadingContacts } = useContacts();
  const { data: orders, isLoading: isLoadingOrders } = useOrders();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [formData, setFormData] = useState({
    description: "",
    status: "Новая" as "Новая" | "В работе" | "Выполнена",
    due_date: format(new Date(), "yyyy-MM-dd"),
    responsible_user_id: user?.id || "",
    contact_id: "",
    order_id: "",
  });

  // Updated handler to convert "none" back to empty string when submitting
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      contact_id: formData.contact_id === "none" ? undefined : formData.contact_id || undefined,
      order_id: formData.order_id === "none" ? undefined : formData.order_id || undefined,
    };
    await addTask.mutateAsync(submissionData);
    setOpen(false);
    setDate(new Date());
    setFormData({
      description: "",
      status: "Новая",
      due_date: format(new Date(), "yyyy-MM-dd"),
      responsible_user_id: user?.id || "",
      contact_id: "",
      order_id: "",
    });
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setFormData({
        ...formData,
        due_date: format(selectedDate, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить задачу</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новую задачу</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Описание*</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Статус*</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "Новая" | "В работе" | "Выполнена") =>
                setFormData({ ...formData, status: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Новая">Новая</SelectItem>
                <SelectItem value="В работе">В работе</SelectItem>
                <SelectItem value="Выполнена">Выполнена</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due_date">Срок*</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? (
                    format(date, "dd MMMM yyyy", { locale: ru })
                  ) : (
                    <span>Выберите дату</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contact_id">Контакт</Label>
            <Select
              value={formData.contact_id || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, contact_id: value === "none" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите контакт (опционально)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {isLoadingContacts ? (
                  <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                ) : contacts?.length ? (
                  contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-contacts" disabled>
                    Нет доступных контактов
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="order_id">Заказ</Label>
            <Select
              value={formData.order_id || "none"}
              onValueChange={(value) =>
                setFormData({ ...formData, order_id: value === "none" ? "" : value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите заказ (опционально)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Не выбрано</SelectItem>
                {isLoadingOrders ? (
                  <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                ) : orders?.length ? (
                  orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      {order.order_number}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-orders" disabled>
                    Нет доступных заказов
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={addTask.isPending || !formData.description || !date}>
              {addTask.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
