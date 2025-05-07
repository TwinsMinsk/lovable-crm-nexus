
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAddSupplier } from "@/hooks/useAddSupplier";
import { CreateSupplierData } from "@/types/supplier";
import { Plus } from "lucide-react";

export function AddSupplierDialog() {
  const [open, setOpen] = useState(false);
  const addSupplierMutation = useAddSupplier();
  
  const form = useForm<Omit<CreateSupplierData, "user_id">>({
    defaultValues: {
      supplier_name: "",
      contact_person: "",
      phone: "",
      secondary_phone: "",
      email: "",
      website: "",
      address: "",
      product_categories_supplied: "",
      payment_terms: "",
      delivery_terms: "",
      notes: "",
      rating: null
    }
  });

  const onSubmit = async (data: Omit<CreateSupplierData, "user_id">) => {
    try {
      await addSupplierMutation.mutateAsync(data);
      toast.success("Поставщик успешно добавлен");
      form.reset();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при добавлении поставщика: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при добавлении поставщика");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Добавить поставщика
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Добавить поставщика</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите телефон" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="secondary_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Дополнительный телефон</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите дополнительный телефон" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Введите email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Веб-сайт</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите URL веб-сайта" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Адрес</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Введите адрес поставщика" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
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
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Отмена
              </Button>
              <Button type="submit" disabled={addSupplierMutation.isPending}>
                {addSupplierMutation.isPending ? "Добавление..." : "Добавить поставщика"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
