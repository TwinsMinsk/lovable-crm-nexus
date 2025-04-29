
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLead } from "@/hooks/useLead";
import { useUpdateLead } from "@/hooks/useUpdateLead";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { pencil, eye } from "lucide-react";

export default function LeadDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: lead, isLoading, error } = useLead(id);
  const { mutate: updateLead } = useUpdateLead();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    status: "",
    comment: "",
    responsible_user_id: ""
  });
  
  // Initialize form data when lead is loaded
  useState(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        source: lead.source || "",
        status: lead.status || "",
        comment: lead.comment || "",
        responsible_user_id: lead.responsible_user_id || ""
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    
    updateLead(
      { id, data: formData },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Лид успешно обновлен");
        },
        onError: (error) => {
          toast.error(`Ошибка: ${error.message}`);
        }
      }
    );
  };
  
  const handleEdit = () => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        phone: lead.phone || "",
        email: lead.email || "",
        source: lead.source || "",
        status: lead.status || "",
        comment: lead.comment || "",
        responsible_user_id: lead.responsible_user_id || ""
      });
      setIsEditing(true);
    }
  };
  
  if (error) {
    return (
      <MainLayout>
        <div className="p-4">
          <div className="text-red-500">
            Ошибка при загрузке лида: {error.message}
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
            {isLoading ? <Skeleton className="h-8 w-48" /> : `Лид: ${lead?.name || ""}`}
          </h1>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              onClick={() => navigate("/leads")}
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
                {isEditing ? "Редактирование лида" : "Информация о лиде"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Имя</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input 
                        id="phone" 
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        name="email"
                        type="email"
                        value={formData.email || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Источник</Label>
                      <Input 
                        id="source" 
                        name="source"
                        value={formData.source || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Статус</Label>
                      <Input 
                        id="status" 
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="responsible_user_id">Ответственный</Label>
                      <Input 
                        id="responsible_user_id" 
                        name="responsible_user_id"
                        value={formData.responsible_user_id || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Комментарий</Label>
                    <Input 
                      id="comment" 
                      name="comment"
                      value={formData.comment || ""}
                      onChange={handleInputChange}
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
              ) : lead ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Имя</p>
                    <p>{lead.name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Телефон</p>
                    <p>{lead.phone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email</p>
                    <p>{lead.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Источник</p>
                    <p>{lead.source || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Статус</p>
                    <p>{lead.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ответственный</p>
                    <p>{lead.responsible_user_id || "-"}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-sm font-medium text-muted-foreground">Комментарий</p>
                    <p>{lead.comment || "-"}</p>
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
