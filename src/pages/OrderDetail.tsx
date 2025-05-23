import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrder } from "@/hooks/useOrder";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Pencil } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PartnerSelect } from "@/components/orders/PartnerSelect";
import { OrderItemList } from "@/components/orders/OrderItemList";
import { SupplierSelect } from "@/components/orders/SupplierSelect";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);
  const { mutate: updateOrder } = useUpdateOrderStatus();
  const { user } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    status: "",
    payment_status: "",
    partner_id: "",
    notes: "",
    associated_supplier_id: ""
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // Define showPartnerSelection variable here
  const showPartnerSelection = true;

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
  useEffect(() => {
    if (order) {
      setFormData({
        status: order.status || "",
        payment_status: order.payment_status || "",
        partner_id: order.partner_id || "",
        notes: order.notes || "",
        associated_supplier_id: order.associated_supplier_id || ""
      });
      
      // Initialize order items if they exist with proper type casting
      if (order.items && Array.isArray(order.items)) {
        // Safely cast the JSON array to OrderItem[]
        const typedItems = (order.items as any[]).map(item => ({
          product_id: item.product_id || "",
          product_name: item.product_name || "",
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0
        }));
        setOrderItems(typedItems);
      } else {
        setOrderItems([]);
      }
    }
  }, [order]);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const calculateTotalAmount = (items: OrderItem[]) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getResponsibleName = (userId?: string) => {
    if (!userId) return "-";
    
    if (userId === user?.id) {
      return user?.user_metadata?.full_name || "Вы";
    }
    
    return "Пользователь " + userId.substring(0, 8);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    const totalAmount = calculateTotalAmount(orderItems);
    
    updateOrder(
      { 
        orderId: id, 
        newStatus: formData.status,
        extraData: {
          payment_status: formData.payment_status,
          partner_id: formData.partner_id || null,
          associated_supplier_id: formData.associated_supplier_id || null,
          notes: formData.notes,
          items: orderItems,
          amount: totalAmount
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
  };
  
  const handleEdit = () => {
    if (order) {
      setFormData({
        status: order.status || "",
        payment_status: order.payment_status || "",
        partner_id: order.partner_id || "",
        notes: order.notes || "",
        associated_supplier_id: order.associated_supplier_id || ""
      });
      
      // Also use proper type casting when setting items in edit mode
      if (order.items && Array.isArray(order.items)) {
        const typedItems = (order.items as any[]).map(item => ({
          product_id: item.product_id || "",
          product_name: item.product_name || "",
          quantity: Number(item.quantity) || 0,
          price: Number(item.price) || 0
        }));
        setOrderItems(typedItems);
      }
      
      setIsEditing(true);
    }
  };
  
  // Показывать выбор поставщика для всех заказов
  const showSupplierSelection = true;
  
  // Determine which workflow this order belongs to
  const getOrderStatuses = () => {
    if (!order) return statuses.manufacturing;
    return order.order_type === "Готовая мебель" ? statuses.readyMade : statuses.manufacturing;
  };
  
  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке заказа: {error.message}
        </div>
      </div>
    );
  }
  
  return (
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
                    
                    {/* Add supplier selection field */}
                    <div className="md:col-span-2">
                      <SupplierSelect 
                        value={formData.associated_supplier_id} 
                        onChange={(value) => handleInputChange("associated_supplier_id", value)}
                      />
                    </div>
                    
                    {showPartnerSelection && (
                      <div className="md:col-span-2">
                        <PartnerSelect 
                          value={formData.partner_id} 
                          onChange={(value) => handleInputChange("partner_id", value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <OrderItemList 
                    items={orderItems} 
                    onItemsChange={(items) => {
                      setOrderItems(items);
                    }}
                  />
                  
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
                <div className="space-y-6">
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
                    {showPartnerSelection && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Партнер</p>
                        <p>{order.partner?.name || "-"}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Сумма</p>
                      <p className="font-bold">{order.amount.toLocaleString()} €</p>
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
                      <p>{getResponsibleName(order.responsible_user_id)}</p>
                    </div>
                  </div>
                  
                  {/* Показываем список товаров */}
                  {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                    <OrderItemList 
                      items={(order.items as any[]).map(item => ({
                        product_id: item.product_id || "",
                        product_name: item.product_name || "",
                        quantity: Number(item.quantity) || 0,
                        price: Number(item.price) || 0
                      }))} 
                      onItemsChange={() => {}} 
                      readOnly={true} 
                      currencySymbol="€"
                    />
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Заметки</p>
                    <p className="whitespace-pre-wrap">{order.notes || "-"}</p>
                  </div>
                  
                  {/* Display supplier information */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Поставщик</p>
                    <p>{order.associated_supplier?.supplier_name || "-"}</p>
                  </div>
                </div>
              ) : (
                <p>Данные не найдены</p>
              )}
            </CardContent>
          </Card>
          
          {/* Order info sidebar */}
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
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
