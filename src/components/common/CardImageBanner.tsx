import { cn } from "@/lib/utils";

type CardImageBannerProps = {
  src: string;
  alt: string;
  className?: string;
};

export function CardImageBanner({ src, alt, className }: CardImageBannerProps) {
  return (
    <div
      className={cn(
        "relative h-[4.5rem] w-full shrink-0 overflow-hidden md:h-20",
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/35 via-navy/5 to-transparent" />
    </div>
  );
}
