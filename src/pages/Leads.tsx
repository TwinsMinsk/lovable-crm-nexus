
import { useLeads } from "@/hooks/useLeads";
import { AddLeadDialog } from "@/components/leads/AddLeadDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Leads() {
  const { data: leads, isLoading, error } = useLeads();
  const navigate = useNavigate();

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке лидов: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Лиды</h1>
        <AddLeadDialog />
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
              <TableHead>Имя</TableHead>
              <TableHead>Телефон</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Ответственный</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads?.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.phone || "-"}</TableCell>
                <TableCell>{lead.email || "-"}</TableCell>
                <TableCell>{lead.source || "-"}</TableCell>
                <TableCell>{lead.status}</TableCell>
                <TableCell>{lead.responsible_user_id || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/leads/${lead.id}`)}
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
    </div>
  );
}
