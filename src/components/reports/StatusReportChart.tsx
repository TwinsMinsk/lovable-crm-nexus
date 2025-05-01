
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// Массив цветов для графика
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface DataItem {
  status: string;
  count: number;
}

interface StatusReportChartProps {
  data: DataItem[];
  dataKey: string;
}

export const StatusReportChart = ({ data, dataKey }: StatusReportChartProps) => {
  // Конфигурация графика для использования с ChartContainer
  const chartConfig = data.reduce((acc, item, index) => {
    acc[item[dataKey]] = {
      label: item[dataKey],
      color: COLORS[index % COLORS.length],
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <div className="w-full h-[300px]">
      <ChartContainer config={chartConfig}>
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Нет данных для отображения</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                nameKey={dataKey}
                dataKey="count"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={(entry) => `${entry[dataKey]}: ${entry.count}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </ChartContainer>
    </div>
  );
};
