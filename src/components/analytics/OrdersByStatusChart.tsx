
import { useState, useEffect } from "react";
import { useOrders } from "@/hooks/useOrders";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export function OrdersByStatusChart() {
  const { data: orders, isLoading } = useOrders();
  const [chartData, setChartData] = useState<any[]>([]);
  
  const COLORS = {
    "Новый": "#3b82f6",
    "В работе": "#16a34a",
    "Замер": "#eab308",
    "Дизайн": "#d946ef",
    "Производство": "#f97316",
    "Доставка": "#64748b",
    "Установка": "#0ea5e9",
    "Завершен": "#22c55e",
    "Отменен": "#ef4444",
    "Другое": "#94a3b8"
  };

  useEffect(() => {
    if (orders && orders.length > 0) {
      // Группируем заказы по статусам
      const statusCounts: Record<string, number> = {};
      
      orders.forEach(order => {
        const status = order.status || "Другое";
        statusCounts[status] = (statusCounts[status] || 0) + 1;
      });
      
      // Преобразуем в формат для графика
      const data = Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      }));
      
      setChartData(data);
    }
  }, [orders]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Загрузка данных...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <ChartContainer
      config={
        chartData.reduce((acc, item) => {
          const status = item.name;
          const colorKey = COLORS[status as keyof typeof COLORS] || COLORS.Другое;
          
          return {
            ...acc,
            [status]: {
              color: colorKey,
              label: status,
            }
          };
        }, {})
      }
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => {
              const color = COLORS[entry.name as keyof typeof COLORS] || COLORS.Другое;
              return <Cell key={`cell-${index}`} fill={color} />;
            })}
          </Pie>
          <Legend layout="vertical" align="right" verticalAlign="middle" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
