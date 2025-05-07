
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Supplier } from "@/types/supplier";

interface SupplierBasicInfoProps {
  form: UseFormReturn<Partial<Supplier>>;
}

export function SupplierBasicInfo({ form }: SupplierBasicInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="supplier_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Название поставщика *</FormLabel>
            <FormControl>
              <Input placeholder="Введите название поставщика" {...field} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="contact_person"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Контактное лицо</FormLabel>
              <FormControl>
                <Input placeholder="Введите имя контактного лица" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Рейтинг</FormLabel>
              <FormControl>
                <Select 
                  onValueChange={(value) => field.onChange(value ? Number(value) : null)} 
                  value={field.value ? String(field.value) : undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите рейтинг" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Очень плохо</SelectItem>
                    <SelectItem value="2">2 - Плохо</SelectItem>
                    <SelectItem value="3">3 - Средне</SelectItem>
                    <SelectItem value="4">4 - Хорошо</SelectItem>
                    <SelectItem value="5">5 - Отлично</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
