
// src/components/orders/OrderItemList.tsx
import React, { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Plus, Save, X } from "lucide-react";

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
  currencySymbol?: string;
}

export const OrderItemList = ({ items, onItemsChange, readOnly = false, currencySymbol = "€" }: OrderItemListProps) => {
  const { data: products, isLoading } = useProducts();
  const [editingItem, setEditingItem] = useState<{ index: number; item: OrderItem } | null>(null);
  const [newItem, setNewItem] = useState<{ product_id: string; quantity: number }>({
    product_id: "",
    quantity: 1,
  });

  const handleEditItem = (index: number) => {
    setEditingItem({ index, item: { ...items[index] } });
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
  };

  const handleSaveItem = () => {
    if (!editingItem) return;
    
    const newItems = [...items];
    newItems[editingItem.index] = editingItem.item;
    onItemsChange(newItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onItemsChange(newItems);
  };

  const handleAddNewItem = () => {
    if (!newItem.product_id) return;
    
    const selectedProduct = products?.find(p => p.id === newItem.product_id);
    if (!selectedProduct) return;
    
    const newOrderItem: OrderItem = {
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: newItem.quantity,
      price: selectedProduct.price,
    };
    
    onItemsChange([...items, newOrderItem]);
    setNewItem({ product_id: "", quantity: 1 });
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  if (readOnly) {
    return (
      <div className="space-y-2">
        <Label>Товары/Услуги</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              <>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product_name}</TableCell>
                    <TableCell className="text-right">{item.price.toLocaleString()} {currencySymbol}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">{(item.price * item.quantity).toLocaleString()} {currencySymbol}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Итого:</TableCell>
                  <TableCell className="text-right font-bold">{calculateTotal().toLocaleString()} {currencySymbol}</TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">Нет товаров в заказе</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Товары/Услуги</Label>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Название</TableHead>
              <TableHead className="text-right">Цена</TableHead>
              <TableHead className="text-center">Кол-во</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length > 0 ? (
              <>
                {items.map((item, index) => 
                  editingItem && editingItem.index === index ? (
                    <TableRow key={`editing-${index}`}>
                      <TableCell>
                        <Select
                          value={editingItem.item.product_id}
                          onValueChange={(value) => {
                            const product = products?.find(p => p.id === value);
                            setEditingItem({
                              ...editingItem,
                              item: {
                                ...editingItem.item,
                                product_id: value,
                                product_name: product?.name || "",
                                price: product?.price || 0,
                              }
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите товар" />
                          </SelectTrigger>
                          <SelectContent>
                            {products?.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} - {product.price.toLocaleString()} {currencySymbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          value={editingItem.item.price}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            item: {
                              ...editingItem.item,
                              price: Number(e.target.value) || 0
                            }
                          })}
                          className="w-20 ml-auto"
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="number"
                          min="1"
                          value={editingItem.item.quantity}
                          onChange={(e) => setEditingItem({
                            ...editingItem,
                            item: {
                              ...editingItem.item,
                              quantity: Number(e.target.value) || 1
                            }
                          })}
                          className="w-20 mx-auto"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        {(editingItem.item.price * editingItem.item.quantity).toLocaleString()} {currencySymbol}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={handleSaveItem}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    <TableRow key={index}>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell className="text-right">{item.price.toLocaleString()} {currencySymbol}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{(item.price * item.quantity).toLocaleString()} {currencySymbol}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleEditItem(index)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleDeleteItem(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                )}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">Итого:</TableCell>
                  <TableCell className="text-right font-bold">{calculateTotal().toLocaleString()} {currencySymbol}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">Нет товаров в заказе</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid grid-cols-12 gap-2 border-t pt-4">
        <div className="col-span-5">
          <Select
            value={newItem.product_id}
            onValueChange={(value) => setNewItem({...newItem, product_id: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Выберите товар" />
            </SelectTrigger>
            <SelectContent>
              {isLoading ? (
                <SelectItem value="loading" disabled>Загрузка...</SelectItem>
              ) : products?.length ? (
                products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - {product.price.toLocaleString()} {currencySymbol}
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
          <Input
            type="number"
            min="1"
            value={newItem.quantity}
            onChange={(e) => setNewItem({...newItem, quantity: parseInt(e.target.value) || 1})}
            placeholder="Количество"
          />
        </div>
        <div className="col-span-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleAddNewItem}
            disabled={!newItem.product_id}
          >
            <Plus className="h-4 w-4 mr-1" /> Добавить
          </Button>
        </div>
      </div>
    </div>
  );
};
