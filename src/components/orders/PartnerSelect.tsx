
import { usePartners } from "@/hooks/usePartners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PartnerSelectProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function PartnerSelect({ value, onChange, required = false, disabled = false }: PartnerSelectProps) {
  const { data: partners, isLoading } = usePartners();
  
  return (
    <div className="space-y-2">
      <Label htmlFor="partner_id">Партнер{required ? '*' : ''}</Label>
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue placeholder="Выберите партнера" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <SelectItem value="loading" disabled>Загрузка...</SelectItem>
          ) : partners?.length ? (
            <>
              <SelectItem value="">Не выбран</SelectItem>
              {partners.map((partner) => (
                <SelectItem key={partner.id} value={partner.id}>
                  {partner.name}
                </SelectItem>
              ))}
            </>
          ) : (
            <SelectItem value="no-partners" disabled>
              Нет доступных партнеров
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
