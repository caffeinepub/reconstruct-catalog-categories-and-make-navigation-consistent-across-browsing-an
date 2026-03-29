import type { Product } from "@/backend";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";

interface FilterSidebarProps {
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

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onReset,
  products,
}: FilterSidebarProps) {
  const availableColors = Array.from(
    new Set(products.map((p) => p.color)),
  ).sort();
  const availableBrands = Array.from(
    new Set(products.map((p) => p.brand)),
  ).sort();
  const availableMaterials = Array.from(
    new Set(
      products.flatMap((p) =>
        Object.keys(p.material).filter(
          (key) => p.material[key as keyof typeof p.material],
        ),
      ),
    ),
  ).sort();

  const maxPrice = Math.max(
    ...products.map((p) => Number(p.priceCents) / 100),
    500,
  );

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleMaterialToggle = (material: string) => {
    const newMaterials = filters.materials.includes(material)
      ? filters.materials.filter((m) => m !== material)
      : [...filters.materials, material];
    onFiltersChange({ ...filters, materials: newMaterials });
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: newBrands });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Filters</h2>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <X className="mr-1 h-4 w-4" />
          Clear
        </Button>
      </div>

      <Separator />

      <div>
        <Label className="mb-3 block text-sm font-semibold">Price Range</Label>
        <Slider
          min={0}
          max={maxPrice}
          step={10}
          value={filters.priceRange}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              priceRange: value as [number, number],
            })
          }
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${filters.priceRange[0]}</span>
          <span>${filters.priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {availableColors.length > 0 && (
        <>
          <div>
            <Label className="mb-3 block text-sm font-semibold">Color</Label>
            <div className="space-y-2">
              {availableColors.map((color) => (
                <div key={color} className="flex items-center space-x-2">
                  <Checkbox
                    id={`color-${color}`}
                    checked={filters.colors.includes(color)}
                    onCheckedChange={() => handleColorToggle(color)}
                  />
                  <label
                    htmlFor={`color-${color}`}
                    className="text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {color}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {availableMaterials.length > 0 && (
        <>
          <div>
            <Label className="mb-3 block text-sm font-semibold">Material</Label>
            <div className="space-y-2">
              {availableMaterials.map((material) => (
                <div key={material} className="flex items-center space-x-2">
                  <Checkbox
                    id={`material-${material}`}
                    checked={filters.materials.includes(material)}
                    onCheckedChange={() => handleMaterialToggle(material)}
                  />
                  <label
                    htmlFor={`material-${material}`}
                    className="text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {material}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <Separator />
        </>
      )}

      {availableBrands.length > 0 && (
        <div>
          <Label className="mb-3 block text-sm font-semibold">Brand</Label>
          <div className="space-y-2">
            {availableBrands.map((brand) => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandToggle(brand)}
                />
                <label
                  htmlFor={`brand-${brand}`}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {brand}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
