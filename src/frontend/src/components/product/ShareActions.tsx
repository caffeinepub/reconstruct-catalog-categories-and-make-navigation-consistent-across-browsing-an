import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ShareActionsProps {
  productName: string;
}

export default function ShareActions({ productName }: ShareActionsProps) {
  const canShare =
    typeof navigator !== "undefined" && typeof navigator.share !== "undefined";

  const handleShare = async () => {
    const url = window.location.href;

    if (canShare) {
      try {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} on Ciene Lux`,
          url,
        });
      } catch (_error) {
        // User cancelled or error occurred
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      } catch (_error) {
        toast.error("Failed to copy link");
      }
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleShare}
      aria-label="Share product"
    >
      {canShare ? (
        <Share2 className="h-4 w-4" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
    </Button>
  );
}
