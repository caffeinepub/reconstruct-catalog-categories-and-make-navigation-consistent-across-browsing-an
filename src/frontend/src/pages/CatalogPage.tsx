import FilterSidebar from "@/components/catalog/FilterSidebar";
import MobileFiltersPanel from "@/components/catalog/MobileFiltersPanel";
import ProductGrid from "@/components/catalog/ProductGrid";
import ProductTypeChips from "@/components/catalog/ProductTypeChips";
import SortControl from "@/components/catalog/SortControl";
import { Button } from "@/components/ui/button";
import { useCatalogState } from "@/hooks/useCatalogState";
import { useProducts } from "@/hooks/useProducts";
import { useSearch } from "@tanstack/react-router";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

const SKELETON_IDS = ["sk1", "sk2", "sk3", "sk4", "sk5", "sk6"];

export default function CatalogPage() {
  const search = useSearch({ strict: false }) as {
    gender?: string;
    collection?: string;
    productType?: string;
  };
  const { data: allProducts, isLoading } = useProducts();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    resetFilters,
    getFilteredAndSortedProducts,
  } = useCatalogState(allProducts || []);

  // Sync URL search params to filter state
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      gender: search.gender || "",
      collection: search.collection || "",
      productType: search.productType || "",
    }));
  }, [search.gender, search.collection, search.productType, setFilters]);

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="mb-2 font-serif text-3xl font-light md:text-4xl">
          Discover <span className="font-handwritten italic">Fashion</span>
        </h1>
        <p className="text-muted-foreground">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"} found
        </p>
      </div>

      <ProductTypeChips
        selectedType={filters.productType}
        onSelectType={(type) =>
          setFilters((prev) => ({ ...prev, productType: type }))
        }
      />

      <div className="mt-6 flex items-center justify-between gap-4">
        <Button
          variant="outline"
          className="md:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          Filters
        </Button>
        <div className="flex-1" />
        <SortControl value={sortBy} onChange={setSortBy} />
      </div>

      <div className="mt-6 flex gap-8">
        <aside className="hidden w-64 shrink-0 md:block">
          <div className="sticky top-24">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onReset={resetFilters}
              products={allProducts || []}
            />
          </div>
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {SKELETON_IDS.map((id) => (
                <div
                  key={id}
                  className="h-96 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={filteredProducts} />
          )}
        </div>
      </div>

      <MobileFiltersPanel
        open={mobileFiltersOpen}
        onOpenChange={setMobileFiltersOpen}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={resetFilters}
        products={allProducts || []}
      />
    </div>
  );
}
