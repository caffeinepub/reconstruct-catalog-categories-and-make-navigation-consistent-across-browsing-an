import type { Cart, Order, ShippingInfo } from "@/backend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useCart() {
  const { actor, isFetching } = useActor();

  return useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!actor) return { items: [], totalCents: BigInt(0) };
      return await actor.getCart();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddToCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      size,
      quantity,
    }: {
      productId: bigint;
      size: string;
      quantity: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.addToCart(productId, size, quantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useRemoveFromCart() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      size,
    }: { productId: bigint; size: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.removeFromCart(productId, size);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useUpdateCartItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      size,
      newQuantity,
    }: {
      productId: bigint;
      size: string;
      newQuantity: bigint;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.updateCartItem(productId, size, newQuantity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useCheckout() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (shippingInfo: ShippingInfo) => {
      if (!actor) throw new Error("Actor not initialized");
      return await actor.checkout(shippingInfo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
}

export function useOrder(orderId: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Order | null>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getOrder(BigInt(orderId));
    },
    enabled: !!actor && !isFetching && !!orderId,
  });
}
