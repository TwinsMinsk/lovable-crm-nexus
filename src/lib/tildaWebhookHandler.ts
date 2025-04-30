
import { supabase } from "./supabaseClient";
import { v4 as uuidv4 } from "uuid";

/**
 * Интерфейс для входящих данных лида из Tilda
 */
interface TildaLeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  formid?: string;
  formname?: string;
  comment?: string;
  [key: string]: any; // Для дополнительных полей
}

/**
 * Интерфейс для входящих данных заказа из Tilda
 */
interface TildaOrderPayload {
  orderid?: string;        // Номер заказа
  payment?: string;        // Статус оплаты
  amount?: string | number; // Сумма заказа
  products?: TildaProduct[]; // Массив товаров
  name?: string;          // Имя клиента
  phone?: string;         // Телефон клиента
  email?: string;         // Email клиента
  [key: string]: any;     // Для дополнительных полей
}

interface TildaProduct {
  name?: string;          // Название товара
  quantity?: string | number; // Количество
  amount?: string | number;   // Цена товара
  sku?: string;          // Артикул товара
  [key: string]: any;    // Для дополнительных полей
}

/**
 * Обрабатывает данные лида из Tilda и сохраняет в базу данных
 * @param payload Данные из вебхука Tilda
 * @returns Результат операции
 */
export async function processTildaLead(payload: TildaLeadPayload) {
  try {
    // Валидация обязательных полей
    if (!payload.name) {
      throw new Error("Отсутствует обязательное поле 'name'");
    }

    // Подготовка данных для сохранения
    const leadData = {
      name: payload.name,
      phone: payload.phone || null,
      email: payload.email || null,
      source: `Tilda Form: ${payload.formname || payload.formid || 'Unknown'}`,
      status: "Новый",
      comment: payload.comment || null,
      user_id: process.env.SUPABASE_SERVICE_ROLE_ID || "00000000-0000-0000-0000-000000000000" // Дефолтный ID для системных записей
    };

    // Сохранение в базу данных
    const { data, error } = await supabase.from("leads").insert(leadData);

    if (error) {
      console.error("Ошибка при сохранении лида:", error);
      throw error;
    }

    console.log("Лид успешно сохранен:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Ошибка при обработке лида из Tilda:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Неизвестная ошибка" 
    };
  }
}

/**
 * Обрабатывает данные заказа из Tilda и сохраняет в базу данных
 * @param payload Данные из вебхука Tilda
 * @returns Результат операции
 */
export async function processTildaOrder(payload: TildaOrderPayload) {
  try {
    // Валидация обязательных полей
    if (!payload.orderid) {
      throw new Error("Отсутствует обязательное поле 'orderid'");
    }

    // Поиск или создание контакта по имени и телефону/email
    let clientId: string;
    
    // Попытка найти существующий контакт
    const { data: existingContacts, error: contactError } = await supabase
      .from("contacts")
      .select("id")
      .or(`phone.ilike.%${payload.phone}%,email.ilike.%${payload.email}%`)
      .limit(1);
    
    if (contactError) {
      console.error("Ошибка при поиске контакта:", contactError);
      throw contactError;
    }

    // Если контакт найден - используем его ID, иначе создаем новый
    if (existingContacts && existingContacts.length > 0) {
      clientId = existingContacts[0].id;
    } else {
      // Создание нового контакта
      const newContact = {
        name: payload.name || "Клиент из Tilda",
        phones: payload.phone ? [{ value: payload.phone, type: "primary" }] : [],
        emails: payload.email ? [{ value: payload.email, type: "primary" }] : [],
        user_id: process.env.SUPABASE_SERVICE_ROLE_ID || "00000000-0000-0000-0000-000000000000"
      };

      const { data: contactData, error: createError } = await supabase
        .from("contacts")
        .insert(newContact)
        .select("id")
        .single();

      if (createError || !contactData) {
        console.error("Ошибка при создании контакта:", createError);
        throw createError || new Error("Не удалось создать контакт");
      }

      clientId = contactData.id;
    }

    // Обработка товаров заказа
    const orderItems = Array.isArray(payload.products) 
      ? payload.products.map(product => ({
          product_id: product.sku || uuidv4().substring(0, 8),
          product_name: product.name || "Товар без названия",
          quantity: Number(product.quantity) || 1,
          price: Number(product.amount) || 0
        }))
      : [];

    // Расчет общей суммы заказа
    const totalAmount = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 
                        Number(payload.amount) || 0;

    // Подготовка данных заказа
    const orderData = {
      order_number: payload.orderid,
      client_id: clientId,
      order_type: "Готовая мебель", // По умолчанию для заказов из Tilda
      status: "Новый",
      amount: totalAmount,
      items: orderItems,
      payment_status: payload.payment === "paid" ? "Оплачен" : "Не оплачен",
      notes: `Заказ из Tilda ${payload.orderid}`,
      user_id: process.env.SUPABASE_SERVICE_ROLE_ID || "00000000-0000-0000-0000-000000000000"
    };

    // Проверка существующего заказа по номеру
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", payload.orderid)
      .limit(1);

    let result;
    
    if (existingOrder && existingOrder.length > 0) {
      // Обновление существующего заказа
      const { data, error } = await supabase
        .from("orders")
        .update(orderData)
        .eq("id", existingOrder[0].id)
        .select();

      if (error) {
        console.error("Ошибка при обновлении заказа:", error);
        throw error;
      }

      result = { success: true, action: "updated", data };
    } else {
      // Создание нового заказа
      const { data, error } = await supabase
        .from("orders")
        .insert(orderData)
        .select();

      if (error) {
        console.error("Ошибка при создании заказа:", error);
        throw error;
      }

      result = { success: true, action: "created", data };
    }

    console.log(`Заказ успешно ${result.action === "created" ? "создан" : "обновлен"}:`, result.data);
    return result;
  } catch (error) {
    console.error("Ошибка при обработке заказа из Tilda:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Неизвестная ошибка" 
    };
  }
}
