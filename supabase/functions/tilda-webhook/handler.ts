
import { supabase } from "./supabaseClient.ts";

/**
 * Интерфейс для входящих данных лида из Tilda
 */
export interface TildaLeadPayload {
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
export interface TildaOrderPayload {
  orderid?: string;        // Номер заказа
  payment?: string;        // Статус оплаты
  amount?: string | number; // Сумма заказа
  products?: any[] | string; // Массив товаров или строка, которую нужно распарсить
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
 * Обрабатывает данные квиза из Tilda и сохраняет в базу данных
 * Квиз обрабатывается как специальный тип лида с дополнительными данными
 */
export async function processTildaQuiz(payload: TildaLeadPayload) {
  try {
    // Собираем данные из квиза в комментарий
    let quizData = "Данные из квиза:\n";
    
    // Проходим по всем полям и добавляем их в комментарий, исключая стандартные поля
    const standardFields = ["name", "phone", "email", "formid", "formname"];
    
    for (const [key, value] of Object.entries(payload)) {
      if (!standardFields.includes(key) && key.startsWith("q_")) {
        // Если ключ начинается с q_, это вопрос из квиза
        const questionName = key.replace("q_", "").replace(/_/g, " ");
        quizData += `${questionName}: ${value}\n`;
      }
    }
    
    // Добавляем собранные данные квиза к комментарию
    const comment = payload.comment 
      ? `${payload.comment}\n\n${quizData}` 
      : quizData;
    
    // Создаем расширенный объект с данными квиза для создания лида
    const quizLeadData = {
      ...payload,
      comment,
      source: `Квиз: ${payload.formname || payload.formid || 'Неизвестный'}`,
    };
    
    // Используем стандартную функцию обработки лида
    return await processTildaLead(quizLeadData);
  } catch (error) {
    console.error("Ошибка при обработке квиза из Tilda:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Неизвестная ошибка" 
    };
  }
}

/**
 * Обрабатывает данные лида из Tilda и сохраняет в базу данных
 * @param payload Данные из вебхука Tilda
 * @returns Результат операции
 */
export async function processTildaLead(payload: TildaLeadPayload) {
  try {
    // Проверяем, является ли это квизом по имени формы или другим признакам
    if (payload.formname?.toLowerCase().includes("квиз") || 
        payload.formid?.toLowerCase().includes("quiz") ||
        Object.keys(payload).some(key => key.startsWith("q_"))) {
      return await processTildaQuiz(payload);
    }
    
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
      user_id: Deno.env.get("SUPABASE_SERVICE_ROLE_ID") || "00000000-0000-0000-0000-000000000000" // Дефолтный ID для системных записей
    };

    // Сохранение в базу данных
    const { data, error } = await supabase.from("leads").insert(leadData);

    if (error) {
      console.error("Ошибка при сохранении лида:", error);
      throw error;
    }

    console.log("Лид успешно сохранен:", data);
    
    // Создаем уведомление о новом лиде
    try {
      if (data) {
        await supabase.from("notifications").insert({
          user_id: leadData.user_id,
          message: `Новый лид из Tilda: ${leadData.name}`,
          related_table: "leads",
          related_id: data[0].id
        });
      }
    } catch (notifError) {
      console.error("Ошибка при создании уведомления:", notifError);
      // Не прерываем выполнение, если не удалось создать уведомление
    }

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
        user_id: Deno.env.get("SUPABASE_SERVICE_ROLE_ID") || "00000000-0000-0000-0000-000000000000"
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
    let orderItems = [];
    
    // Tilda может отправлять товары в разных форматах
    if (payload.products) {
      // Если продукты переданы как строка JSON
      if (typeof payload.products === 'string') {
        try {
          orderItems = JSON.parse(payload.products).map((product: TildaProduct) => ({
            product_id: product.sku || `tilda-${Math.random().toString(36).substring(2, 10)}`,
            product_name: product.name || "Товар без названия",
            quantity: Number(product.quantity) || 1,
            price: Number(product.amount || product.price) || 0
          }));
        } catch (e) {
          console.error("Ошибка при разборе JSON продуктов:", e);
          // Если не удалось разобрать JSON, создаем один общий товар
          orderItems = [{
            product_id: `tilda-${Math.random().toString(36).substring(2, 10)}`,
            product_name: "Товар из Tilda",
            quantity: 1,
            price: Number(payload.amount) || 0
          }];
        }
      } else if (Array.isArray(payload.products)) {
        // Если продукты уже являются массивом
        orderItems = payload.products.map(product => ({
          product_id: product.sku || `tilda-${Math.random().toString(36).substring(2, 10)}`,
          product_name: product.name || "Товар без названия",
          quantity: Number(product.quantity) || 1,
          price: Number(product.amount || product.price) || 0
        }));
      }
    } else {
      // Если нет информации о товарах, создаем один общий товар
      orderItems = [{
        product_id: `tilda-order-${payload.orderid}`,
        product_name: "Заказ из Tilda",
        quantity: 1,
        price: Number(payload.amount) || 0
      }];
    }

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
      user_id: Deno.env.get("SUPABASE_SERVICE_ROLE_ID") || "00000000-0000-0000-0000-000000000000"
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
    
    // Создаем уведомление о новом заказе
    try {
      if (result.data && result.data.length > 0) {
        await supabase.from("notifications").insert({
          user_id: orderData.user_id,
          message: `Новый заказ #${payload.orderid} из Tilda`,
          related_table: "orders",
          related_id: result.data[0].id
        });
      }
    } catch (notifError) {
      console.error("Ошибка при создании уведомления:", notifError);
      // Не прерываем выполнение, если не удалось создать уведомление
    }
    
    return result;
  } catch (error) {
    console.error("Ошибка при обработке заказа из Tilda:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Неизвестная ошибка" 
    };
  }
}
