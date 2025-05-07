
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSupplier } from "@/hooks/useSupplier";
import { useUpdateSupplier } from "@/hooks/useUpdateSupplier";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Supplier } from "@/types/supplier";
import { formatDate } from "@/lib/dateUtils";
import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { SupplierDeleteDialog } from "@/components/suppliers/SupplierDeleteDialog";

export default function SupplierDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: supplier, isLoading, error } = useSupplier(id);
  const updateSupplierMutation = useUpdateSupplier();

  const handleSubmit = async (data: Partial<Supplier>) => {
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
        <SupplierDeleteDialog supplierId={id!} />
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
          <SupplierForm 
            supplier={supplier} 
            isSubmitting={updateSupplierMutation.isPending} 
            onSubmit={handleSubmit} 
          />
        </CardContent>
      </Card>
    </div>
  );
}
