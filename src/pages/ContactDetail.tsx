
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useContact } from "@/hooks/useContact";
import { useUpdateContact } from "@/hooks/useUpdateContact";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { pencil } from "lucide-react";
import { Json } from "@/integrations/supabase/types";

// Define proper types for our contact data
interface Phone {
  number: string;
}

interface Email {
  address: string;
}

// Type guard function to check if an object has the Phone structure
function isPhone(obj: any): obj is Phone {
  return typeof obj === 'object' && obj !== null && typeof obj.number === 'string';
}

// Type guard function to check if an object has the Email structure
function isEmail(obj: any): obj is Email {
  return typeof obj === 'object' && obj !== null && typeof obj.address === 'string';
}

export default function ContactDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: contact, isLoading, error } = useContact(id);
  const { mutate: updateContact } = useUpdateContact();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phones: [] as Phone[],
    emails: [] as Email[],
    responsible_user_id: "",
    notes: ""
  });
  
  // Initialize form data when contact is loaded
  useState(() => {
    if (contact) {
      const phones = Array.isArray(contact.phones) ? contact.phones.filter(isPhone) : [];
      const emails = Array.isArray(contact.emails) ? contact.emails.filter(isEmail) : [];
      
      setFormData({
        name: contact.name || "",
        phones,
        emails,
        responsible_user_id: contact.responsible_user_id || "",
        notes: contact.notes || ""
      });
    }
  });
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, name: e.target.value }));
  };
  
  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...formData.phones];
    newPhones[index] = { number: value };
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };
  
  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...formData.emails];
    newEmails[index] = { address: value };
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };
  
  const handleAddPhone = () => {
    setFormData(prev => ({
      ...prev,
      phones: [...prev.phones, { number: "" }]
    }));
  };
  
  const handleAddEmail = () => {
    setFormData(prev => ({
      ...prev,
      emails: [...prev.emails, { address: "" }]
    }));
  };
  
  const handleRemovePhone = (index: number) => {
    const newPhones = [...formData.phones];
    newPhones.splice(index, 1);
    setFormData(prev => ({ ...prev, phones: newPhones }));
  };
  
  const handleRemoveEmail = (index: number) => {
    const newEmails = [...formData.emails];
    newEmails.splice(index, 1);
    setFormData(prev => ({ ...prev, emails: newEmails }));
  };
  
  const handleResponsibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, responsible_user_id: e.target.value }));
  };
  
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, notes: e.target.value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateContact(
      { 
        id, 
        data: {
          name: formData.name,
          phones: formData.phones,
          emails: formData.emails,
          responsible_user_id: formData.responsible_user_id || null,
          notes: formData.notes || null
        }
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Контакт успешно обновлен");
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    );
  };
  
  const handleEdit = () => {
    if (contact) {
      const phones = Array.isArray(contact.phones) ? contact.phones.filter(isPhone) : [];
      const emails = Array.isArray(contact.emails) ? contact.emails.filter(isEmail) : [];
      
      setFormData({
        name: contact.name || "",
        phones,
        emails,
        responsible_user_id: contact.responsible_user_id || "",
        notes: contact.notes || ""
      });
      setIsEditing(true);
    }
  };
  
  if (error) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="text-red-500">
            Ошибка при загрузке контакта: {error.message}
          </div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isLoading ? <Skeleton className="h-8 w-48" /> : `Контакт: ${contact?.name || ""}`}
          </h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/contacts")}
            >
              Назад к списку
            </Button>
            {!isEditing && (
              <Button 
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <pencil className="h-4 w-4" /> Редактировать
              </Button>
            )}
          </div>
        </div>
        
        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle><Skeleton className="h-6 w-32" /></CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                {isEditing ? "Редактирование контакта" : "Информация о контакте"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Имя</Label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Телефоны</Label>
                    {formData.phones.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          value={phone.number}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleRemovePhone(index)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddPhone}
                    >
                      Добавить телефон
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Email адреса</Label>
                    {formData.emails.map((email, index) => (
                      <div key={index} className="flex gap-2">
                        <Input 
                          type="email"
                          value={email.address}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                        />
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => handleRemoveEmail(index)}
                        >
                          Удалить
                        </Button>
                      </div>
                    ))}
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddEmail}
                    >
                      Добавить email
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="responsible">Ответственный</Label>
                    <Input 
                      id="responsible" 
                      value={formData.responsible_user_id}
                      onChange={handleResponsibleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Заметки</Label>
                    <Textarea 
                      id="notes" 
                      value={formData.notes}
                      onChange={handleNotesChange}
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsEditing(false)}
                    >
                      Отмена
                    </Button>
                    <Button type="submit">Сохранить</Button>
                  </div>
                </form>
              ) : contact ? (
                <div className="space-y-6">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Имя</p>
                    <p className="text-lg">{contact.name}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Телефоны</p>
                    {contact.phones && Array.isArray(contact.phones) && contact.phones.length > 0 ? (
                      <div className="space-y-1">
                        {contact.phones.map((phone: Json, i: number) => (
                          isPhone(phone) && (
                            <p key={i}>{phone.number}</p>
                          )
                        ))}
                      </div>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email адреса</p>
                    {contact.emails && Array.isArray(contact.emails) && contact.emails.length > 0 ? (
                      <div className="space-y-1">
                        {contact.emails.map((email: Json, i: number) => (
                          isEmail(email) && (
                            <p key={i}>{email.address}</p>
                          )
                        ))}
                      </div>
                    ) : (
                      <p>-</p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ответственный</p>
                    <p>{contact.responsible_user_id || "-"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Заметки</p>
                    <p className="whitespace-pre-wrap">{contact.notes || "-"}</p>
                  </div>
                </div>
              ) : (
                <p>Данные не найдены</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
