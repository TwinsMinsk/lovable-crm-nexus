
import { useState } from "react";
import { useSuppliers } from "@/hooks/useSuppliers";
import { useDeleteSupplier } from "@/hooks/useDeleteSupplier";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Phone, Mail, Globe, Star } from "lucide-react";
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
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export function SupplierList() {
  const { data: suppliers, isLoading, error } = useSuppliers();
  const deleteSupplierMutation = useDeleteSupplier();
  
  const [search, setSearch] = useState("");
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const filteredSuppliers = suppliers?.filter((supplier) =>
    supplier.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
    (supplier.contact_person && supplier.contact_person.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    try {
      await deleteSupplierMutation.mutateAsync(id);
      toast.success("Поставщик успешно удален");
      setSupplierToDelete(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при удалении: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при удалении");
      }
    }
  };

  const renderRatingStars = (rating: number | null) => {
    if (!rating) return "-";
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    return <div className="flex">{stars}</div>;
  };

  if (error) {
    return (
      <div className="text-red-500">
        Ошибка при загрузке поставщиков: {error instanceof Error ? error.message : "Неизвестная ошибка"}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Поиск поставщиков по названию или контактному лицу..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Контактное лицо</TableHead>
                <TableHead>Контакты</TableHead>
                <TableHead>Категории товаров</TableHead>
                <TableHead>Рейтинг</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    </TableRow>
                  ))
              ) : filteredSuppliers && filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.supplier_name}</TableCell>
                    <TableCell>{supplier.contact_person ?? '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {supplier.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> 
                            <span className="text-xs">{supplier.phone}</span>
                          </div>
                        )}
                        {supplier.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> 
                            <span className="text-xs">{supplier.email}</span>
                          </div>
                        )}
                        {supplier.website && (
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" /> 
                            <span className="text-xs">{supplier.website}</span>
                          </div>
                        )}
                        {!supplier.phone && !supplier.email && !supplier.website && '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {supplier.product_categories_supplied || '-'}
                      </span>
                    </TableCell>
                    <TableCell>{renderRatingStars(supplier.rating)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/suppliers/${supplier.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSupplierToDelete(supplier.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Удалить</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    {search ? "Поставщики не найдены." : "Поставщики не добавлены."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!supplierToDelete} onOpenChange={(open) => !open && setSupplierToDelete(null)}>
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
              onClick={() => supplierToDelete && handleDelete(supplierToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteSupplierMutation.isPending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
