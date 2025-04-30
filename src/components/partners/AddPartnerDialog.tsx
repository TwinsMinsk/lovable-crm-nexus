
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAddPartner } from "@/hooks/useAddPartner";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export function AddPartnerDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [terms, setTerms] = useState("");

  const addPartnerMutation = useAddPartner();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addPartnerMutation.mutateAsync({
        name,
        contact_person: contactPerson || undefined,
        phone: phone || undefined,
        email: email || undefined,
        specialization: specialization || undefined,
        terms: terms || undefined
      });

      toast.success("Партнер успешно добавлен");
      resetForm();
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Ошибка: ${error.message}`);
      } else {
        toast.error("Произошла неизвестная ошибка");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setContactPerson("");
    setPhone("");
    setEmail("");
    setSpecialization("");
    setTerms("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить партнера
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Добавить нового партнера</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
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

          <div className="grid grid-cols-2 gap-4">
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

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Отмена
            </Button>
            <Button type="submit" disabled={addPartnerMutation.isPending}>
              {addPartnerMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
