
import { AddProductDialog } from "@/components/products/AddProductDialog";
import { ProductList } from "@/components/products/ProductList";

export default function Products() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Товары</h1>
        <AddProductDialog />
      </div>
      
      <ProductList />
    </div>
  );
}
