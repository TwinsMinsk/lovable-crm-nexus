
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Новые лиды
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+8% с прошлого месяца</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Активные сделки
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% с прошлого месяца</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Заказы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">+2% с прошлого месяца</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Доход
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₽259,600</div>
            <p className="text-xs text-muted-foreground">+18% с прошлого месяца</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Последние задачи</CardTitle>
            <CardDescription>У вас 5 незавершенных задач</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 border rounded-md">Позвонить новому клиенту</li>
              <li className="p-2 border rounded-md">Отправить коммерческое предложение</li>
              <li className="p-2 border rounded-md">Согласовать встречу</li>
              <li className="p-2 border rounded-md">Обновить базу контактов</li>
              <li className="p-2 border rounded-md">Подготовить отчет о продажах</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Календарь на сегодня</CardTitle>
            <CardDescription>Ближайшие события</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="p-2 border rounded-md">9:00 - Планерка отдела продаж</li>
              <li className="p-2 border rounded-md">11:30 - Звонок с клиентом</li>
              <li className="p-2 border rounded-md">13:00 - Обед</li>
              <li className="p-2 border rounded-md">15:00 - Презентация нового продукта</li>
              <li className="p-2 border rounded-md">17:30 - Итоги дня</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
