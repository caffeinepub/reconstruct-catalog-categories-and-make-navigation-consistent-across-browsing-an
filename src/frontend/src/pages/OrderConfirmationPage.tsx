import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrder } from "@/hooks/useCart";
import { useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function OrderConfirmationPage() {
  const { orderId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(Number(orderId));

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-4 text-2xl font-semibold">Order not found</h1>
        <Button onClick={() => navigate({ to: "/catalog" })}>
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600" />
          <h1 className="mb-2 font-serif text-3xl font-light md:text-4xl">
            Order <span className="font-handwritten italic">Confirmed</span>
          </h1>
          <p className="text-muted-foreground">
            Thank you for your purchase! Your order has been received.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Number:</span>
                <span className="font-semibold">#{order.id.toString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>
                  {new Date(
                    Number(order.orderTime) / 1000000,
                  ).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold">Shipping Address</h3>
              <div className="text-sm text-muted-foreground">
                <p>{order.shippingInfo.fullName}</p>
                <p>{order.shippingInfo.address}</p>
                <p>
                  {order.shippingInfo.city}, {order.shippingInfo.postalCode}
                </p>
                <p>{order.shippingInfo.country}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 font-semibold">Contact Information</h3>
              <div className="text-sm text-muted-foreground">
                <p>{order.shippingInfo.email}</p>
                <p>{order.shippingInfo.phone}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 font-semibold">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex justify-between text-sm"
                  >
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-muted-foreground">
                        Size: {item.size} • Qty: {item.quantity.toString()}
                      </p>
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
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span>${(Number(order.totalCents) / 100).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate({ to: "/catalog" })}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
