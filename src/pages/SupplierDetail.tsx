
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSupplier } from "@/hooks/useSupplier";
import { useUpdateSupplier } from "@/hooks/useUpdateSupplier";
import { useDeleteSupplier } from "@/hooks/useDeleteSupplier";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Supplier } from "@/types/supplier";
import { formatDate } from "@/lib/dateUtils";

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: supplier, isLoading, error } = useSupplier(id);
  const updateSupplierMutation = useUpdateSupplier();
  const deleteSupplierMutation = useDeleteSupplier();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const form = useForm<Partial<Supplier>>({
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

  // Update form values when supplier data is loaded
  React.useEffect(() => {
    if (supplier) {
      form.reset({
        supplier_name: supplier.supplier_name,
        contact_person: supplier.contact_person || "",
        phone: supplier.phone || "",
        secondary_phone: supplier.secondary_phone || "",
        email: supplier.email || "",
        website: supplier.website || "",
        address: supplier.address || "",
        product_categories_supplied: supplier.product_categories_supplied || "",
        payment_terms: supplier.payment_terms || "",
        delivery_terms: supplier.delivery_terms || "",
        notes: supplier.notes || "",
        rating: supplier.rating
      });
    }
  }, [supplier, form]);

  const onSubmit = async (data: Partial<Supplier>) => {
    if (!id) return;

    try {
      await updateSupplierMutation.mutateAsync({ id, ...data });
      toast.success("Данные поставщика успешно обновлены");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при обновлении данных: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при обновлении данных");
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteSupplierMutation.mutateAsync(id);
      toast.success("Поставщик успешно удален");
      navigate("/suppliers");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при удалении: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при удалении");
      }
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        Ошибка при загрузке данных поставщика: {error instanceof Error ? error.message : "Неизвестная ошибка"}
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">Поставщик не найден</h2>
        <Button className="mt-4" onClick={() => navigate("/suppliers")}>
          Вернуться к списку поставщиков
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => navigate("/suppliers")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          К списку поставщиков
        </Button>
        <Button 
          variant="destructive" 
          onClick={() => setDeleteDialogOpen(true)}
          disabled={deleteSupplierMutation.isPending}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Удалить поставщика
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Данные поставщика</CardTitle>
          <div className="text-sm text-muted-foreground">
            Добавлен: {formatDate(supplier.created_at)}
            {supplier.updated_at !== supplier.created_at && 
              ` • Обновлен: ${formatDate(supplier.updated_at)}`
            }
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                
                <Separator />
                <h3 className="text-lg font-medium">Контактная информация</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
                
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
                
                <Separator />
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
              
              <div className="flex justify-end">
                <Button type="submit" disabled={updateSupplierMutation.isPending}>
                  {updateSupplierMutation.isPending ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-current rounded-full"></div>
                      Сохранение...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Сохранить изменения
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Поставщик будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSupplierMutation.isPending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
