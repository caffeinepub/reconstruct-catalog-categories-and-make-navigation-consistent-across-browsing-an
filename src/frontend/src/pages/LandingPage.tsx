import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  COLLECTIONS,
  PRODUCT_TYPES,
  buildCatalogSearch,
} from "@/constants/taxonomy";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();

  // Use collections from taxonomy (excluding "All Collections")
  const categoryCards = COLLECTIONS.filter((c) => c.value !== "").map(
    (collection) => ({
      name: collection.label,
      value: collection.value,
      image: getCollectionEmoji(collection.value),
      description: getCollectionDescription(collection.value),
    }),
  );

  // Use product types from taxonomy (excluding "All Items")
  const productTypeButtons = PRODUCT_TYPES.filter((pt) => pt.value !== "");

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="/assets/generated/ciene-lux-hero.dim_1600x600.png"
          alt="Ciene Lux Fashion Collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-background/20">
          <div className="container flex h-full items-center">
            <div className="max-w-2xl space-y-6">
              <h1 className="font-serif text-5xl font-light tracking-wide md:text-6xl lg:text-7xl">
                Ciene <span className="font-handwritten italic">Lux</span>
              </h1>
              <p className="text-xl text-muted-foreground md:text-2xl">
                Discover timeless elegance in every piece
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  onClick={() =>
                    navigate({
                      to: "/catalog",
                      search: buildCatalogSearch({ gender: "female" }),
                    })
                  }
                  className="group"
                >
                  Shop Women
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    navigate({
                      to: "/catalog",
                      search: buildCatalogSearch({ gender: "male" }),
                    })
                  }
                  className="group"
                >
                  Shop Men
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container py-16">
        <h2 className="mb-8 text-center font-serif text-3xl font-light md:text-4xl">
          Shop by <span className="font-handwritten italic">Collection</span>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Card
              key={category.value}
              className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg"
              onClick={() =>
                navigate({
                  to: "/catalog",
                  search: buildCatalogSearch({ collection: category.value }),
                })
              }
            >
              <CardContent className="flex flex-col items-center p-8 text-center">
                <div className="mb-4 text-6xl transition-transform group-hover:scale-110">
                  {category.image}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{category.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Types Section */}
      <section className="bg-muted/30 py-16">
        <div className="container">
          <h2 className="mb-8 text-center font-serif text-3xl font-light md:text-4xl">
            Explore Our{" "}
            <span className="font-handwritten italic">Collection</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
            {productTypeButtons.map((type) => (
              <Button
                key={type.value}
                variant="outline"
                className="h-auto py-4 text-base"
                onClick={() =>
                  navigate({
                    to: "/catalog",
                    search: buildCatalogSearch({ productType: type.value }),
                  })
                }
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-16 text-center">
        <h2 className="mb-4 font-serif text-3xl font-light md:text-4xl">
          New Arrivals <span className="font-handwritten italic">Weekly</span>
        </h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Be the first to discover our latest collections
        </p>
        <Button size="lg" onClick={() => navigate({ to: "/catalog" })}>
          View All Products
        </Button>
      </section>
    </div>
  );
}

// Helper functions for collection metadata
function getCollectionEmoji(collection: string): string {
  const emojiMap: Record<string, string> = {
    Native: "🌿",
    Formal: "👔",
    Casual: "👕",
    Evening: "✨",
  };
  return emojiMap[collection] || "🛍️";
}

function getCollectionDescription(collection: string): string {
  const descriptionMap: Record<string, string> = {
    Native: "Traditional elegance",
    Formal: "Sophisticated style",
    Casual: "Everyday comfort",
    Evening: "Glamorous nights",
  };
  return descriptionMap[collection] || "Discover more";
}
