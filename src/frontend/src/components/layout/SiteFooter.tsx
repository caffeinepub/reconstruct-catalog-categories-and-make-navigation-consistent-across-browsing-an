import { COLLECTIONS, GENDERS, buildCatalogSearch } from "@/constants/taxonomy";
import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "ciene-lux";

  // Build shop links from taxonomy
  const shopLinks = [
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
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to="/catalog"
                    search={link.search}
                    className="hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Customer Care</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Shipping Info
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Returns
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Size Guide
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Our Story
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Sustainability
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="hover:text-foreground transition-colors"
                >
                  Careers
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold">Follow Us</h3>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <SiFacebook className="h-5 w-5" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="X (Twitter)"
              >
                <SiX className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Ciene Lux. All rights reserved.</p>
          <p className="mt-2 flex items-center justify-center gap-1">
            Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" />{" "}
            using{" "}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
