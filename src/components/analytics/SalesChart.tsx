
import { useState, useEffect } from "react";
import { useOrders } from "@/hooks/useOrders";
import { parseISO, format, subMonths, isSameMonth } from "date-fns";
import { ru } from "date-fns/locale";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function SalesChart() {
  const { data: orders, isLoading } = useOrders();
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      // Создаем данные за последние 12 месяцев
      const today = new Date();
      const last12Months = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(today, i);
        return {
          month: format(date, "MMM", { locale: ru }),
          date: date,
          total: 0,
          count: 0,
        };
      }).reverse();

      // Заполняем данные на основе заказов
      orders.forEach(order => {
        const orderDate = parseISO(order.created_at);
        
        const monthIndex = last12Months.findIndex(m =>
          isSameMonth(m.date, orderDate)
        );
        
        if (monthIndex !== -1) {
          last12Months[monthIndex].total += Number(order.amount);
          last12Months[monthIndex].count += 1;
        }
      });

      // Форматируем данные для графика
      const formattedData = last12Months.map(month => ({
        name: month.month,
        Продажи: month.total,
        Заказы: month.count,
      }));

      setChartData(formattedData);
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
      config={{
        Продажи: {
          color: "#0ea5e9",
          label: "Продажи",
        },
        Заказы: {
          color: "#6366f1",
          label: "Количество заказов",
        },
      }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            tickFormatter={(value) =>
              value >= 1000 ? `${(value / 1000).toString()}k` : value.toString()
            }
          />
          <Bar
            dataKey="Продажи"
            fill="var(--color-Продажи)"
            radius={[4, 4, 0, 0]}
            className="hover:opacity-80"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
