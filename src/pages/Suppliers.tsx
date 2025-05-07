
import { AddSupplierDialog } from "@/components/suppliers/AddSupplierDialog";
import { SupplierList } from "@/components/suppliers/SupplierList";

export default function Suppliers() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Поставщики</h1>
        <AddSupplierDialog />
      </div>
      
      <SupplierList />
    </div>
  );
}
