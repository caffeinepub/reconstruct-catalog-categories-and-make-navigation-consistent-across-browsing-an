import { useState } from "react";

interface ImageMagnifierProps {
  src: string;
  alt: string;
}

export default function ImageMagnifier({ src, alt }: ImageMagnifierProps) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const elem = e.currentTarget;
    const { top, left, width, height } = elem.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMagnifierPosition({ x, y });
  };

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-lg bg-muted"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseLeave={() => setShowMagnifier(false)}
      onMouseMove={handleMouseMove}
    >
      <img src={src} alt={alt} className="h-full w-full object-cover" />
      {showMagnifier && (
        <div
          className="pointer-events-none absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: "200%",
            backgroundPosition: `${magnifierPosition.x}% ${magnifierPosition.y}%`,
          }}
        />
      )}
    </div>
  );
}
