import type { Product } from "@/backend";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import FilterSidebar from "./FilterSidebar";

interface MobileFiltersPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: {
    gender: string;
    collection: string;
    productType: string;
    colors: string[];
    materials: string[];
    brands: string[];
    priceRange: [number, number];
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
  products: Product[];
}

export default function MobileFiltersPanel({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
  onReset,
  products,
}: MobileFiltersPanelProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <FilterSidebar
            filters={filters}
            onFiltersChange={onFiltersChange}
            onReset={onReset}
            products={products}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
