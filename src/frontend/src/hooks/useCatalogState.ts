import type { Product } from "@/backend";
import { useMemo, useState } from "react";

interface CatalogFilters {
  gender: string;
  collection: string;
  productType: string;
  colors: string[];
  materials: string[];
  brands: string[];
  priceRange: [number, number];
}

const initialFilters: CatalogFilters = {
  gender: "",
  collection: "",
  productType: "",
  colors: [],
  materials: [],
  brands: [],
  priceRange: [0, 1000],
};

export function useCatalogState(products: Product[]) {
  const [filters, setFilters] = useState<CatalogFilters>(initialFilters);
  const [sortBy, setSortBy] = useState<string>("featured");

  const resetFilters = () => {
    setFilters(initialFilters);
    setSortBy("featured");
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = products.filter((product) => {
      // Gender filter
      if (filters.gender && product.gender !== filters.gender) return false;

      // Collection filter (backend uses "collection" field)
      if (filters.collection && product.collection !== filters.collection)
        return false;

      // Product type filter
      if (filters.productType && product.productType !== filters.productType)
        return false;

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color))
        return false;

      // Material filter
      if (filters.materials.length > 0) {
        const productMaterials = Object.keys(product.material).filter(
          (key) => product.material[key as keyof typeof product.material],
        );
        if (!filters.materials.some((m) => productMaterials.includes(m)))
          return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand))
        return false;

      // Price range filter
      const price = Number(product.priceCents) / 100;
      if (price < filters.priceRange[0] || price > filters.priceRange[1])
        return false;

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => Number(a.priceCents) - Number(b.priceCents));
        break;
      case "price-desc":
        filtered.sort((a, b) => Number(b.priceCents) - Number(a.priceCents));
        break;
      case "newest":
        filtered.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return filtered;
  };

  return {
    filters,
    setFilters,
    sortBy,
    setSortBy,
    resetFilters,
    getFilteredAndSortedProducts,
  };
}
