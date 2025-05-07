
import { useForm } from "react-hook-form";
import { Supplier } from "@/types/supplier";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { SupplierBasicInfo } from "./SupplierBasicInfo";
import { SupplierContactInfo } from "./SupplierContactInfo";
import { SupplierDeliveryInfo } from "./SupplierDeliveryInfo";

interface SupplierFormProps {
  supplier: Supplier | null;
  isSubmitting: boolean;
  onSubmit: (data: Partial<Supplier>) => void;
}

export function SupplierForm({ supplier, isSubmitting, onSubmit }: SupplierFormProps) {
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
  useEffect(() => {
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <SupplierBasicInfo form={form} />
          
          <Separator />
          <SupplierContactInfo form={form} />
          
          <Separator />
          <SupplierDeliveryInfo form={form} supplierId={supplier?.id} />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
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
  );
}
