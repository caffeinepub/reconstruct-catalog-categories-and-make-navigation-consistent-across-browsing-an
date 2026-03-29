import ImageMagnifier from "@/components/product/ImageMagnifier";
import RelatedProducts from "@/components/product/RelatedProducts";
import ShareActions from "@/components/product/ShareActions";
import SizeSelector from "@/components/product/SizeSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAddToCart } from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProducts";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Loader2, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { productId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(Number(productId));
  const addToCart = useAddToCart();
  const [selectedSize, setSelectedSize] = useState<string>("");

  const handleAddToCart = async () => {
    if (!product) return;

    if (product.sizeRange.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      await addToCart.mutateAsync({
        productId: product.id,
        size: selectedSize || product.sizeRange[0] || "ONE SIZE",
        quantity: BigInt(1),
      });
      toast.success("Added to cart");
    } catch (_error) {
      toast.error("Failed to add to cart");
    }
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-4 text-2xl font-semibold">Product not found</h1>
        <Button onClick={() => navigate({ to: "/catalog" })}>
          Back to Catalog
        </Button>
      </div>
    );
  }

  const materials = Object.entries(product.material)
    .filter(([_, value]) => value)
    .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1));

  return (
    <div className="container py-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <ImageMagnifier src={product.imageUrl} alt={product.name} />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{product.brand}</Badge>
              {!product.available && (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>
            <h1 className="mb-2 font-serif text-3xl font-light md:text-4xl">
              {product.name}
            </h1>
            <p className="text-2xl font-semibold">
              ${(Number(product.priceCents) / 100).toFixed(2)}
            </p>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-sm font-semibold">Details</h3>
              <dl className="space-y-1 text-sm">
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Collection:</dt>
                  <dd className="capitalize">{product.collection}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Type:</dt>
                  <dd className="capitalize">{product.productType}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-muted-foreground">Color:</dt>
                  <dd className="capitalize">{product.color}</dd>
                </div>
                {materials.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Material:</dt>
                    <dd>{materials.join(", ")}</dd>
                  </div>
                )}
              </dl>
            </div>

            {product.sizeRange.length > 0 && (
              <SizeSelector
                sizes={product.sizeRange}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            )}
          </div>

          <div className="flex gap-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={!product.available || addToCart.isPending}
            >
              {addToCart.isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ShoppingCart className="mr-2 h-4 w-4" />
              )}
              Add to Cart
            </Button>
            <ShareActions productName={product.name} />
          </div>
        </div>
      </div>

      <Separator className="my-12" />

      <RelatedProducts currentProduct={product} />
    </div>
  );
}
