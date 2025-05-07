
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Supplier } from "@/types/supplier";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface SupplierDeliveryInfoProps {
  form: UseFormReturn<Partial<Supplier>>;
  supplierId?: string;
}

export function SupplierDeliveryInfo({ form, supplierId }: SupplierDeliveryInfoProps) {
  const [associatedOrders, setAssociatedOrders] = useState<{ id: string, order_number: string }[]>([]);
  const [associatedProducts, setAssociatedProducts] = useState<{ id: string, name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch associated orders and products for this supplier
  useEffect(() => {
    if (!supplierId) return;

    async function fetchAssociatedItems() {
      setIsLoading(true);
      try {
        // Fetch orders associated with this supplier
        const { data: orderData, error: orderError } = await supabase
          .from("orders")
          .select("id, order_number")
          .eq("associated_supplier_id", supplierId);

        if (orderError) throw orderError;
        setAssociatedOrders(orderData || []);

        // Fetch products with this supplier as default
        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("id, name")
          .eq("default_supplier_id", supplierId);

        if (productError) throw productError;
        setAssociatedProducts(productData || []);
      } catch (error) {
        console.error("Error fetching associated items:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAssociatedItems();
  }, [supplierId]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Информация о поставках</h3>
      
      <FormField
        control={form.control}
        name="product_categories_supplied"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Категории товаров</FormLabel>
            <FormControl>
              <Textarea placeholder="Укажите категории товаров через запятую" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="payment_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Условия оплаты</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите условия оплаты" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="delivery_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Условия доставки</FormLabel>
              <FormControl>
                <Textarea placeholder="Опишите условия доставки" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Заметки</FormLabel>
            <FormControl>
              <Textarea placeholder="Дополнительные заметки о поставщике" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Display associated items if viewing an existing supplier */}
      {supplierId && (
        <div className="space-y-4 pt-4">
          <div>
            <h4 className="text-sm font-medium mb-2">Связанные заказы</h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            ) : associatedOrders.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {associatedOrders.map(order => (
                  <Badge key={order.id} variant="outline" className="flex items-center gap-1">
                    {order.order_number}
                    <Link to={`/orders/${order.id}`} className="ml-1 inline-flex">
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет связанных заказов</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Связанные товары</h4>
            {isLoading ? (
              <p className="text-sm text-muted-foreground">Загрузка...</p>
            ) : associatedProducts.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {associatedProducts.map(product => (
                  <Badge key={product.id} variant="outline" className="flex items-center gap-1">
                    {product.name}
                    <Link to={`/products/${product.id}`} className="ml-1 inline-flex">
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Нет связанных товаров</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
