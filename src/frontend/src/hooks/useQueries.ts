import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

// This file is intentionally minimal as cart and product queries are in their respective hooks
export function useInitializeBackend() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ["initialize-backend"],
    queryFn: async () => {
      if (!actor) return null;
      // Seed products on first load if needed
      try {
        const products = await actor.getAllProducts();
        if (products.length === 0) {
          await actor.seedProducts();
        }
      } catch (error) {
        console.error("Failed to initialize backend:", error);
      }
      return true;
    },
    enabled: !!actor && !isFetching,
    staleTime: Number.POSITIVE_INFINITY,
  });
}
