import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "@/hooks/useOrder";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);
  const { mutate: updateOrder } = useUpdateOrderStatus();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    payment_status: "",
    notes: ""
  });

  // Statuses for the workflows
  const statuses = {
    manufacturing: [
      "Новый",
      "Замер",
      "Проектирование",
      "Согласование",
      "Производство",
      "Готов к отгрузке",
      "Доставка",
      "Завершен"
    ],
    readyMade: [
      "Новый",
      "Подбор",
      "Ожидание поставки",
      "Готов к отгрузке",
      "Доставка",
      "Завершен"
    ]
  };

  const paymentStatuses = ["Не оплачен", "Частично оплачен", "Оплачен"];
  
  // Initialize form data when order is loaded
  useState(() => {
    if (order) {
      setFormData({
        status: order.status || "",
        payment_status: order.payment_status || "",
        notes: order.notes || ""
      });
    }
  });
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateOrder(
      { 
        orderId: id, 
        newStatus: formData.status 
      },
      {
        onSuccess: () => {
          // Update other fields if needed
          if (order && (
            formData.payment_status !== order.payment_status ||
            formData.notes !== order.notes
          )) {
            const { mutate: updateFullOrder } = useUpdateOrderStatus();
            updateFullOrder(
              { 
                orderId: id, 
                newStatus: formData.status,
                extraData: {
                  payment_status: formData.payment_status,
                  notes: formData.notes
                }
              },
              {
                onSuccess: () => {
                  setIsEditing(false);
                  toast.success("Заказ успешно обновлен");
                },
                onError: (err) => toast.error(`Ошибка при обновлении данных: ${err.message}`)
              }
            );
          } else {
            setIsEditing(false);
            toast.success("Статус заказа успешно обновлен");
          }
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    );
  };
  
  const handleEdit = () => {
    if (order) {
      setFormData({
        status: order.status || "",
        payment_status: order.payment_status || "",
        notes: order.notes || ""
      });
      setIsEditing(true);
    }
  };
  
  // Determine which workflow this order belongs to
  const getOrderStatuses = () => {
    if (!order) return statuses.manufacturing;
    return order.order_type === "Готовая мебель" ? statuses.readyMade : statuses.manufacturing;
  };
  
  if (error) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="text-red-500">
            Ошибка при загрузке заказа: {error.message}
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-48" /> : `Заказ №${order?.order_number || ""}`}
          </h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/orders")}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {isEditing ? "Редактирование заказа" : "Информация о заказе"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                            {getOrderStatuses().map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="payment_status">Статус оплаты</Label>
                        <Select
                          value={formData.payment_status}
                          onValueChange={(value) => handleInputChange("payment_status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите статус оплаты" />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentStatuses.map((status) => (
                              <SelectItem key={status} value={status}>
                                {status}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Заметки</Label>
                      <Textarea 
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        className="min-h-[100px]"
                      />
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
                ) : order ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Номер заказа</p>
                      <p className="text-lg">{order.order_number}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Тип заказа</p>
                      <p>{order.order_type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Клиент</p>
                      <p>{order.client?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Партнер</p>
                      <p>{order.partner?.name || "-"}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Сумма</p>
                      <p className="font-bold">{order.amount.toLocaleString()} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Статус заказа</p>
                      <p>{order.status}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Статус оплаты</p>
                      <p className={order.payment_status === "Оплачен" ? "text-green-500" : "text-amber-500"}>
                        {order.payment_status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ответственный</p>
                      <p>{order.responsible_user_id || "-"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-muted-foreground">Заметки</p>
                      <p className="whitespace-pre-wrap">{order.notes || "-"}</p>
                    </div>
                  </div>
                ) : (
                  <p>Данные не найдены</p>
                )}
              </CardContent>
            </Card>
            
            {/* Order items would go here in a separate card */}
            <Card>
              <CardHeader>
                <CardTitle>Дополнительная информация</CardTitle>
              </CardHeader>
              <CardContent>
                {order && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Дата создания</p>
                      <p>{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">ID заказа</p>
                      <p className="text-xs">{order.id}</p>
                    </div>
                    {/* Additional info could go here */}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
