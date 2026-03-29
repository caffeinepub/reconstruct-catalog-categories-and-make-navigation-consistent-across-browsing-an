import type { Product } from "@/backend";
import ProductCard from "@/components/catalog/ProductCard";
import { useProducts } from "@/hooks/useProducts";

interface RelatedProductsProps {
  currentProduct: Product;
}

export default function RelatedProducts({
  currentProduct,
}: RelatedProductsProps) {
  const { data: allProducts } = useProducts();

  const relatedProducts = (allProducts || [])
    .filter((p) => {
      if (p.id === currentProduct.id) return false;
      return (
        p.collection === currentProduct.collection ||
        p.gender === currentProduct.gender ||
        p.productType === currentProduct.productType ||
        p.brand === currentProduct.brand
      );
    })
    .slice(0, 4);

  if (relatedProducts.length === 0) return null;

  return (
    <div>
      <h2 className="mb-6 font-serif text-2xl font-light md:text-3xl">
        You May Also <span className="font-handwritten italic">Like</span>
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {relatedProducts.map((product) => (
          <ProductCard key={product.id.toString()} product={product} />
        ))}
      </div>
    </div>
  );
}
