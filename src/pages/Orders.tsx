
import { useOrders } from "@/hooks/useOrders";
import { AddOrderDialog } from "@/components/orders/AddOrderDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Orders() {
  const { data: orders, isLoading, error } = useOrders();

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
