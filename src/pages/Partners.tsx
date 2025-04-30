
import { AddPartnerDialog } from "@/components/partners/AddPartnerDialog";
import { PartnerList } from "@/components/partners/PartnerList";

export default function Partners() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Партнеры</h1>
        <AddPartnerDialog />
      </div>
      
      <PartnerList />
    </div>
  );
}
