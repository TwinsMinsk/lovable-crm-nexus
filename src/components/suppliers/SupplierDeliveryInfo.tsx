
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { Supplier } from "@/types/supplier";

interface SupplierDeliveryInfoProps {
  form: UseFormReturn<Partial<Supplier>>;
}

export function SupplierDeliveryInfo({ form }: SupplierDeliveryInfoProps) {
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
    </div>
  );
}
