
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePartner } from "@/hooks/usePartner";
import { useUpdatePartner } from "@/hooks/useUpdatePartner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: partner, isLoading, error } = usePartner(id);
  const updatePartnerMutation = useUpdatePartner();
  
  const [name, setName] = useState(partner?.name || "");
  const [contactPerson, setContactPerson] = useState(partner?.contact_person || "");
  const [phone, setPhone] = useState(partner?.phone || "");
  const [email, setEmail] = useState(partner?.email || "");
  const [specialization, setSpecialization] = useState(partner?.specialization || "");
  const [terms, setTerms] = useState(partner?.terms || "");
  
  // Update form when partner data is loaded
  useState(() => {
    if (partner) {
      setName(partner.name);
      setContactPerson(partner.contact_person || "");
      setPhone(partner.phone || "");
      setEmail(partner.email || "");
      setSpecialization(partner.specialization || "");
      setTerms(partner.terms || "");
    }
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id) return;
    
    try {
      await updatePartnerMutation.mutateAsync({
        id,
        name,
        contact_person: contactPerson || null,
        phone: phone || null,
        email: email || null,
        specialization: specialization || null,
        terms: terms || null
      });
      
      toast.success("Партнер успешно обновлен");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка при обновлении: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка при обновлении");
      }
    }
  };
  
  if (error) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>
        <div className="text-red-500">
          Ошибка при загрузке партнера: {error instanceof Error ? error.message : "Неизвестная ошибка"}
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-32" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!partner) {
    return (
      <div className="space-y-4">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" /> Назад
        </Button>
        <div>Партнер не найден</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        onClick={() => navigate(-1)}
        className="gap-2"
      >
        <ChevronLeft className="h-4 w-4" /> Назад к партнерам
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>Редактирование партнера</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Название компании*</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Введите название компании"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Контактное лицо</Label>
              <Input
                id="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="ФИО контактного лица"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@company.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialization">Специализация</Label>
              <Input
                id="specialization"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                placeholder="Основное направление деятельности"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="terms">Условия сотрудничества</Label>
              <Textarea
                id="terms"
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                placeholder="Опишите условия сотрудничества"
              />
            </div>
            
            <div className="flex justify-end pt-2">
              <Button 
                type="submit" 
                disabled={updatePartnerMutation.isPending}
                className="gap-2"
              >
                <Save className="h-4 w-4" />
                {updatePartnerMutation.isPending ? "Сохранение..." : "Сохранить изменения"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
