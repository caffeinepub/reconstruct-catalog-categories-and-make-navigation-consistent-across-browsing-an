import type { Product } from "@/backend";
import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      if (!actor) return [];
      const products = await actor.getAllProducts();
      // Seed if empty
      if (products.length === 0) {
        await actor.seedProducts();
        return await actor.getAllProducts();
      }
      return products;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useProduct(id: number) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!actor) return null;
      return await actor.getProduct(BigInt(id));
    },
    enabled: !!actor && !isFetching && !!id,
  });
}
