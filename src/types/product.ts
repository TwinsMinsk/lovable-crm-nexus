
export interface Product {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  sku: string | null;
  price: number;
  image_url: string | null;
  user_id: string;
  default_supplier_id: string | null;
}

export interface CreateProductData {
  name: string;
  description?: string;
  sku?: string;
  price: number;
  image_url?: string;
  user_id: string;
  default_supplier_id?: string | null;
}

export interface UpdateProductData {
  id: string;
  name?: string;
  description?: string | null;
  sku?: string | null;
  price?: number;
  image_url?: string | null;
  default_supplier_id?: string | null;
}
