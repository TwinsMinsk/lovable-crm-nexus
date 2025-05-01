
import React from "react";
import { useLeads } from "@/hooks/useLeads";
import { useOrders } from "@/hooks/useOrders";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusReportChart } from "@/components/reports/StatusReportChart";
import { TypeReportChart } from "@/components/reports/TypeReportChart";
import { MainLayout } from "@/components/layout/MainLayout";

export default function Reports() {
  const { data: leads, isLoading: isLeadsLoading } = useLeads();
  const { data: orders, isLoading: isOrdersLoading } = useOrders();
  const { data: tasks, isLoading: isTasksLoading } = useTasks();

  // Подсчет лидов по статусам
  const leadsData = React.useMemo(() => {
    if (!leads) return [];
    
    const statusCounts: Record<string, number> = {};
    
    leads.forEach(lead => {
      const status = lead.status || "Неизвестно";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }, [leads]);

  // Подсчет заказов по типам
  const ordersData = React.useMemo(() => {
    if (!orders) return [];
    
    const typeCounts: Record<string, number> = {};
    
    orders.forEach(order => {
      const type = order.order_type || "Неизвестно";
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count
    }));
  }, [orders]);

  // Подсчет задач по статусам
  const tasksData = React.useMemo(() => {
    if (!tasks) return [];
    
    const statusCounts: Record<string, number> = {};
    
    tasks.forEach(task => {
      const status = task.status || "Неизвестно";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    return Object.entries(statusCounts).map(([status, count]) => ({
      status,
      count
    }));
  }, [tasks]);

  return (
    <MainLayout>
      <div className="p-4 space-y-6">
        <h1 className="text-2xl font-bold mb-4">Отчеты</h1>
        
        <Tabs defaultValue="leads" className="w-full">
          <TabsList>
            <TabsTrigger value="leads">Лиды</TabsTrigger>
            <TabsTrigger value="orders">Заказы</TabsTrigger>
            <TabsTrigger value="tasks">Задачи</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leads">
            <Card>
              <CardHeader>
                <CardTitle>Распределение лидов по статусам</CardTitle>
              </CardHeader>
              <CardContent>
                {isLeadsLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <StatusReportChart data={leadsData} dataKey="status" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Распределение заказов по типам</CardTitle>
              </CardHeader>
              <CardContent>
                {isOrdersLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <TypeReportChart data={ordersData} dataKey="type" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Распределение задач по статусам</CardTitle>
              </CardHeader>
              <CardContent>
                {isTasksLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-[200px] w-full" />
                  </div>
                ) : (
                  <StatusReportChart data={tasksData} dataKey="status" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
