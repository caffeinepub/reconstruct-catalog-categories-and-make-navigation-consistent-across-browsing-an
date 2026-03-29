import type { Product } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: `/product/${product.id}` });
  };

  return (
    <Card
      className="group h-full cursor-pointer overflow-hidden transition-all hover:shadow-lg"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-tight line-clamp-2">
            {product.name}
          </h3>
          {!product.available && (
            <Badge variant="destructive" className="shrink-0 text-xs">
              Out
            </Badge>
          )}
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{product.brand}</p>
        <p className="text-lg font-semibold">
          ${(Number(product.priceCents) / 100).toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
