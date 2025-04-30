
import { useState } from "react";
import { usePartners } from "@/hooks/usePartners";
import { useDeletePartner } from "@/hooks/useDeletePartner";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Phone, Mail } from "lucide-react";
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

export function PartnerList() {
  const { data: partners, isLoading, error } = usePartners();
  const deletePartnerMutation = useDeletePartner();
  
  const [search, setSearch] = useState("");
  const [partnerToDelete, setPartnerToDelete] = useState<string | null>(null);

  const filteredPartners = partners?.filter((partner) =>
    partner.name.toLowerCase().includes(search.toLowerCase()) ||
    (partner.contact_person && partner.contact_person.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = async (id: string) => {
    try {
      await deletePartnerMutation.mutateAsync(id);
      toast.success("Партнер успешно удален");
      setPartnerToDelete(null);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при удалении: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при удалении");
      }
    }
  };

  if (error) {
    return (
      <div className="text-red-500">
        Ошибка при загрузке партнеров: {error instanceof Error ? error.message : "Неизвестная ошибка"}
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <Input
          placeholder="Поиск партнеров по названию или контактному лицу..."
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
                <TableHead>Специализация</TableHead>
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
                    </TableRow>
                  ))
              ) : filteredPartners && filteredPartners.length > 0 ? (
                filteredPartners.map((partner) => (
                  <TableRow key={partner.id}>
                    <TableCell className="font-medium">{partner.name}</TableCell>
                    <TableCell>{partner.contact_person ?? '-'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {partner.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> 
                            <span className="text-xs">{partner.phone}</span>
                          </div>
                        )}
                        {partner.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> 
                            <span className="text-xs">{partner.email}</span>
                          </div>
                        )}
                        {!partner.phone && !partner.email && '-'}
                      </div>
                    </TableCell>
                    <TableCell>{partner.specialization ?? '-'}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          asChild
                        >
                          <Link to={`/partners/${partner.id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Редактировать</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setPartnerToDelete(partner.id)}
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
                  <TableCell colSpan={5} className="text-center">
                    {search ? "Партнеры не найдены." : "Партнеры не добавлены."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!partnerToDelete} onOpenChange={(open) => !open && setPartnerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Партнер будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => partnerToDelete && handleDelete(partnerToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletePartnerMutation.isPending ? "Удаление..." : "Удалить"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
