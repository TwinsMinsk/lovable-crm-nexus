
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Code } from "lucide-react";

export default function TildaIntegration() {
  // Generate the full webhook URL
  const webhookUrl = `https://kfujvyirpoukoitnqjmu.functions.supabase.co/tilda-webhook`;
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Интеграция с Tilda</h1>
      <p className="text-muted-foreground max-w-prose">
        Настройте интеграцию с вашим сайтом Tilda для автоматического импорта данных о заявках, 
        квизах и заказах в CRM-систему.
      </p>
      
      <Tabs defaultValue="forms">
        <TabsList>
          <TabsTrigger value="forms">Формы обратной связи</TabsTrigger>
          <TabsTrigger value="quiz">Квизы</TabsTrigger>
          <TabsTrigger value="orders">Заказы</TabsTrigger>
        </TabsList>
        
        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройка форм обратной связи</CardTitle>
              <CardDescription>
                Подключите формы обратной связи для автоматического создания лидов в CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertTitle>Адрес для подключения вебхука</AlertTitle>
                <AlertDescription>
                  <code className="bg-muted px-2 py-1 rounded">{webhookUrl}</code>
                  <button 
                    className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('Скопировано в буфер обмена');
                    }}
                  >
                    Скопировать
                  </button>
                </AlertDescription>
              </Alert>
              
              <h3 className="text-lg font-semibold">Шаги по настройке:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>Войдите в административную панель Tilda.</li>
                <li>Перейдите в раздел «Настройки» вашего сайта.</li>
                <li>Выберите вкладку «Формы».</li>
                <li>В разделе «Webhook» вставьте указанный выше URL.</li>
                <li>Сохраните настройки.</li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-4">Информация о полях:</h3>
              <p className="text-sm text-muted-foreground">
                Система автоматически распознает следующие поля из форм Tilda:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>name</strong> - имя клиента (обязательное поле)</li>
                <li><strong>phone</strong> - номер телефона</li>
                <li><strong>email</strong> - электронная почта</li>
                <li><strong>comment</strong> - комментарий</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Все остальные поля формы будут добавлены в комментарий для лида.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="quiz" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройка квизов</CardTitle>
              <CardDescription>
                Подключите квизы для сбора подробной информации о клиентах
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertTitle>Адрес для подключения вебхука</AlertTitle>
                <AlertDescription>
                  <code className="bg-muted px-2 py-1 rounded">{webhookUrl}</code>
                  <button 
                    className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('Скопировано в буфер обмена');
                    }}
                  >
                    Скопировать
                  </button>
                </AlertDescription>
              </Alert>
              
              <h3 className="text-lg font-semibold">Шаги по настройке квизов:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>В редакторе Tilda откройте блок с квизом.</li>
                <li>Перейдите в настройки блока.</li>
                <li>Найдите вкладку «Интеграция» или «Webhook».</li>
                <li>Укажите адрес вебхука, приведенный выше.</li>
                <li>Рекомендуется добавить в название формы слово «квиз» для лучшей идентификации.</li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-4">Обработка результатов квиза:</h3>
              <p className="text-sm text-muted-foreground">
                Система распознает квиз по следующим признакам:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Слово «квиз» или «quiz» в названии формы</li>
                <li>Наличие полей, начинающихся с «q_» (стандартный формат вопросов в квизах Tilda)</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Все вопросы и ответы квиза будут структурированно добавлены в комментарий к лиду.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройка импорта заказов</CardTitle>
              <CardDescription>
                Подключите корзину Tilda для автоматического импорта заказов
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertTitle>Адрес для подключения вебхука</AlertTitle>
                <AlertDescription>
                  <code className="bg-muted px-2 py-1 rounded">{webhookUrl}</code>
                  <button 
                    className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                    onClick={() => {
                      navigator.clipboard.writeText(webhookUrl);
                      alert('Скопировано в буфер обмена');
                    }}
                  >
                    Скопировать
                  </button>
                </AlertDescription>
              </Alert>
              
              <h3 className="text-lg font-semibold">Настройка корзины Tilda:</h3>
              <ol className="list-decimal list-inside space-y-2">
                <li>В панели администрирования Tilda перейдите в раздел «Настройки».</li>
                <li>Выберите вкладку «Корзина».</li>
                <li>Прокрутите до раздела «Webhook для отправки заказов».</li>
                <li>Вставьте URL вебхука, указанный выше.</li>
                <li>Сохраните настройки.</li>
              </ol>
              
              <h3 className="text-lg font-semibold mt-4">Обработка заказов:</h3>
              <p className="text-sm text-muted-foreground">
                При получении данных о заказе система:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Создаст или обновит контакт клиента</li>
                <li>Создаст новый заказ или обновит существующий (при совпадении номера заказа)</li>
                <li>Импортирует список товаров из заказа</li>
                <li>Автоматически создаст уведомление о новом заказе</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-2">
                Для корректной работы убедитесь, что в настройках корзины Tilda включена отправка 
                данных о товарах (поле "products") и информации о клиенте.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
