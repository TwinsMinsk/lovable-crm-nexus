
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteSupplier } from "@/hooks/useDeleteSupplier";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
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

interface SupplierDeleteDialogProps {
  supplierId: string;
}

export function SupplierDeleteDialog({ supplierId }: SupplierDeleteDialogProps) {
  const navigate = useNavigate();
  const deleteSupplierMutation = useDeleteSupplier();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteSupplierMutation.mutateAsync(supplierId);
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

  return (
    <>
      <Button 
        variant="destructive" 
        onClick={() => setDeleteDialogOpen(true)}
        disabled={deleteSupplierMutation.isPending}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Удалить поставщика
      </Button>

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
    </>
  );
}
