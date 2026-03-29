interface BrandMarkProps {
  className?: string;
}

export default function BrandMark({ className = "" }: BrandMarkProps) {
  return (
    <h1 className={`font-serif text-4xl font-light tracking-wide ${className}`}>
      Ciene <span className="font-handwritten italic">Lux</span>
    </h1>
  );
}
