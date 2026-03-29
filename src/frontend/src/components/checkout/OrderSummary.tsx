import type { Cart } from "@/backend";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  cart: Cart;
}

export default function OrderSummary({ cart }: OrderSummaryProps) {
  const subtotal = Number(cart.totalCents) / 100;
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {cart.items.map((item) => (
          <div
            key={`${item.product.id}-${item.size}`}
            className="flex justify-between text-sm"
          >
            <span className="text-muted-foreground">
              {item.product.name} × {item.quantity.toString()}
            </span>
            <span>
              $
              {(
                (Number(item.product.priceCents) * Number(item.quantity)) /
                100
              ).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Shipping</span>
          <span>{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
        </div>
      </div>

      <Separator />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
