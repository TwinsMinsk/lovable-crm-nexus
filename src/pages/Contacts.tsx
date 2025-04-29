
import { useContacts } from "@/hooks/useContacts";
import { AddContactDialog } from "@/components/contacts/AddContactDialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

export default function Contacts() {
  const { data: contacts, isLoading, error } = useContacts();

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
                    ? contact.phones.map((phone, i) => (
                        <div key={i}>{(phone as Phone).number}</div>
                      ))
                    : "-"}
                </TableCell>
                <TableCell>
                  {contact.emails && 
                   Array.isArray(contact.emails) && 
                   contact.emails.length > 0
                    ? contact.emails.map((email, i) => (
                        <div key={i}>{(email as Email).address}</div>
                      ))
                    : "-"}
                </TableCell>
                <TableCell>{contact.responsible_user_id || "-"}</TableCell>
                <TableCell>{contact.notes || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
