/**
 * Shared taxonomy configuration for Ciene Lux storefront.
 * Defines collection categories and product types used across navigation, filters, and catalog.
 */

export interface TaxonomyItem {
  label: string;
  value: string;
}

// Collection categories (maps to Product.collection in backend)
export const COLLECTIONS: TaxonomyItem[] = [
  { label: "All Collections", value: "" },
  { label: "Native", value: "Native" },
  { label: "Formal", value: "Formal" },
  { label: "Casual", value: "Casual" },
  { label: "Evening", value: "Evening" },
];

// Product types (maps to Product.productType in backend)
export const PRODUCT_TYPES: TaxonomyItem[] = [
  { label: "All Items", value: "" },
  { label: "Gowns", value: "gown" },
  { label: "Sundresses", value: "sundress" },
  { label: "Tops", value: "top" },
  { label: "Pants", value: "pants" },
  { label: "Lingerie", value: "lingerie" },
  { label: "Shoes", value: "shoes" },
  { label: "Watches", value: "watch" },
  { label: "Perfumes", value: "perfume" },
  { label: "Belts", value: "belt" },
  { label: "Caps", value: "cap" },
  { label: "Bags", value: "bag" },
  { label: "Specs", value: "specs" },
];

// Gender options
export const GENDERS: TaxonomyItem[] = [
  { label: "Women", value: "female" },
  { label: "Men", value: "male" },
];

/**
 * Build catalog search params for navigation
 */
export function buildCatalogSearch(params: {
  gender?: string;
  collection?: string;
  productType?: string;
}): Record<string, string> {
  const search: Record<string, string> = {};
  if (params.gender) search.gender = params.gender;
  if (params.collection) search.collection = params.collection;
  if (params.productType) search.productType = params.productType;
  return search;
}
