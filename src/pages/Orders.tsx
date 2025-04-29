
import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { eye } from "lucide-react";
import { OrderCard } from "@/components/orders/OrderCard";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Define the workflows and their statuses
const workflows = {
  manufacturing: {
    name: "Изготовление",
    statuses: [
      "Новый",
      "Замер",
      "Проектирование",
      "Согласование",
      "Производство",
      "Готов к отгрузке",
      "Доставка",
      "Завершен"
    ]
  },
  readyMade: {
    name: "Готовая мебель",
    statuses: [
      "Новый",
      "Подбор",
      "Ожидание поставки",
      "Готов к отгрузке",
      "Доставка",
      "Завершен"
    ]
  }
};

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("table");
  const [activeWorkflow, setActiveWorkflow] = useState<"manufacturing" | "readyMade">("manufacturing");

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    
    const orderId = e.dataTransfer.getData("orderId");
    const currentStatus = e.dataTransfer.getData("currentStatus");
    
    if (currentStatus !== newStatus && orderId) {
      updateStatus({ orderId, newStatus });
    }
  };

  // Group orders by status
  const getOrdersByStatus = (status: string) => {
    if (!orders) return [];
    return orders.filter(order => order.status === status);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке заказов: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <AddOrderDialog />
      </div>

      <Tabs defaultValue="table" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="table">Таблица</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
        </TabsList>
        
        <TabsContent value="table" className="mt-4">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№ Заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус оплаты</TableHead>
                  <TableHead>Ответственный</TableHead>
                  <TableHead>Партнер</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_number}</TableCell>
                    <TableCell>{order.client?.name || "-"}</TableCell>
                    <TableCell>{order.order_type}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.amount.toLocaleString()} ₽</TableCell>
                    <TableCell>{order.payment_status}</TableCell>
                    <TableCell>{order.responsible_user_id || "-"}</TableCell>
                    <TableCell>{order.partner?.name || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => navigate(`/orders/${order.id}`)}
                        className="flex items-center gap-1"
                      >
                        <eye className="h-4 w-4" /> 
                        Просмотр
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-4">
          {isLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-36 w-full" />
              ))}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <Tabs 
                  defaultValue="manufacturing" 
                  value={activeWorkflow} 
                  onValueChange={(value) => setActiveWorkflow(value as "manufacturing" | "readyMade")}
                >
                  <TabsList>
                    <TabsTrigger value="manufacturing">Изготовление</TabsTrigger>
                    <TabsTrigger value="readyMade">Готовая мебель</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-x-auto">
                {workflows[activeWorkflow].statuses.map(status => (
                  <div 
                    key={status} 
                    className="min-w-[250px]"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">{status}</CardTitle>
                        <div className="text-xs text-muted-foreground">
                          {getOrdersByStatus(status).length} заказов
                        </div>
                      </CardHeader>
                      <CardContent className="overflow-y-auto max-h-[70vh]">
                        {getOrdersByStatus(status).map(order => (
                          <div key={order.id} className="mb-2 last:mb-0" onClick={() => navigate(`/orders/${order.id}`)}>
                            <OrderCard 
                              order={order} 
                              statuses={workflows[activeWorkflow].statuses}
                            />
                          </div>
                        ))}
                        {getOrdersByStatus(status).length === 0 && (
                          <div className="text-center text-muted-foreground text-xs p-4">
                            Нет заказов
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
