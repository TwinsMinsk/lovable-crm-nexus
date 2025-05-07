
export interface Supplier {
  id: string;
  supplier_name: string;
  contact_person: string | null;
  phone: string | null;
  secondary_phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  product_categories_supplied: string | null;
  payment_terms: string | null;
  delivery_terms: string | null;
  notes: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export type CreateSupplierData = Omit<Supplier, 'id' | 'created_at' | 'updated_at'>;
