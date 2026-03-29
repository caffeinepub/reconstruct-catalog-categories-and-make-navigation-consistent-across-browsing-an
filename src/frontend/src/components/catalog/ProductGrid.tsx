import type { Product } from "@/backend";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

const PRODUCTS_PER_PAGE = 12;

export default function ProductGrid({ products }: ProductGridProps) {
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  return (
    <div className="space-y-8">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedProducts.map((product, index) => (
          <div
            key={product.id.toString()}
            className="animate-in fade-in slide-in-from-bottom-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: "backwards",
            }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setDisplayCount((prev) => prev + PRODUCTS_PER_PAGE)}
          >
            Load More Products
          </Button>
        </div>
      )}

      {products.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p>No products found matching your filters.</p>
        </div>
      )}
    </div>
  );
}
