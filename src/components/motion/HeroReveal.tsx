import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type HeroRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "content" | "bg";
};

export function HeroReveal({ children, className, delay = 0, variant = "content" }: HeroRevealProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        variant === "bg" ? "reveal-hero-bg" : "reveal-hero",
        visible && "is-visible",
        className,
      )}
      style={visible ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
