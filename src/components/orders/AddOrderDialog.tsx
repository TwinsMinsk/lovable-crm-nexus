import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAddOrder } from "@/hooks/useAddOrder";
import { useContacts } from "@/hooks/useContacts";
import { usePartners } from "@/hooks/usePartners";
import { useProducts } from "@/hooks/useProducts";
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
import { generateOrderNumber, formatCurrency } from "@/lib/utils";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Определение типа для элемента заказа
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export const AddOrderDialog = () => {
  const { user } = useAuth();
  const addOrder = useAddOrder();
  const { data: contacts, isLoading: isLoadingContacts } = useContacts();
  const { data: partners, isLoading: isLoadingPartners } = usePartners();
  const { data: products, isLoading: isLoadingProducts } = useProducts();
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

  // Состояние для управления товарами/услугами в заказе
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState<{
    product_id: string;
    quantity: number;
  }>({
    product_id: "",
    quantity: 1,
  });

  // Функция для добавления товара в заказ
  const addItemToOrder = () => {
    if (!newItem.product_id) return;

    const selectedProduct = products?.find(p => p.id === newItem.product_id);
    if (!selectedProduct) return;

    const item: OrderItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: newItem.quantity,
      price: selectedProduct.price,
    };

    setOrderItems([...orderItems, item]);
    setNewItem({ product_id: "", quantity: 1 });

    // Пересчитываем общую сумму заказа
    const newAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) + selectedProduct.price * newItem.quantity;

    setFormData({
      ...formData,
      amount: newAmount,
    });
  };

  // Функция для удаления товара из заказа
  const removeItemFromOrder = (index: number) => {
    const removedItem = orderItems[index];
    const newItems = orderItems.filter((_, i) => i !== index);
    setOrderItems(newItems);

    // Пересчитываем общую сумму заказа
    const newAmount = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    setFormData({
      ...formData,
      amount: newAmount,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.client_id) {
      return;
    }
    
    await addOrder.mutateAsync({
      ...formData,
      items: orderItems,
      partner_id: formData.partner_id || undefined,
    });
    
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
    setOrderItems([]);
  };

  // Показывать выбор партнера только для заказов типа "Изготовление"
  const showPartnerSelection = formData.order_type === "Изготовление";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить заказ</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
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
          
          {showPartnerSelection && (
            <div className="space-y-2">
              <Label htmlFor="partner_id">Партнер</Label>
              <Select
                value={formData.partner_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, partner_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите партнера" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Не выбрано</SelectItem>
                  {isLoadingPartners ? (
                    <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                  ) : partners?.length ? (
                    partners.map((partner) => (
                      <SelectItem key={partner.id} value={partner.id}>
                        {partner.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-partners" disabled>
                      Нет доступных партнеров
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}
          
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
          
          {/* Секция для добавления товаров в заказ */}
          <div className="border rounded-md p-4 space-y-4">
            <h3 className="font-medium">Состав заказа</h3>
            
            {/* Список добавленных товаров */}
            {orderItems.length > 0 && (
              <div className="space-y-2">
                <Label>Добавленные товары/услуги</Label>
                <div className="space-y-2">
                  {orderItems.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <div>
                        <div className="font-medium">{item.product_name}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.quantity} x {item.price.toLocaleString()} € = {(item.quantity * item.price).toLocaleString()} €
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItemFromOrder(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Форма для добавления нового товара */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <Label htmlFor="product_id">Товар/Услуга</Label>
                <Select
                  value={newItem.product_id}
                  onValueChange={(value) => setNewItem({...newItem, product_id: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите товар" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoadingProducts ? (
                      <SelectItem value="loading" disabled>Загрузка...</SelectItem>
                    ) : products?.length ? (
                      products.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {product.price.toLocaleString()} €
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-products" disabled>
                        Нет доступных товаров
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3">
                <Label htmlFor="quantity">Количество</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
                />
              </div>
              <div className="col-span-3 flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addItemToOrder}
                  disabled={!newItem.product_id}
                >
                  <Plus className="h-4 w-4 mr-1" /> Добавить
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма (€)*</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => {
                // Allow only numbers and decimal point
                const value = e.target.value.replace(/[^0-9.]/g, '');
                const numericValue = parseFloat(value) || 0;
                setFormData({ ...formData, amount: numericValue });
              }}
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
