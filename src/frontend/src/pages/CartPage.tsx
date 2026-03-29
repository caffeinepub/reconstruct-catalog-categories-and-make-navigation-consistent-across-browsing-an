import OrderSummary from "@/components/checkout/OrderSummary";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart, useRemoveFromCart, useUpdateCartItem } from "@/hooks/useCart";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading } = useCart();
  const removeFromCart = useRemoveFromCart();
  const updateCartItem = useUpdateCartItem();

  const handleRemove = async (productId: bigint, size: string) => {
    try {
      await removeFromCart.mutateAsync({ productId, size });
      toast.success("Item removed from cart");
    } catch (_error) {
      toast.error("Failed to remove item");
    }
  };

  const handleUpdateQuantity = async (
    productId: bigint,
    size: string,
    newQuantity: number,
  ) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem.mutateAsync({
        productId,
        size,
        newQuantity: BigInt(newQuantity),
      });
    } catch (_error) {
      toast.error("Failed to update quantity");
    }
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-2xl font-semibold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">
          Add some items to get started
        </p>
        <Button onClick={() => navigate({ to: "/catalog" })}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-8 font-serif text-3xl font-light md:text-4xl">
        Shopping <span className="font-handwritten italic">Cart</span>
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <Card key={`${item.product.id}-${item.size}`}>
                <CardContent className="flex gap-4 p-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-semibold">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Size: {item.size} • {item.product.brand}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.size,
                              Number(item.quantity) - 1,
                            )
                          }
                          disabled={updateCartItem.isPending}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          min="1"
                          value={Number(item.quantity)}
                          onChange={(e) =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.size,
                              Number.parseInt(e.target.value) || 1,
                            )
                          }
                          className="h-8 w-16 text-center"
                          disabled={updateCartItem.isPending}
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.size,
                              Number(item.quantity) + 1,
                            )
                          }
                          disabled={updateCartItem.isPending}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-semibold">
                        $
                        {(
                          (Number(item.product.priceCents) *
                            Number(item.quantity)) /
                          100
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.product.id, item.size)}
                    disabled={removeFromCart.isPending}
                    aria-label="Remove item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary cart={cart} />
            </CardContent>
            <Separator />
            <CardFooter className="flex-col gap-2 pt-6">
              <Button
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: "/checkout" })}
              >
                Proceed to Checkout
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => navigate({ to: "/catalog" })}
              >
                Continue Shopping
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
