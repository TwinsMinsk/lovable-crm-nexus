
import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus } from "lucide-react";

interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface OrderItemListProps {
  items: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
  readOnly?: boolean;
}

export function OrderItemList({ items, onItemsChange, readOnly = false }: OrderItemListProps) {
  const { data: products, isLoading: isLoadingProducts } = useProducts();
  
  const [newItem, setNewItem] = useState<{
    product_id: string;
    quantity: number;
  }>({
    product_id: "",
    quantity: 1,
  });
  
  // Функция для добавления товара в заказ
  const addItemToOrder = () => {
    if (!newItem.product_id || readOnly) return;

    const selectedProduct = products?.find(p => p.id === newItem.product_id);
    if (!selectedProduct) return;

    const item: OrderItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: newItem.quantity,
      price: selectedProduct.price,
    };

    const updatedItems = [...items, item];
    onItemsChange(updatedItems);
    setNewItem({ product_id: "", quantity: 1 });
  };

  // Функция для удаления товара из заказа
  const removeItemFromOrder = (index: number) => {
    if (readOnly) return;
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Состав заказа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Список добавленных товаров */}
        {items.length > 0 ? (
          <div className="space-y-2">
            <Label>Товары/услуги</Label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                  <div>
                    <div className="font-medium">{item.product_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.quantity} x {item.price.toLocaleString()} ₽ = {(item.quantity * item.price).toLocaleString()} ₽
                    </div>
                  </div>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItemFromOrder(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div className="text-right font-medium mt-2">
              Итого: {items.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()} ₽
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            {readOnly ? "Нет товаров/услуг в заказе" : "Добавьте товары/услуги в заказ"}
          </div>
        )}
        
        {/* Форма для добавления нового товара */}
        {!readOnly && (
          <div className="pt-4 border-t">
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
                          {product.name} - {product.price.toLocaleString()} ₽
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
        )}
      </CardContent>
    </Card>
  );
}
