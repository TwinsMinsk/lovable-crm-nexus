
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";

interface OrderCardProps {
  order: {
    id: string;
    order_number: string;
    status: string;
    amount: number;
    client?: { name: string } | null;
    partner?: { name: string } | null;
    order_type: string;
    payment_status?: string | null;
  };
  statuses: string[];
}

export const OrderCard = ({ order, statuses }: OrderCardProps) => {
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const [isMoving, setIsMoving] = useState(false);

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === order.status) return;
    
    setIsMoving(true);
    updateStatus(
      { orderId: order.id, newStatus },
      {
        onSettled: () => setIsMoving(false),
      }
    );
  };

  return (
    <Card 
      className={`mb-3 ${isMoving ? 'opacity-50' : ''}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("orderId", order.id);
        e.dataTransfer.setData("currentStatus", order.status);
      }}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          {order.order_number}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-muted-foreground mb-1">
          {order.client?.name || "Без клиента"}
        </div>
        <div className="text-xs font-medium">
          {order.order_type}
        </div>
        <div className="text-sm font-bold mt-1">
          {order.amount.toLocaleString()} €
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between text-xs">
        <div className={order.payment_status === "Оплачен" ? "text-green-500" : "text-amber-500"}>
          {order.payment_status || "Не оплачен"}
        </div>
        {order.partner && (
          <div className="text-gray-500">{order.partner.name}</div>
        )}
      </CardFooter>
    </Card>
  );
};
