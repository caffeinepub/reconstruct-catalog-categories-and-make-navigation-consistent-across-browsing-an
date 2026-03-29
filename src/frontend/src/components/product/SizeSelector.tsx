import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
}: SizeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Select Size *</Label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSelectSize(size)}
            className="min-w-[3rem]"
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
