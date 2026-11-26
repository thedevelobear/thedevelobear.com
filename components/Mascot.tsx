import Image from "next/image";
import type { ReactNode } from "react";
import { mascot } from "@/lib/mascot";

/** The big bear. Children are printed on its T-shirt and scale with it. */
export function Mascot({
  sizes,
  className = "",
  children,
}: {
  sizes: string;
  className?: string;
  /** Short, non-interactive text for the shirt. */
  children?: ReactNode;
}) {
  return (
    <div className={`@container relative ${className}`}>
      <Image
        src={mascot.src}
        alt={mascot.alt}
        width={mascot.width}
        height={mascot.height}
        sizes={sizes}
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full"
      />
      {children && (
        <div
          className="display absolute flex flex-col items-center justify-center text-center text-ink"
          style={mascot.shirt}
        >
          {children}
        </div>
      )}
    </div>
  );
}

/** The head and the top of the shirt, to peek over an edge. Decorative. */
export function MascotHead({ className = "" }: { className?: string }) {
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{
        aspectRatio: `${mascot.width} / ${mascot.height * mascot.headHeight}`,
      }}
    >
      <Image
        src={mascot.src}
        alt=""
        width={mascot.width}
        height={mascot.height}
        sizes="256px"
        className="h-auto w-full"
      />
    </div>
  );
}
