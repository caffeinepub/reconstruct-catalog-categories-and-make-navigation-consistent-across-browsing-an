import { Button } from "@/components/ui/button";
import { PRODUCT_TYPES } from "@/constants/taxonomy";

interface ProductTypeChipsProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export default function ProductTypeChips({
  selectedType,
  onSelectType,
}: ProductTypeChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PRODUCT_TYPES.map((type) => (
        <Button
          key={type.value}
          variant={selectedType === type.value ? "default" : "outline"}
          size="sm"
          onClick={() => onSelectType(type.value)}
        >
          {type.label}
        </Button>
      ))}
    </div>
  );
}
