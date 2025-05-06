
import { useContacts } from "@/hooks/useContacts";
import { AddContactDialog } from "@/components/contacts/AddContactDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/context/AuthContext";

// Import Json type from Supabase types to properly handle JSON data
import { Json } from "@/integrations/supabase/types";

// Define proper types for our contact data
interface Phone {
  number: string;
}

interface Email {
  address: string;
}

interface Contact {
  id: string;
  name: string;
  phones?: Json;
  emails?: Json;
  responsible_user_id?: string | null;
  notes?: string | null;
}

// Type guard function to check if an object has the Phone structure
function isPhone(obj: any): obj is Phone {
  return typeof obj === 'object' && obj !== null && typeof obj.number === 'string';
}

// Type guard function to check if an object has the Email structure
function isEmail(obj: any): obj is Email {
  return typeof obj === 'object' && obj !== null && typeof obj.address === 'string';
}

export default function Contacts() {
  const { data: contacts, isLoading, error } = useContacts();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getResponsibleName = (userId?: string) => {
    if (!userId) return "-";
    
    if (userId === user?.id) {
      return user?.user_metadata?.full_name || "Вы";
    }
    
    return "Пользователь " + userId.substring(0, 8);
  };

  if (error) {
    return (
      <div className="p-4">
        <div className="text-red-500">
          Ошибка при загрузке контактов: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Контакты</h1>
        <AddContactDialog />
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
              <TableHead>Телефоны</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Ответственный</TableHead>
              <TableHead>Заметки</TableHead>
              <TableHead className="text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts?.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>
                  {contact.phones && 
                   Array.isArray(contact.phones) && 
                   contact.phones.length > 0
                    ? contact.phones.map((phone, i) => {
                        if (isPhone(phone)) {
                          return <div key={i}>{phone.number}</div>;
                        }
                        return null;
                      })
                    : "-"}
                </TableCell>
                <TableCell>
                  {contact.emails && 
                   Array.isArray(contact.emails) && 
                   contact.emails.length > 0
                    ? contact.emails.map((email, i) => {
                        if (isEmail(email)) {
                          return <div key={i}>{email.address}</div>;
                        }
                        return null;
                      })
                    : "-"}
                </TableCell>
                <TableCell>{getResponsibleName(contact.responsible_user_id)}</TableCell>
                <TableCell>{contact.notes || "-"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" /> 
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
