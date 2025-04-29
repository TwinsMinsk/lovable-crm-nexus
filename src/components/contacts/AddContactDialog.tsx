
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAddContact } from "@/hooks/useAddContact";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";

export const AddContactDialog = () => {
  const { user } = useAuth();
  const addContact = useAddContact();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phones: [{ number: "" }],
    emails: [{ address: "" }],
    responsible_user_id: user?.id || "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Filter out empty phone numbers and email addresses
    const phones = formData.phones.filter(phone => phone.number.trim() !== "");
    const emails = formData.emails.filter(email => email.address.trim() !== "");
    
    await addContact.mutateAsync({
      ...formData,
      phones,
      emails,
    });
    setOpen(false);
    setFormData({
      name: "",
      phones: [{ number: "" }],
      emails: [{ address: "" }],
      responsible_user_id: user?.id || "",
      notes: "",
    });
  };

  const addPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, { number: "" }],
    });
  };

  const updatePhone = (index: number, value: string) => {
    const updatedPhones = [...formData.phones];
    updatedPhones[index] = { number: value };
    setFormData({ ...formData, phones: updatedPhones });
  };

  const removePhone = (index: number) => {
    const updatedPhones = formData.phones.filter((_, i) => i !== index);
    setFormData({ ...formData, phones: updatedPhones });
  };

  const addEmail = () => {
    setFormData({
      ...formData,
      emails: [...formData.emails, { address: "" }],
    });
  };

  const updateEmail = (index: number, value: string) => {
    const updatedEmails = [...formData.emails];
    updatedEmails[index] = { address: value };
    setFormData({ ...formData, emails: updatedEmails });
  };

  const removeEmail = (index: number) => {
    const updatedEmails = formData.emails.filter((_, i) => i !== index);
    setFormData({ ...formData, emails: updatedEmails });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Добавить контакт</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить новый контакт</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Имя*</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Телефоны</Label>
            {formData.phones.map((phone, index) => (
              <div key={`phone-${index}`} className="flex space-x-2">
                <Input
                  placeholder="Номер телефона"
                  value={phone.number}
                  onChange={(e) => updatePhone(index, e.target.value)}
                />
                {formData.phones.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removePhone(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addPhone}
            >
              <Plus className="h-4 w-4 mr-1" /> Добавить телефон
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label>Emails</Label>
            {formData.emails.map((email, index) => (
              <div key={`email-${index}`} className="flex space-x-2">
                <Input
                  type="email"
                  placeholder="Email адрес"
                  value={email.address}
                  onChange={(e) => updateEmail(index, e.target.value)}
                />
                {formData.emails.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeEmail(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addEmail}
            >
              <Plus className="h-4 w-4 mr-1" /> Добавить email
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Заметки</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={addContact.isPending}>
              {addContact.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
