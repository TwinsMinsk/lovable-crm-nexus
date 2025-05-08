
import { supabase } from "@/lib/supabaseClient";
import { Product, CreateProductData } from "@/types/product";
import { createNotification } from "@/utils/notificationHelpers";

/**
 * Поиск продукта по артикулу (SKU)
 */
export async function findProductBySku(sku: string): Promise<Product | null> {
  if (!sku) return null;
  
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("sku", sku)
    .limit(1)
    .single();
  
  if (error) {
    if (error.code === "PGRST116") {
      return null; // Продукт не найден
    }
    console.error("Ошибка при поиске продукта:", error);
    throw error;
  }
  
  return data as Product;
}

/**
 * Создание нового продукта на основе данных из Tilda
 */
export async function createProductFromTilda(
  productData: { 
    name: string, 
    sku?: string, 
    price: number, 
    image_url?: string 
  }, 
  userId: string
): Promise<Product> {
  const newProduct: CreateProductData = {
    name: productData.name,
    sku: productData.sku || null,
    price: productData.price,
    image_url: productData.image_url || null,
    user_id: userId,
    description: "Товар импортирован из Tilda"
  };
  
  const { data, error } = await supabase
    .from("products")
    .insert(newProduct)
    .select()
    .single();
  
  if (error) {
    console.error("Ошибка при создании продукта:", error);
    throw error;
  }
  
  // Создаем уведомление о новом продукте
  await createNotification({
    userId,
    message: `Импортирован новый товар: ${productData.name}`,
    relatedTable: "products",
    relatedId: data.id
  });
  
  return data as Product;
}

/**
 * Получение или создание продукта по данным из Tilda
 */
export async function getOrCreateProductFromTilda(
  tildaProduct: { 
    name: string, 
    sku?: string, 
    price: number, 
    image_url?: string 
  }, 
  userId: string
): Promise<Product> {
  // Если у товара есть артикул, пытаемся найти его в базе
  if (tildaProduct.sku) {
    const existingProduct = await findProductBySku(tildaProduct.sku);
    if (existingProduct) return existingProduct;
  }
  
  // Если товар не найден, создаем новый
  return await createProductFromTilda(tildaProduct, userId);
}
