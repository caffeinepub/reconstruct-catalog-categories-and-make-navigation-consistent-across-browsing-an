import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { COLLECTIONS, GENDERS, buildCatalogSearch } from "@/constants/taxonomy";
import { useCart } from "@/hooks/useCart";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart } from "lucide-react";

export default function SiteHeader() {
  const navigate = useNavigate();
  const { data: cart } = useCart();
  const itemCount =
    cart?.items.reduce((sum, item) => sum + Number(item.quantity), 0) || 0;

  // Build navigation links from taxonomy
  const navLinks = [
    ...GENDERS.map((gender) => ({
      label: gender.label,
      search: buildCatalogSearch({ gender: gender.value }),
    })),
    ...COLLECTIONS.filter((c) => c.value !== "").map((collection) => ({
      label: collection.label,
      search: buildCatalogSearch({ collection: collection.value }),
    })),
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/generated/ciene-lux-logo.dim_512x256.png"
              alt="Ciene Lux"
              className="h-8 w-auto"
            />
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to="/catalog"
                search={link.search}
                className="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/catalog" })}
            aria-label="Search products"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate({ to: "/cart" })}
            className="relative"
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
              >
                {itemCount}
              </Badge>
            )}
          </Button>
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    to="/catalog"
                    search={link.search}
                    className="text-lg font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded px-2 py-1"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
