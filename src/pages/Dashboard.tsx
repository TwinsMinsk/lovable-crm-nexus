
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeads } from "@/hooks/useLeads";
import { useOrders } from "@/hooks/useOrders";
import { useTasks } from "@/hooks/useTasks";
import { AlertTriangle, CalendarClock, ShoppingCart, UserPlus } from "lucide-react";
import { isSameDay, isPast, parseISO, format } from "date-fns";
import { ru } from "date-fns/locale";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data: leads, isLoading: leadsLoading } = useLeads();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  
  const [todayLeads, setTodayLeads] = useState(0);
  const [activeOrders, setActiveOrders] = useState(0);
  const [overdueTasksCount, setOverdueTasksCount] = useState(0);
  
  useEffect(() => {
    // Подсчет лидов за сегодня
    if (leads) {
      const today = new Date();
      const todayLeadsCount = leads.filter(lead => 
        isSameDay(parseISO(lead.created_at), today)
      ).length;
      setTodayLeads(todayLeadsCount);
    }
    
    // Подсчет заказов в работе
    if (orders) {
      const inProgressOrders = orders.filter(order => 
        order.status !== "Завершен" && order.status !== "Отменен"
      ).length;
      setActiveOrders(inProgressOrders);
    }
    
    // Подсчет просроченных задач
    if (tasks) {
      const overdueTasks = tasks.filter(task => 
        task.status !== "Выполнена" && 
        task.status !== "Отменена" && 
        isPast(parseISO(task.due_date)) &&
        !isSameDay(parseISO(task.due_date), new Date())
      ).length;
      setOverdueTasksCount(overdueTasks);
    }
  }, [leads, orders, tasks]);

  // Список задач на сегодня
  const todayTasks = tasks ? tasks.filter(task => 
    task.status !== "Выполнена" && 
    task.status !== "Отменена" &&
    isSameDay(parseISO(task.due_date), new Date())
  ) : [];

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Дашборд</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Карточка новых лидов */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Новые лиды сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="flex items-center">
                  <UserPlus className="mr-2 h-5 w-5 text-blue-500" />
                  <div className="text-3xl font-bold">{todayLeads}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Всего лидов: {leads?.length || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка активных сделок */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Заказы в работе
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-green-500" />
                  <div className="text-3xl font-bold">{activeOrders}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Всего заказов: {orders?.length || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка просроченных задач */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Просроченные задачи
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  <div className="text-3xl font-bold">{overdueTasksCount}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Всего задач: {tasks?.length || 0}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Карточка задач на сегодня */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Задачи на сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <Skeleton className="h-10 w-20" />
            ) : (
              <>
                <div className="flex items-center">
                  <CalendarClock className="mr-2 h-5 w-5 text-yellow-500" />
                  <div className="text-3xl font-bold">{todayTasks.length}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(), 'd MMMM yyyy', {locale: ru})}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Последние задачи</CardTitle>
            <CardDescription>
              {tasksLoading 
                ? "Загрузка..." 
                : `У вас ${tasks?.filter(t => t.status !== "Выполнена" && t.status !== "Отменена").length || 0} незавершенных задач`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {tasks
                  ?.filter(task => task.status !== "Выполнена" && task.status !== "Отменена")
                  .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                  .slice(0, 5)
                  .map(task => (
                    <li 
                      key={task.id} 
                      className={`p-2 border rounded-md ${
                        isPast(parseISO(task.due_date)) && !isSameDay(parseISO(task.due_date), new Date())
                          ? 'border-red-300 bg-red-50' 
                          : isSameDay(parseISO(task.due_date), new Date())
                            ? 'border-yellow-300 bg-yellow-50'
                            : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{task.description}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(parseISO(task.due_date), 'dd.MM.yyyy', {locale: ru})}
                        </span>
                      </div>
                    </li>
                  ))
                }
                {tasks?.filter(task => task.status !== "Выполнена" && task.status !== "Отменена").length === 0 && (
                  <li className="p-2 text-center text-muted-foreground">
                    Нет активных задач
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Последние заказы</CardTitle>
            <CardDescription>Недавно созданные заказы</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersLoading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : (
              <ul className="space-y-2">
                {orders
                  ?.sort((a, b) => 
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                  )
                  .slice(0, 5)
                  .map(order => (
                    <li key={order.id} className="p-2 border rounded-md">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{order.order_number}</div>
                          <div className="text-xs text-muted-foreground">
                            {order.client?.name || "Клиент не указан"}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{order.amount.toLocaleString()} ₽</div>
                          <div className="text-xs text-muted-foreground">
                            {format(parseISO(order.created_at), 'dd.MM.yyyy', {locale: ru})}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                {orders?.length === 0 && (
                  <li className="p-2 text-center text-muted-foreground">
                    Нет заказов
                  </li>
                )}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
