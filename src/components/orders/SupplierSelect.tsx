
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SupplierSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function SupplierSelect({ value, onChange, label = "Поставщик" }: SupplierSelectProps) {
  const [suppliers, setSuppliers] = useState<{ id: string; supplier_name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchSuppliers() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("suppliers")
          .select("id, supplier_name")
          .order("supplier_name");

        if (error) throw error;
        setSuppliers(data || []);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSuppliers();
  }, []);

  return (
    <div className="space-y-2">
      <Label htmlFor="supplier">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Выберите поставщика" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Не выбрано</SelectItem>
          {isLoading ? (
            <SelectItem value="loading" disabled>
              Загрузка...
            </SelectItem>
          ) : suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <SelectItem key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-suppliers" disabled>
              Нет доступных поставщиков
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
