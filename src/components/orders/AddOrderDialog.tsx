
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAddOrder } from "@/hooks/useAddOrder";
import { useContacts } from "@/hooks/useContacts";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateOrderNumber } from "@/lib/utils";

export const AddOrderDialog = () => {
  const { user } = useAuth();
  const addOrder = useAddOrder();
  const { data: contacts, isLoading: isLoadingContacts } = useContacts();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    order_number: generateOrderNumber(),
    client_id: "",
    order_type: "Изготовление" as "Изготовление" | "Готовая мебель",
    status: "Новый",
    amount: 0,
    responsible_user_id: user?.id || "",
    partner_id: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addOrder.mutateAsync(formData);
    setOpen(false);
    setFormData({
      order_number: generateOrderNumber(),
      client_id: "",
      order_type: "Изготовление",
      status: "Новый",
      amount: 0,
      responsible_user_id: user?.id || "",
      partner_id: "",
      notes: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить заказ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новый заказ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="order_number">№ Заказа*</Label>
            <Input
              id="order_number"
              value={formData.order_number}
              onChange={(e) =>
                setFormData({ ...formData, order_number: e.target.value })
              }
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="client_id">Клиент*</Label>
            <Select
              value={formData.client_id}
              onValueChange={(value) =>
                setFormData({ ...formData, client_id: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Выберите клиента" />
              </SelectTrigger>
              <SelectContent>
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
            <Label htmlFor="order_type">Тип заказа*</Label>
            <Select
              value={formData.order_type}
              onValueChange={(value: "Изготовление" | "Готовая мебель") =>
                setFormData({ ...formData, order_type: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Изготовление">Изготовление</SelectItem>
                <SelectItem value="Готовая мебель">Готовая мебель</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Статус*</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
              required
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Новый">Новый</SelectItem>
                <SelectItem value="В обработке">В обработке</SelectItem>
                <SelectItem value="Производство">Производство</SelectItem>
                <SelectItem value="Готов к отгрузке">Готов к отгрузке</SelectItem>
                <SelectItem value="Доставка">Доставка</SelectItem>
                <SelectItem value="Завершен">Завершен</SelectItem>
                <SelectItem value="Отменен">Отменен</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма*</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Примечания</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={addOrder.isPending || !formData.client_id}>
              {addOrder.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
